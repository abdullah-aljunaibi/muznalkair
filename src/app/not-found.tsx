import Link from "next/link";
import MuznLogo from "@/components/MuznLogo";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "#FAF4EE" }}
    >
      <section
        className="w-full max-w-xl rounded-3xl border p-8 text-center shadow-sm md:p-10"
        style={{ borderColor: "rgba(27,107,122,0.2)", background: "white" }}
      >
        <div className="mb-5 flex justify-center">
          <MuznLogo size={62} ariaLabel="شعار مقرأة مزن الخير" />
        </div>
        <h1
          className="text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          الصفحة غير موجودة
        </h1>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-7 md:text-base"
          style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828" }}
        >
          عذرًا، لم نتمكن من العثور على الصفحة المطلوبة.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white"
          style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          aria-label="العودة إلى الصفحة الرئيسية"
        >
          العودة إلى الرئيسية
        </Link>
      </section>
    </main>
  );
}
