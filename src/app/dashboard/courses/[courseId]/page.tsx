import { auth } from "@/lib/auth";
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

  // Check purchase
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

  const progress = await prisma.progress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter(
    (l) => l.progress[0]?.completed
  ).length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find first incomplete lesson for "Continue" button
  const nextLesson =
    course.lessons.find((l) => !l.progress[0]?.completed) ||
    course.lessons[0];

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — Right in RTL = visually on left */}
        <aside
          className="lg:w-72 flex-shrink-0 rounded-2xl overflow-hidden lg:sticky lg:top-6 self-start"
          style={{ background: "#1B6B7A" }}
        >
          {/* Course Title */}
          <div className="p-5 border-b border-white/20">
            <h2
              className="text-white font-bold text-base leading-tight"
              style={{ fontFamily: "var(--font-amiri)" }}
            >
              {course.title}
            </h2>
            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span
                  className="text-white/70 text-xs"
                  style={{ fontFamily: "var(--font-tajawal)" }}
                >
                  {completedLessons} / {totalLessons} درس
                </span>
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: "var(--font-tajawal)" }}
                >
                  {progressPercentage}٪
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                    background: "#D4AF37",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="py-2">
            {course.lessons.map((lesson) => {
              const isCompleted = lesson.progress[0]?.completed;
              return (
                <Link
                  key={lesson.id}
                  href={`/dashboard/courses/${courseId}/lesson/${lesson.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/10"
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: isCompleted ? "#A8D5D8" : "rgba(255,255,255,0.4)",
                      background: isCompleted ? "#A8D5D8" : "transparent",
                    }}
                  >
                    {isCompleted && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="#1B6B7A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm truncate"
                      style={{
                        fontFamily: "var(--font-tajawal)",
                        color: isCompleted ? "rgba(255,255,255,0.6)" : "white",
                        fontWeight: isCompleted ? 400 : 500,
                      }}
                    >
                      {lesson.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-tajawal)" }}
                    >
                      {lesson.duration} دقيقة
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div
              className="w-full h-48 relative flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1B6B7A 0%, #2A8FA0 60%, #1B4F5A 100%)",
              }}
            >
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 400 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                {[0, 50, 100, 150, 200, 250, 300, 350].map((x) =>
                  [0, 50, 100, 150].map((y) => (
                    <polygon
                      key={`${x}-${y}`}
                      points={`${x + 25},${y} ${x + 40},${y + 15} ${x + 25},${y + 30} ${x + 10},${y + 15}`}
                      fill="white"
                    />
                  ))
                )}
              </svg>
              <span className="text-6xl relative z-10">🕌</span>
            </div>
            <div className="bg-white p-6">
              <h1
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}
              >
                {course.title}
              </h1>
              {nextLesson && (
                <Link
                  href={`/dashboard/courses/${courseId}/lesson/${nextLesson.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90"
                  style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
                >
                  {completedLessons > 0 ? "متابعة التعلم ←" : "ابدئي الآن ←"}
                </Link>
              )}
            </div>
          </div>

          {/* About Section */}
          <div
            className="bg-white rounded-2xl p-6 mb-6"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
            >
              عن هذه الدورة
            </h2>
            <p
              className="leading-relaxed"
              style={{ fontFamily: "var(--font-tajawal)", color: "#4B5563", fontSize: "15px" }}
            >
              {course.description}
            </p>
          </div>

          {/* What You'll Learn */}
          <div
            className="bg-white rounded-2xl p-6 mb-6"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
            >
              ما ستتعلمينه
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "فهم أساسيات علم التجويد",
                "تطبيق قواعد القراءة الصحيحة",
                "التعرف على مخارج الحروف",
                "تحسين تلاوة القرآن الكريم",
                "حفظ الأحكام التجويدية",
                "التطبيق العملي على آيات كريمة",
              ]
                .slice(0, course.lessons.length > 4 ? 6 : 4)
                .map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: "#1B6B7A" }}>
                      ✓
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-tajawal)", color: "#4B5563" }}
                    >
                      {point}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Course Content */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
            >
              محتوى الدورة
            </h2>
            <p
              className="text-sm mb-4"
              style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
            >
              {totalLessons} درس •{" "}
              {course.lessons.reduce((acc, l) => acc + l.duration, 0)} دقيقة إجمالية
            </p>
            <div className="divide-y divide-gray-100">
              {course.lessons.map((lesson) => {
                const isCompleted = lesson.progress[0]?.completed;
                return (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/courses/${courseId}/lesson/${lesson.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: isCompleted ? "#A8D5D8" : "#F3F4F6",
                          color: isCompleted ? "#1B6B7A" : "#9CA3AF",
                        }}
                      >
                        {isCompleted ? "✓" : lesson.order}
                      </div>
                      <span
                        className="text-sm group-hover:text-[#1B6B7A] transition-colors"
                        style={{
                          fontFamily: "var(--font-tajawal)",
                          color: "#374151",
                        }}
                      >
                        {lesson.title}
                      </span>
                      {lesson.isPreview && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "#F0F9FA",
                            color: "#1B6B7A",
                            fontFamily: "var(--font-tajawal)",
                          }}
                        >
                          مجاني
                        </span>
                      )}
                    </div>
                    <span
                      className="text-xs flex-shrink-0 mr-4"
                      style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
                    >
                      {lesson.duration} د
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
