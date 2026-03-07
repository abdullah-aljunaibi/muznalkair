import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id!;

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

  const progressMap = Object.fromEntries(
    progressList.map((p) => [p.courseId, p])
  );

  return (
    <div className="max-w-5xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
        >
          دوراتي
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
        >
          جميع الدورات التي سجّلتِ فيها
        </p>
      </div>

      {purchases.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
        >
          <div className="text-5xl mb-4">📚</div>
          <p
            className="text-lg font-medium mb-2"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            لا توجد دورات مشتراة
          </p>
          <p
            className="text-sm mb-6"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            ابدئي رحلتك مع القرآن الكريم الآن
          </p>
          <Link
            href="/#programs"
            className="inline-flex px-6 py-2 rounded-xl text-white font-medium text-sm"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            استعرضي البرامج
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-2xl overflow-hidden flex flex-col"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                {/* Thumbnail */}
                <div
                  className="w-full h-40 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B6B7A 0%, #3A8D9E 100%)",
                  }}
                >
                  <svg
                    className="absolute inset-0 w-full h-full opacity-10"
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
                  <span className="text-5xl relative z-10">📖</span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <h3
                    className="font-bold text-lg mb-1 leading-snug"
                    style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
                  >
                    {purchase.course.title}
                  </h3>

                  {/* Last accessed */}
                  <p
                    className="text-xs mb-4"
                    style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
                  >
                    آخر وصول: {lastAccessed}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4 mt-auto">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
                      >
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
                    className="w-full py-2.5 rounded-xl text-sm font-medium text-center block transition-all hover:opacity-90"
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
