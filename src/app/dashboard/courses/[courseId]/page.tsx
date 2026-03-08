import { auth } from "@/lib/auth";
import { firstUnlockedLessonIndex, isLessonUnlocked } from "@/lib/lessons";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId } = await params;
  const userId = session.user.id;

  const purchase = await prisma.purchase.findFirst({
    where: { userId, courseId, status: "COMPLETED" },
  });

  if (!purchase) redirect("/checkout?courseId=" + courseId);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          progress: { where: { userId } },
        },
      },
    },
  });

  if (!course) redirect("/dashboard/courses");

  const completedFlags = course.lessons.map((lesson) => lesson.progress[0]?.completed ?? false);
  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter((l) => l.progress[0]?.completed).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const nextLessonIndex = firstUnlockedLessonIndex(completedFlags);
  const nextLesson = course.lessons[nextLessonIndex] || course.lessons[0];

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 flex-shrink-0 rounded-2xl overflow-hidden lg:sticky lg:top-6 self-start" style={{ background: "#1B6B7A" }}>
          <div className="p-5 border-b border-white/20">
            <h2 className="text-white font-bold text-base leading-tight" style={{ fontFamily: "var(--font-amiri)" }}>
              {course.title}
            </h2>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/70 text-xs" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {completedLessons} / {totalLessons} درس
                </span>
                <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {progressPercentage}٪
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%`, background: "#D4AF37" }} />
              </div>
            </div>
          </div>

          <div className="py-2">
            {course.lessons.map((lesson, index) => {
              const isCompleted = lesson.progress[0]?.completed;
              const unlocked = isLessonUnlocked(index, completedFlags);
              const item = (
                <>
                  <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isCompleted ? "#A8D5D8" : unlocked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)", background: isCompleted ? "#A8D5D8" : "transparent" }}>
                    {isCompleted ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : !unlocked ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.45)" }}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 118 0v3" /></svg>
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ fontFamily: "var(--font-tajawal)", color: unlocked ? "white" : "rgba(255,255,255,0.45)", fontWeight: isCompleted ? 400 : 500 }}>
                      {lesson.title}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-tajawal)" }}>
                      {lesson.duration} دقيقة {unlocked ? "" : "• مقفل"}
                    </p>
                  </div>
                </>
              );

              return unlocked ? (
                <Link key={lesson.id} href={`/dashboard/courses/${courseId}/lesson/${lesson.id}`} className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/10">
                  {item}
                </Link>
              ) : (
                <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 opacity-80">{item}</div>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="rounded-2xl overflow-hidden mb-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div className="w-full h-48 relative flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1B6B7A 0%, #2A8FA0 60%, #1B4F5A 100%)" }}>
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                {[0, 50, 100, 150, 200, 250, 300, 350].map((x) => [0, 50, 100, 150].map((y) => (<polygon key={`${x}-${y}`} points={`${x + 25},${y} ${x + 40},${y + 15} ${x + 25},${y + 30} ${x + 10},${y + 15}`} fill="white" />)))}
              </svg>
              <span className="text-6xl relative z-10">🕌</span>
            </div>
            <div className="bg-white p-6">
              <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}>
                {course.title}
              </h1>
              {nextLesson ? (
                <Link href={`/dashboard/courses/${courseId}/lesson/${nextLesson.id}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90" style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}>
                  {completedLessons > 0 ? "متابعة التعلم ←" : "ابدئي الآن ←"}
                </Link>
              ) : null}
              <p className="mt-3 text-xs text-[#6B7280]" style={{ fontFamily: "var(--font-tajawal)" }}>
                يتم فتح كل درس بعد إكمال الدرس السابق.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>عن هذه الدورة</h2>
            <p className="leading-relaxed" style={{ fontFamily: "var(--font-tajawal)", color: "#4B5563", fontSize: "15px" }}>
              {course.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>ما ستتعلمينه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "فهم أساسيات علم التجويد",
                "تطبيق قواعد القراءة الصحيحة",
                "التعرف على مخارج الحروف",
                "تحسين تلاوة القرآن الكريم",
                "حفظ الأحكام التجويدية",
                "التطبيق العملي على آيات كريمة",
              ].slice(0, course.lessons.length > 4 ? 6 : 4).map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: "#1B6B7A" }}>✓</span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#4B5563" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>محتوى الدورة</h2>
            <p className="text-sm mb-4" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
              {totalLessons} درس • {course.lessons.reduce((acc, l) => acc + l.duration, 0)} دقيقة إجمالية
            </p>
            <div className="divide-y divide-gray-100">
              {course.lessons.map((lesson, index) => {
                const isCompleted = lesson.progress[0]?.completed;
                const unlocked = isLessonUnlocked(index, completedFlags);
                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: isCompleted ? "#A8D5D8" : unlocked ? "#F3F4F6" : "#F9FAFB", color: isCompleted ? "#1B6B7A" : unlocked ? "#9CA3AF" : "#D1D5DB" }}>
                        {isCompleted ? "✓" : unlocked ? lesson.order : "🔒"}
                      </div>
                      <span className="text-sm transition-colors" style={{ fontFamily: "var(--font-tajawal)", color: unlocked ? "#374151" : "#9CA3AF" }}>
                        {lesson.title}
                      </span>
                      {lesson.isPreview && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F0F9FA", color: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}>
                          مجاني
                        </span>
                      )}
                    </div>
                    <span className="text-xs flex-shrink-0 mr-4" style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}>
                      {unlocked ? `${lesson.duration} د` : "مقفل"}
                    </span>
                  </>
                );

                return unlocked ? (
                  <Link key={lesson.id} href={`/dashboard/courses/${courseId}/lesson/${lesson.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors group">
                    {content}
                  </Link>
                ) : (
                  <div key={lesson.id} className="flex items-center justify-between py-3 rounded-lg px-2 -mx-2 opacity-80">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
