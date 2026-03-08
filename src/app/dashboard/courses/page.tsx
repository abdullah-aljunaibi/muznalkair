import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "دوراتي",
};

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

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

  return (
    <div className="mx-auto max-w-5xl" dir="rtl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
          دوراتي
        </h1>
        <p className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
          جميع الدورات التي سجّلتِ فيها
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <div className="mb-4 text-5xl">📚</div>
          <p className="mb-2 text-lg font-medium" style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}>
            لا توجد دورات مشتراة
          </p>
          <p className="mb-6 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            ابدئي رحلتك مع القرآن الكريم الآن
          </p>
          <Link
            href="/#programs"
            className="inline-flex min-h-11 items-center rounded-xl px-6 py-2 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            استعرضي البرامج
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => {
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
              : "—";

            return (
              <div
                key={purchase.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="relative flex h-40 w-full items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1B6B7A 0%, #3A8D9E 100%)" }}
                >
                  <svg
                    className="absolute inset-0 h-full w-full opacity-10"
                    viewBox="0 0 300 160"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {[0, 50, 100, 150, 200, 250].map((x) =>
                      [0, 50, 100, 150].map((y) => (
                        <polygon
                          key={`${x}-${y}`}
                          points={`${x + 25},${y} ${x + 38},${y + 13} ${x + 25},${y + 26} ${x + 12},${y + 13}`}
                          fill="white"
                        />
                      ))
                    )}
                  </svg>
                  <span className="relative z-10 text-5xl">📖</span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1 text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}>
                    {purchase.course.title}
                  </h3>

                  <p className="mb-4 text-xs" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
                    آخر وصول: {lastAccessed}
                  </p>

                  <div className="mb-4 mt-auto">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
                        {completed} من {total} درس
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{
                          fontFamily: "var(--font-tajawal)",
                          color: percentage === 100 ? "#D4AF37" : "#1B6B7A",
                        }}
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
                    {percentage === 100 ? "مراجعة الدورة" : "متابعة الدراسة ←"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
