import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function CertificatesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl" dir="rtl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
          شهاداتي
        </h1>
        <p className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
          جميع شهادات الإتمام الصادرة لحسابك، ويمكن التحقق منها عبر رابط عام.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <p className="mb-2 text-lg font-medium" style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}>
            لا توجد شهادات بعد
          </p>
          <p className="mb-6 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            ستظهر شهاداتك هنا بعد إتمام جميع دروس الدورة.
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex min-h-11 items-center rounded-xl px-6 py-2 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            العودة إلى دوراتي
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="rounded-2xl border bg-white p-5"
              style={{ borderColor: "#EEE3D8", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1B1F2E]" style={{ fontFamily: "var(--font-amiri)" }}>
                    {certificate.course.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#6B7280]" style={{ fontFamily: "var(--font-tajawal)" }}>
                    تاريخ الإصدار: {formatArabicDate(certificate.issuedAt)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
                    رمز التحقق: <span className="font-bold text-[#1B6B7A]">{certificate.code}</span>
                  </p>
                </div>

                <Link
                  href={`/certificate/${certificate.code}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
                >
                  عرض الشهادة
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
