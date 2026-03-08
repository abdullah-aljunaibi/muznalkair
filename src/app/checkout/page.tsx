"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MuznLogo from "@/components/MuznLogo";
import Link from "next/link";

const programs = [
  {
    id: "general",
    title: "المقرأة العامة",
    description: "تصحيح التلاوة لجميع المستويات مع تعلّم أحكام التجويد",
    price: "٥",
    priceNum: 5,
    currency: "ر.ع.",
    features: ["حلقات يومية", "تصحيح تلاوة", "شهادة إتمام"],
  },
  {
    id: "mothers",
    title: "مقرأة الأمهات",
    description: "مخصصة للأمهات بأوقات مرنة تناسب جدولهن اليومي",
    price: "٥",
    priceNum: 5,
    currency: "ر.ع.",
    features: ["أوقات مرنة", "دعم خاص للأمهات", "حلقات صغيرة"],
    popular: true,
  },
  {
    id: "atrujah",
    title: "برنامج الأترجة",
    description: "لتحفيظ القرآن الكريم بمسارات متعددة",
    price: "١٠",
    priceNum: 10,
    currency: "ر.ع.",
    features: ["٣ مسارات حفظ", "متابعة فردية", "اختبارات دورية"],
  },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleCheckout = async (programId: string) => {
    setLoading(true);
    setSelectedProgram(programId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: programId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "حدث خطأ أثناء إنشاء جلسة الدفع");
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجددًا");
    } finally {
      setLoading(false);
      setSelectedProgram(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0E8" }}>
        <div className="text-center">
          <MuznLogo size={56} />
          <p className="mt-4 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            جارٍ التحميل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }} dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
            <MuznLogo size={36} ariaLabel="شعار مقرأة مزن الخير" />
            <span className="text-[#1B6B7A] font-bold" style={{ fontFamily: "var(--font-amiri)" }}>
              مقرأة مُزن الخير
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="min-h-11 flex items-center text-sm hover:underline"
            aria-label="الانتقال إلى لوحة التحكم"
            style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
          >
            لوحة التحكم ←
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
          >
            اختاري البرنامج المناسب
          </h1>
          <p className="text-base" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            سجّلي في أحد برامجنا وابدئي رحلتك مع القرآن الكريم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {programs.map((program) => (
            <div
              key={program.id}
              className="relative bg-white rounded-2xl p-6 flex flex-col"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: program.popular ? "2px solid #1B6B7A" : "2px solid transparent",
              }}
            >
              {program.popular && (
                <div
                  className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: "#D4AF37", fontFamily: "var(--font-tajawal)" }}
                >
                  الأكثر طلبًا
                </div>
              )}

              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
              >
                {program.title}
              </h3>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
              >
                {program.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span
                  className="text-3xl font-bold"
                  style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
                >
                  {program.price}
                </span>
                <span
                  className="text-sm"
                  style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
                >
                  {program.currency} / شهريًا
                </span>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B6B7A">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(program.id)}
                disabled={loading}
                className="min-h-11 w-full rounded-xl py-3 font-medium text-white transition-all duration-200 disabled:opacity-70"
                style={{
                  background: program.popular ? "#1B6B7A" : "#3A8D9E",
                  fontFamily: "var(--font-tajawal)",
                }}
              >
                {loading && selectedProgram === program.id ? "جارٍ التحميل..." : "اشتركي الآن"}
              </button>
            </div>
          ))}
        </div>

        {/* WhatsApp alternative */}
        <div className="max-w-md mx-auto mt-8 text-center">
          <p className="text-sm mb-3" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            أو يمكنك التسجيل عبر واتساب
          </p>
          <a
            href="https://wa.me/96891234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:opacity-90"
            aria-label="التواصل عبر واتساب"
            style={{ background: "#25D366", fontFamily: "var(--font-tajawal)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            تواصلي عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
