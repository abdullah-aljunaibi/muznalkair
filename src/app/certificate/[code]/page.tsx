import type { Metadata } from "next";
import Link from "next/link";
import MuznLogo from "@/components/MuznLogo";
import { prisma } from "@/lib/prisma";

function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

async function getCertificate(code: string) {
  return prisma.certificate.findUnique({
    where: { code },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const certificate = await getCertificate(code);

  if (!certificate) {
    return {
      title: "الشهادة غير موجودة | مقرأة مُزن الخير",
    };
  }

  return {
    title: `شهادة إتمام — ${certificate.course.title} | مقرأة مُزن الخير`,
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await getCertificate(code);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-4 py-16" dir="rtl">
        <div className="mx-auto max-w-2xl rounded-[32px] bg-white p-10 text-center shadow-[0_18px_50px_rgba(27,107,122,0.12)]">
          <div className="mb-6 flex justify-center">
            <MuznLogo size={68} ariaLabel="شعار مقرأة مُزن الخير" />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
            الشهادة غير موجودة
          </h1>
          <p className="mt-3 text-sm leading-7" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            تعذر العثور على شهادة مطابقة لهذا الرمز. تحققي من الرابط أو عودي إلى الصفحة الرئيسية.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center rounded-xl px-6 py-2 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 sm:px-6 print:bg-white print:px-0 print:py-0"
      dir="rtl"
      style={{ background: "linear-gradient(180deg, #F5F0E8 0%, #FBF8F3 100%)" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-center print:hidden">
          <a
            href="javascript:window.print()"
            className="inline-flex min-h-11 items-center rounded-xl px-6 py-2 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            طباعة الشهادة
          </a>
        </div>

        <section
          className="relative overflow-hidden rounded-[36px] border bg-[#F5F0E8] p-4 shadow-[0_25px_80px_rgba(27,107,122,0.14)] sm:p-8 md:p-12 print:rounded-none print:border-0 print:shadow-none"
          style={{ borderColor: "#D4AF37" }}
        >
          <div className="pointer-events-none absolute inset-5 rounded-[28px] border print:inset-3 print:rounded-none" style={{ borderColor: "rgba(212,175,55,0.65)" }} />
          <div className="pointer-events-none absolute inset-9 rounded-[22px] border print:inset-6 print:rounded-none" style={{ borderColor: "rgba(27,107,122,0.18)" }} />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/80 p-4 shadow-[0_8px_30px_rgba(212,175,55,0.2)]">
                <MuznLogo size={92} ariaLabel="شعار مقرأة مُزن الخير" />
              </div>
            </div>

            <p className="text-sm tracking-[0.35em] text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
              مقرأة مُزن الخير
            </p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
              شهادة إتمام
            </h1>
            <div className="mx-auto mt-4 h-px w-40" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

            <p className="mt-8 text-base leading-8 sm:text-lg" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
              تشهد مقرأة مُزن الخير بأن الطالبة
            </p>
            <p className="mt-4 text-4xl font-bold sm:text-5xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B1F2E" }}>
              {certificate.user.name}
            </p>

            <p className="mt-8 text-base leading-8 sm:text-lg" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
              قد أتمّت بنجاح دورة
            </p>
            <p className="mt-4 text-3xl font-bold leading-tight sm:text-4xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
              {certificate.course.title}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 p-4">
                <div className="text-xs text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
                  تاريخ الإصدار
                </div>
                <div className="mt-2 text-base font-bold text-[#1B1F2E]" style={{ fontFamily: "var(--font-amiri)" }}>
                  {formatArabicDate(certificate.issuedAt)}
                </div>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <div className="text-xs text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
                  رمز التحقق
                </div>
                <div className="mt-2 text-base font-bold text-[#1B1F2E]" style={{ fontFamily: "var(--font-amiri)" }}>
                  {certificate.code}
                </div>
              </div>
              <div className="rounded-2xl bg-[#1B6B7A] p-4 text-white">
                <div className="text-xs text-white/80" style={{ fontFamily: "var(--font-tajawal)" }}>
                  حالة التحقق
                </div>
                <div className="mt-2 text-base font-bold" style={{ fontFamily: "var(--font-amiri)" }}>
                  تم التحقق ✓
                </div>
              </div>
            </div>

            <p className="mt-10 text-sm leading-7" style={{ fontFamily: "var(--font-tajawal)", color: "#7A6555" }}>
              هذه الصفحة تمثل الشهادة الأصلية ويمكن التحقق منها علنًا عبر رابطها الفريد.
            </p>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: #ffffff !important;
          }
          @page {
            size: A4 landscape;
            margin: 12mm;
          }
        }
      ` }} />
    </div>
  );
}
