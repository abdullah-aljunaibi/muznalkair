import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "الرئيسية",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const userName = session.user?.name || "الطالبة";
  const userInitial = userName.charAt(0);

  const purchases = await prisma.purchase
    .findMany({
      where: { userId, status: "COMPLETED" },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const progressList = await prisma.progress
    .findMany({ where: { userId } })
    .catch(() => []);

  const progressMap = Object.fromEntries(progressList.map((p) => [p.courseId, p]));

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

  const courseCards = (items: typeof purchases) => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((purchase) => {
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
            key={purchase.id}
            className="overflow-hidden rounded-2xl bg-white"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div
              className="relative flex h-36 w-full items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1B6B7A 0%, #2A8FA0 50%, #1B6B7A 100%)",
              }}
            >
              <svg
                className="absolute inset-0 h-full w-full opacity-10"
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
              <span className="relative z-10 text-4xl">📖</span>
            </div>

            <div className="flex h-full flex-col p-4">
              <h3
                className="mb-1 text-base font-bold leading-snug"
                style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
              >
                {purchase.course.title}
              </h3>

              {lastAccessed ? (
                <p
                  className="mb-3 text-xs"
                  style={{ fontFamily: "var(--font-tajawal)", color: "#9CA3AF" }}
                >
                  آخر وصول: {lastAccessed}
                </p>
              ) : null}

              <div className="mb-4 mt-auto">
                <div className="mb-1 flex items-center justify-between">
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
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "#E5E7EB" }}>
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

              <Link
                href={`/dashboard/courses/${purchase.courseId}`}
                className="block min-h-11 w-full rounded-xl py-2.5 text-center text-sm font-medium transition-all hover:opacity-90"
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
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl" dir="rtl">
      <div
        className="mb-6 flex items-center justify-between rounded-2xl bg-white p-6"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold"
            style={{ background: "#1B6B7A", color: "white", fontFamily: "var(--font-amiri)" }}
          >
            {userInitial}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}>
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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "دورات قيد التعلم", value: inProgressPurchases.length.toString(), icon: "📚", color: "#1B6B7A" },
          { label: "مكتملة", value: completedCourses.toString(), icon: "🏆", color: "#D4AF37" },
          { label: "دقيقة تعلّم", value: totalMinutesWatched.toString(), icon: "⏱", color: "#3A8D9E" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 text-center"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <div className="mb-2 text-3xl">{stat.icon}</div>
            <div className="mb-1 text-2xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {inProgressPurchases.length > 0 ? (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
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
          {courseCards(inProgressPurchases)}
        </section>
      ) : null}

      {completedPurchases.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
            الدورات المكتملة
          </h2>
          {courseCards(completedPurchases)}
        </section>
      ) : null}

      {purchases.length === 0 ? (
        <div
          className="rounded-2xl bg-white p-10 text-center"
          style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
        >
          <div className="mb-4 text-5xl">📖</div>
          <p className="mb-2 text-lg font-medium" style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}>
            لم تشتري أي دورة بعد
          </p>
          <p className="mb-6 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            استعرضي برامجنا وانضمي إلى دورة مناسبة لك
          </p>
          <Link
            href="/#programs"
            className="inline-flex rounded-xl px-6 py-3 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            استعرضي البرامج
          </Link>
        </div>
      ) : null}
    </div>
  );
}
