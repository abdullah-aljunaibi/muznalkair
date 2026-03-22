"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isCompleted: boolean;
  documents: Document[];
}

interface SidebarLesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  isCompleted: boolean;
  unlocked: boolean;
}

interface Props {
  courseId: string;
  courseTitle: string;
  lesson: Lesson;
  allLessons: SidebarLesson[];
  completedCount: number;
  totalCount: number;
  prevLessonId: string | null;
  nextLessonId: string | null;
  savedWatchedSecs: number;
}

const SAVE_INTERVAL_MS = 30000;
const PLAYBACK_SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

type EmbedType = "youtube" | "vimeo" | "other" | "none";

function getEmbedType(videoUrl: string | null): EmbedType {
  if (!videoUrl) return "none";

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      return "youtube";
    }

    if (host.includes("vimeo.com")) {
      return "vimeo";
    }
  } catch {
    return "other";
  }

  return "other";
}

function buildResumeVideoUrl(videoUrl: string, savedSecs: number) {
  if (savedSecs <= 0) return videoUrl;

  try {
    const url = new URL(videoUrl);
    const embedType = getEmbedType(videoUrl);

    if (embedType === "youtube") {
      url.searchParams.set("start", String(savedSecs));
      return url.toString();
    }

    if (embedType === "vimeo") {
      url.hash = `t=${savedSecs}s`;
      return url.toString();
    }
  } catch {
    return videoUrl;
  }

  return videoUrl;
}

function formatWatchedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function LessonPlayer({
  courseId,
  courseTitle,
  lesson,
  allLessons,
  completedCount,
  totalCount,
  prevLessonId,
  nextLessonId,
  savedWatchedSecs,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"description" | "documents">("description");
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const sessionStartedAtRef = useRef<number | null>(null);
  const lastSavedWatchedSecsRef = useRef(savedWatchedSecs);

  const nextLesson = allLessons.find((l) => l.id === nextLessonId) || null;
  const embedType = getEmbedType(lesson.videoUrl);
  const videoSrc = lesson.videoUrl
    ? buildResumeVideoUrl(lesson.videoUrl, savedWatchedSecs)
    : null;

  // Sync local completed state when lesson prop changes (e.g. navigation)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop-to-state sync
  useEffect(() => { setIsCompleted(lesson.isCompleted); }, [lesson.isCompleted, lesson.id]);

  useEffect(() => {
    lastSavedWatchedSecsRef.current = savedWatchedSecs;

    if (!lesson.videoUrl) {
      sessionStartedAtRef.current = null;
      return;
    }

    sessionStartedAtRef.current = Date.now();

    const getWatchedSecs = () => {
      if (sessionStartedAtRef.current === null) {
        return savedWatchedSecs;
      }

      const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - sessionStartedAtRef.current) / 1000)
      );

      return savedWatchedSecs + elapsedSeconds;
    };

    const persistWatchedSecs = async () => {
      const watchedSecs = getWatchedSecs();

      if (watchedSecs <= lastSavedWatchedSecsRef.current) {
        return;
      }

      try {
        const res = await fetch("/api/user/lesson-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, watchedSecs }),
        });

        if (res.ok) {
          lastSavedWatchedSecsRef.current = watchedSecs;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const flushWatchedSecs = () => {
      const watchedSecs = getWatchedSecs();

      if (watchedSecs <= lastSavedWatchedSecsRef.current) {
        return;
      }

      const body = JSON.stringify({ lessonId: lesson.id, watchedSecs });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const saved = navigator.sendBeacon(
          "/api/user/lesson-progress",
          new Blob([body], { type: "application/json" })
        );

        if (saved) {
          lastSavedWatchedSecsRef.current = watchedSecs;
          return;
        }
      }

      void fetch("/api/user/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).then((res) => {
        if (res.ok) {
          lastSavedWatchedSecsRef.current = watchedSecs;
        }
      }).catch((error) => {
        console.error(error);
      });
    };

    if (savedWatchedSecs > 0 && embedType === "other") {
      toast.info(`استئني من ${formatWatchedTime(savedWatchedSecs)}`);
    }

    const intervalId = window.setInterval(() => {
      void persistWatchedSecs();
    }, SAVE_INTERVAL_MS);

    const handleBeforeUnload = () => {
      flushWatchedSecs();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushWatchedSecs();
      sessionStartedAtRef.current = null;
    };
  }, [embedType, lesson.id, lesson.videoUrl, savedWatchedSecs]);

  const handleMarkComplete = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user/lesson-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, completed: !isCompleted }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok) {
          setIsCompleted(!isCompleted);
          router.refresh();
          return;
        }
        toast.error(data?.error || "تعذر تحديث التقدم");
      } catch (e) {
        console.error(e);
        toast.error("تعذر تحديث التقدم");
      }
    });
  };

  const LessonNavItem = ({ l, mobile = false }: { l: SidebarLesson; mobile?: boolean }) => {
    const content = (
      <>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${mobile ? "" : "mt-0.5"}`}
          style={{
            borderColor: l.isCompleted
              ? "#A8D5D8"
              : l.id === lesson.id
              ? "#D4AF37"
              : l.unlocked
              ? "rgba(255,255,255,0.35)"
              : "rgba(255,255,255,0.15)",
            background: l.isCompleted ? "#A8D5D8" : "transparent",
          }}
        >
          {l.isCompleted ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : l.id === lesson.id ? (
            <div className="w-2 h-2 rounded-full" style={{ background: "#D4AF37" }} />
          ) : !l.unlocked ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.45)" }}>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 118 0v3" />
            </svg>
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${mobile ? "truncate" : "leading-snug"}`}
            style={{
              fontFamily: "var(--font-tajawal)",
              color: l.id === lesson.id ? "#D4AF37" : l.unlocked ? "white" : "rgba(255,255,255,0.45)",
              fontWeight: l.id === lesson.id ? 600 : 400,
            }}
          >
            {l.title}
          </p>
          {!mobile ? (
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-tajawal)" }}>
              {l.duration} دقيقة {l.unlocked ? "" : "• مقفل"}
            </p>
          ) : null}
        </div>
        {mobile ? (
          <span className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-tajawal)" }}>
            {l.unlocked ? `${l.duration}د` : "مقفل"}
          </span>
        ) : null}
      </>
    );

    if (!l.unlocked) {
      return (
        <div
          className={mobile ? "flex items-center gap-3 px-4 py-3 opacity-80" : "flex items-start gap-3 px-4 py-3 opacity-80"}
          style={{ background: "transparent", borderRight: "3px solid transparent" }}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        href={`/dashboard/courses/${courseId}/lesson/${l.id}`}
        className={mobile ? "flex items-center gap-3 px-4 py-3 transition-all" : "flex items-start gap-3 px-4 py-3 transition-all"}
        style={{
          background: l.id === lesson.id ? "rgba(212,175,55,0.15)" : "transparent",
          borderRight: l.id === lesson.id ? "3px solid #D4AF37" : "3px solid transparent",
        }}
        onClick={() => setSidebarOpen(false)}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full -m-6 md:-m-8" dir="rtl">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ background: "#1B1F2E", borderColor: "#2A2F40" }}>
        <Link href={`/dashboard/courses/${courseId}`} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          العودة للدورة
        </Link>

        <h1 className="text-sm font-medium text-white hidden sm:block" style={{ fontFamily: "var(--font-tajawal)" }}>{courseTitle}</h1>

        <div className="text-xs flex items-center gap-1" style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}>
          <span className="font-bold text-white">{completedCount}</span><span>/</span><span>{totalCount}</span><span>مكتمل</span>
        </div>
      </div>

      <button className="md:hidden flex min-h-11 w-full items-center justify-between border-b px-4 py-3" style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "إغلاق قائمة الدروس" : "فتح قائمة الدروس"}>
        <span className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-tajawal)" }}>قائمة الدروس</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {sidebarOpen && (
        <div className="md:hidden border-b overflow-y-auto max-h-56" style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }}>
          {allLessons.map((l) => <LessonNavItem key={l.id} l={l} mobile />)}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="w-full" style={{ background: "#000" }}>
            {lesson.videoUrl ? (
              <div className="aspect-video w-full">
                {/* TODO: Add playback speed controls for iframe embeds if we adopt a provider API later. */}
                <iframe src={videoSrc || lesson.videoUrl} title={lesson.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#0D1117" }}>
                <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
                  {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => [0, 50, 100, 150, 200].map((y) => (<polygon key={`${x}-${y}`} points={`${x + 25},${y} ${x + 40},${y + 15} ${x + 25},${y + 30} ${x + 10},${y + 15}`} fill="white" />)))}
                </svg>
                <div className="text-5xl mb-4 relative z-10">🎬</div>
                <p className="text-lg font-bold relative z-10" style={{ fontFamily: "var(--font-amiri)", color: "rgba(255,255,255,0.7)" }}>قريبًا</p>
                <p className="text-sm relative z-10" style={{ fontFamily: "var(--font-tajawal)", color: "rgba(255,255,255,0.4)" }}>الفيديو قيد الإعداد</p>
              </div>
            )}
          </div>

          {!lesson.videoUrl ? (
            <div className="border-b bg-white px-4 py-3" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="playback-speed" className="text-sm font-medium" style={{ fontFamily: "var(--font-tajawal)", color: "#1B1F2E" }}>
                  سرعة التشغيل
                </label>
                <select
                  id="playback-speed"
                  value={playbackSpeed}
                  onChange={(event) => setPlaybackSpeed(event.target.value)}
                  className="min-h-11 rounded-xl border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "#D1D5DB", fontFamily: "var(--font-tajawal)", color: "#1B1F2E" }}
                >
                  {PLAYBACK_SPEED_OPTIONS.map((speed) => (
                    <option key={speed} value={String(speed)}>
                      {speed}x
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          <div className="p-4 md:p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleMarkComplete} disabled={isPending} className="flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50" style={{ background: isCompleted ? "#D4AF37" : "#1B6B7A", color: "white", fontFamily: "var(--font-tajawal)" }}>
                {isCompleted ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>تم الإتمام ✓</>) : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" /></svg>وضع علامة كمكتمل</>)}
              </button>

              <h2 className="text-base font-bold hidden sm:block" style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E", maxWidth: "50%" }}>{lesson.title}</h2>
            </div>

            <div className="mb-4 rounded-xl bg-[#F6FBFC] p-3 text-xs text-[#4E6971]" style={{ fontFamily: "var(--font-tajawal)" }}>
              يجب إكمال كل درس بالترتيب لفتح الدرس التالي.
            </div>

            <div className="border-b mb-5" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex gap-1">
                {(["description", "documents"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="relative min-h-11 px-4 py-2.5 text-sm font-medium transition-all" style={{ fontFamily: "var(--font-tajawal)", color: activeTab === tab ? "#1B6B7A" : "#6B7280" }}>
                    {tab === "description" ? "الشرح" : "المستندات"}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#1B6B7A" }} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="transition-all">
              {activeTab === "description" ? (
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}>{lesson.title}</h3>
                  {lesson.description ? (
                    <p className="leading-relaxed" style={{ fontFamily: "var(--font-tajawal)", color: "#4B5563", fontSize: "15px", lineHeight: "1.8" }}>{lesson.description}</p>
                  ) : (
                    <p className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}>لا يوجد شرح إضافي لهذا الدرس</p>
                  )}
                </div>
              ) : (
                <div>
                  {lesson.documents.length === 0 ? (
                    <div className="text-center py-10 rounded-xl" style={{ background: "#F9FAFB" }}>
                      <div className="text-4xl mb-3">📄</div>
                      <p className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>لا توجد مستندات لهذا الدرس</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {lesson.documents.map((doc) => (
                        <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm group" style={{ borderColor: "#E5E7EB" }}>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: doc.fileType === "pdf" ? "#EF4444" : "#3B82F6" }}>{doc.fileType.toUpperCase()}</div>
                          <span className="flex-1 text-sm font-medium group-hover:text-[#1B6B7A] transition-colors" style={{ fontFamily: "var(--font-tajawal)", color: "#374151" }}>{doc.title}</span>
                          <span className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: "#F0F9FA", color: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}>تحميل ↓</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderColor: "#E5E7EB", background: "white" }}>
            {prevLessonId ? (
              <Link href={`/dashboard/courses/${courseId}/lesson/${prevLessonId}`} className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50" style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                الدرس السابق
              </Link>
            ) : <div />}

            {nextLessonId && nextLesson?.unlocked ? (
              <Link href={`/dashboard/courses/${courseId}/lesson/${nextLessonId}`} className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50" style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}>
                الدرس التالي
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            ) : nextLessonId ? (
              <div className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-tajawal)" }}>أكملي هذا الدرس لفتح التالي</div>
            ) : <div />}
          </div>
        </div>

        <aside className="hidden md:flex flex-col w-72 flex-shrink-0 border-r overflow-y-auto" style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-amiri)" }}>محتوى الدورة</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {allLessons.map((l) => <LessonNavItem key={l.id} l={l} />)}
          </div>
        </aside>
      </div>
    </div>
  );
}
