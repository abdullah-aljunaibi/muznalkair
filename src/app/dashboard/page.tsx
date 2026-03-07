import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;
  const userName = session?.user?.name || "الطالبة";
  const userInitial = userName.charAt(0);

  // Get user's purchases with courses
  const purchases = await prisma.purchase
    .findMany({
      where: { userId, status: "COMPLETED" },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  // Get progress for all courses
  const progressList = await prisma.progress
    .findMany({ where: { userId } })
    .catch(() => []);

  const progressMap = Object.fromEntries(
    progressList.map((p) => [p.courseId, p])
  );

  const totalCourses = purchases.length;
  const completedCourses = purchases.filter((p) => {
    const prog = progressMap[p.courseId];
    const total = p.course.totalLessons || 1;
    return prog && prog.completedLessons >= total;
  }).length;

  const totalMinutesWatched = progressList.reduce(
    (acc, p) => acc + (p.totalMinutesWatched || 0),
    0
  );

  const inProgressPurchases = purchases.filter((p) => {
    const prog = progressMap[p.courseId];
    const total = p.course.totalLessons || 1;
    const completed = prog?.completedLessons || 0;
    return completed < total;
  });

  const completedPurchases = purchases.filter((p) => {
    const prog = progressMap[p.courseId];
    const total = p.course.totalLessons || 1;
    return prog && prog.completedLessons >= total;
  });

  const CourseCard = ({
    purchase,
  }: {
    purchase: (typeof purchases)[0];
  }) => {
    const progress = progressMap[purchase.courseId];
    const total = purchase.course.totalLessons || 1;
    const completed = progress?.completedLessons || 0;
    const percentage = Math.round((completed / total) * 100);
    const lastAccessed = progress?.lastAccessedAt
      ? new Date(progress.lastAccessedAt).toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

    return (
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        {/* Thumbnail */}
        <div
          className="w-full h-36 relative flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1B6B7A 0%, #2A8FA0 50%, #1B6B7A 100%)",
          }}
        >
          {/* Islamic geometric pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {[0, 40, 80, 120, 160].map((x) =>
              [0, 40, 80].map((y) => (
                <polygon
                  key={`${x}-${y}`}
                  points={`${x + 20},${y} ${x + 30},${y + 10} ${x + 20},${y + 20} ${x + 10},${y + 10}`}
                  fill="white"
                />
              ))
            )}
          </svg>
          <span className="text-4xl relative z-10">📖</span>
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3
            className="font-bold text-base mb-1 leading-snug"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            {purchase.course.title}
          </h3>

          {/* Last accessed */}
          {lastAccessed && (
            <p
              className="text-xs mb-3"
              style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
            >
              آخر وصول: {lastAccessed}
            </p>
          )}

          {/* Progress bar */}
          <div className="mb-4 mt-auto">
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
              >
                {completed} / {total} درس
              </span>
              <span
                className="text-xs font-bold"
                style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
              >
                {percentage}٪
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: "#E5E7EB" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background:
                    percentage === 100
                      ? "linear-gradient(90deg, #D4AF37, #F0CB5A)"
                      : "linear-gradient(90deg, #1B6B7A, #3A8D9E)",
                }}
              />
            </div>
          </div>

          {/* Button */}
          <Link
            href={`/dashboard/courses/${purchase.courseId}`}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:opacity-90 block"
            style={{
              background: percentage === 100 ? "#D4AF37" : "#1B6B7A",
              color: "white",
              fontFamily: "var(--font-tajawal)",
            }}
          >
            {percentage === 100 ? "مراجعة الدورة" : "متابعة ←"}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto" dir="rtl">
      {/* Profile Header */}
      <div
        className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-between"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: "#1B6B7A", color: "white", fontFamily: "var(--font-amiri)" }}
          >
            {userInitial}
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}
            >
              أهلاً، {userName} 👋
            </h1>
            <Link
              href="/dashboard/profile"
              className="text-xs hover:underline"
              style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
            >
              تعديل الملف الشخصي
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "دورات قيد التعلم",
            value: inProgressPurchases.length.toString(),
            icon: "📚",
            color: "#1B6B7A",
          },
          {
            label: "مكتملة",
            value: completedCourses.toString(),
            icon: "🏆",
            color: "#D4AF37",
          },
          {
            label: "دقيقة تعلّم",
            value: totalMinutesWatched.toString(),
            icon: "⏱",
            color: "#3A8D9E",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 text-center"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-amiri)", color: stat.color }}
            >
              {stat.value}
            </div>
            <div
              className="text-xs"
              style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* In Progress Courses */}
      {inProgressPurchases.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
            >
              دوراتي قيد التقدم
            </h2>
            <Link
              href="/dashboard/courses"
              className="text-sm hover:underline"
              style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
            >
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgressPurchases.map((purchase) => (
              <CourseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses */}
      {completedPurchases.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
          >
            الدورات المكتملة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedPurchases.map((purchase) => (
              <CourseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {purchases.length === 0 && (
        <div
          className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
        >
          <div className="text-5xl mb-4">📖</div>
          <p
            className="text-lg font-medium mb-2"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            لم تشتري أي دورة بعد
          </p>
          <p
            className="text-sm mb-6"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            استعرضي برامجنا وانضمي إلى دورة مناسبة لك
          </p>
          <Link
            href="/#programs"
            className="inline-flex px-6 py-3 rounded-xl text-white font-medium text-sm"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            استعرضي البرامج
          </Link>
        </div>
      )}
    </div>
  );
}
