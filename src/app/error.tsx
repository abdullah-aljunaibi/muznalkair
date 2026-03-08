"use client";

import MuznLogo from "@/components/MuznLogo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "#FAF4EE" }}
    >
      <section
        className="w-full max-w-xl rounded-3xl border bg-white p-8 text-center shadow-sm md:p-10"
        style={{ borderColor: "rgba(212,175,55,0.3)" }}
      >
        <div className="mb-5 flex justify-center">
          <MuznLogo size={62} ariaLabel="شعار مقرأة مزن الخير" />
        </div>
        <h1
          className="text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          حدث خطأ
        </h1>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-7 md:text-base"
          style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828" }}
        >
          وقع خطأ غير متوقع أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white"
          style={{ background: "#0A2830", fontFamily: "var(--font-tajawal)" }}
          aria-label="إعادة المحاولة"
        >
          إعادة المحاولة
        </button>
        {error?.digest ? (
          <p className="mt-4 text-xs text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
            رمز التتبع: {error.digest}
          </p>
        ) : null}
      </section>
    </main>
  );
}
