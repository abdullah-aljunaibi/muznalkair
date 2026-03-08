"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"description" | "documents">(
    "description"
  );
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMarkComplete = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user/lesson-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            completed: !isCompleted,
          }),
        });
        if (res.ok) {
          setIsCompleted(!isCompleted);
          router.refresh();
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="flex flex-col h-full -m-6 md:-m-8" dir="rtl">
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ background: "#1B1F2E", borderColor: "#2A2F40" }}
      >
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          العودة للدورة
        </Link>

        <h1
          className="text-sm font-medium text-white hidden sm:block"
          style={{ fontFamily: "var(--font-tajawal)" }}
        >
          {courseTitle}
        </h1>

        <div
          className="text-xs flex items-center gap-1"
          style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
        >
          <span className="font-bold text-white">{completedCount}</span>
          <span>/</span>
          <span>{totalCount}</span>
          <span>مكتمل</span>
        </div>
      </div>

      {/* Mobile Lessons Toggle */}
      <button
        className="md:hidden flex min-h-11 w-full items-center justify-between border-b px-4 py-3"
        style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "إغلاق قائمة الدروس" : "فتح قائمة الدروس"}
      >
        <span
          className="text-white text-sm font-medium"
          style={{ fontFamily: "var(--font-tajawal)" }}
        >
          قائمة الدروس
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Mobile Sidebar Dropdown */}
      {sidebarOpen && (
        <div
          className="md:hidden border-b overflow-y-auto max-h-56"
          style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }}
        >
          {allLessons.map((l) => (
            <Link
              key={l.id}
              href={`/dashboard/courses/${courseId}/lesson/${l.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                background:
                  l.id === lesson.id ? "rgba(212,175,55,0.2)" : "transparent",
                borderRight: l.id === lesson.id ? "3px solid #D4AF37" : "3px solid transparent",
              }}
              onClick={() => setSidebarOpen(false)}
            >
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: l.isCompleted ? "#A8D5D8" : "rgba(255,255,255,0.4)",
                  background: l.isCompleted ? "#A8D5D8" : "transparent",
                }}
              >
                {l.isCompleted && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {l.id === lesson.id && !l.isCompleted && (
                  <div className="w-2 h-2 rounded-full" style={{ background: "#D4AF37" }} />
                )}
              </div>
              <span
                className="text-sm flex-1 truncate"
                style={{
                  fontFamily: "var(--font-tajawal)",
                  color: l.id === lesson.id ? "#D4AF37" : "white",
                  fontWeight: l.id === lesson.id ? 600 : 400,
                }}
              >
                {l.title}
              </span>
              <span
                className="text-xs flex-shrink-0"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-tajawal)" }}
              >
                {l.duration}د
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content + Video */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Video Player */}
          <div className="w-full" style={{ background: "#000" }}>
            {lesson.videoUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                className="aspect-video w-full flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: "#0D1117" }}
              >
                {/* Islamic pattern placeholder */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-5"
                  viewBox="0 0 400 225"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {[0, 50, 100, 150, 200, 250, 300, 350].map((x) =>
                    [0, 50, 100, 150, 200].map((y) => (
                      <polygon
                        key={`${x}-${y}`}
                        points={`${x + 25},${y} ${x + 40},${y + 15} ${x + 25},${y + 30} ${x + 10},${y + 15}`}
                        fill="white"
                      />
                    ))
                  )}
                </svg>
                <div className="text-5xl mb-4 relative z-10">🎬</div>
                <p
                  className="text-lg font-bold relative z-10"
                  style={{ fontFamily: "var(--font-amiri)", color: "rgba(255,255,255,0.7)" }}
                >
                  قريبًا
                </p>
                <p
                  className="text-sm relative z-10"
                  style={{ fontFamily: "var(--font-tajawal)", color: "rgba(255,255,255,0.4)" }}
                >
                  الفيديو قيد الإعداد
                </p>
              </div>
            )}
          </div>

          {/* Mark Complete + Tabs */}
          <div className="p-4 md:p-6 flex-1">
            {/* Mark Complete Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleMarkComplete}
                disabled={isPending}
                className="flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: isCompleted ? "#D4AF37" : "#1B6B7A",
                  color: "white",
                  fontFamily: "var(--font-tajawal)",
                }}
              >
                {isCompleted ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    تم الإتمام ✓
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 8 12 12 14 14" />
                    </svg>
                    وضع علامة كمكتمل
                  </>
                )}
              </button>

              {/* Lesson title */}
              <h2
                className="text-base font-bold hidden sm:block"
                style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E", maxWidth: "50%" }}
              >
                {lesson.title}
              </h2>
            </div>

            {/* Tabs */}
            <div className="border-b mb-5" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex gap-1">
                {(["description", "documents"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative min-h-11 px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      fontFamily: "var(--font-tajawal)",
                      color: activeTab === tab ? "#1B6B7A" : "#6B7280",
                    }}
                  >
                    {tab === "description" ? "الشرح" : "المستندات"}
                    {activeTab === tab && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: "#1B6B7A" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all">
              {activeTab === "description" ? (
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}
                  >
                    {lesson.title}
                  </h3>
                  {lesson.description ? (
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: "var(--font-tajawal)",
                        color: "#4B5563",
                        fontSize: "15px",
                        lineHeight: "1.8",
                      }}
                    >
                      {lesson.description}
                    </p>
                  ) : (
                    <p
                      className="text-sm"
                      style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
                    >
                      لا يوجد شرح إضافي لهذا الدرس
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {lesson.documents.length === 0 ? (
                    <div
                      className="text-center py-10 rounded-xl"
                      style={{ background: "#F9FAFB" }}
                    >
                      <div className="text-4xl mb-3">📄</div>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
                      >
                        لا توجد مستندات لهذا الدرس
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {lesson.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm group"
                          style={{ borderColor: "#E5E7EB" }}
                        >
                          {/* PDF Icon */}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                            style={{
                              background: doc.fileType === "pdf" ? "#EF4444" : "#3B82F6",
                            }}
                          >
                            {doc.fileType.toUpperCase()}
                          </div>
                          <span
                            className="flex-1 text-sm font-medium group-hover:text-[#1B6B7A] transition-colors"
                            style={{ fontFamily: "var(--font-tajawal)", color: "#374151" }}
                          >
                            {doc.title}
                          </span>
                          <span
                            className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                            style={{
                              background: "#F0F9FA",
                              color: "#1B6B7A",
                              fontFamily: "var(--font-tajawal)",
                            }}
                          >
                            تحميل ↓
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Prev / Next Navigation */}
          <div
            className="border-t px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ borderColor: "#E5E7EB", background: "white" }}
          >
            {prevLessonId ? (
              <Link
                href={`/dashboard/courses/${courseId}/lesson/${prevLessonId}`}
                className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50"
                style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                الدرس التالي
              </Link>
            ) : (
              <div />
            )}

            {nextLessonId ? (
              <Link
                href={`/dashboard/courses/${courseId}/lesson/${nextLessonId}`}
                className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50"
                style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
              >
                الدرس السابق
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Desktop Lesson Sidebar */}
        <aside
          className="hidden md:flex flex-col w-72 flex-shrink-0 border-r overflow-y-auto"
          style={{ background: "#1B6B7A", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <h3
              className="text-white font-bold text-sm"
              style={{ fontFamily: "var(--font-amiri)" }}
            >
              محتوى الدورة
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {allLessons.map((l) => (
              <Link
                key={l.id}
                href={`/dashboard/courses/${courseId}/lesson/${l.id}`}
                className="flex items-start gap-3 px-4 py-3 transition-all"
                style={{
                  background:
                    l.id === lesson.id
                      ? "rgba(212,175,55,0.15)"
                      : "transparent",
                  borderRight:
                    l.id === lesson.id
                      ? "3px solid #D4AF37"
                      : "3px solid transparent",
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    borderColor: l.isCompleted
                      ? "#A8D5D8"
                      : l.id === lesson.id
                      ? "#D4AF37"
                      : "rgba(255,255,255,0.35)",
                    background: l.isCompleted ? "#A8D5D8" : "transparent",
                  }}
                >
                  {l.isCompleted ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="#1B6B7A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : l.id === lesson.id ? (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#D4AF37" }}
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug"
                    style={{
                      fontFamily: "var(--font-tajawal)",
                      color:
                        l.id === lesson.id
                          ? "#D4AF37"
                          : l.isCompleted
                          ? "rgba(255,255,255,0.5)"
                          : "white",
                      fontWeight: l.id === lesson.id ? 600 : 400,
                    }}
                  >
                    {l.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-tajawal)",
                    }}
                  >
                    {l.duration} دقيقة
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
