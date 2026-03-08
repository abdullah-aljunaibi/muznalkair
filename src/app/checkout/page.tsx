"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import MuznLogo from "@/components/MuznLogo";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  totalLessons: number;
};

type CouponPreview = {
  coupon: {
    id: string;
    code: string;
    description: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  };
  course: {
    id: string;
    title: string;
    originalPrice: number;
    finalPrice: number;
    discountAmount: number;
    currency: string;
  };
};

const courseMeta: Record<string, { features: string[]; popular?: boolean }> = {
  course_quran_reading_001: {
    features: ["منهج مبسّط", "تطبيق عملي", "مناسب للمبتدئات"],
    popular: true,
  },
  course_tajweed_001: {
    features: ["أحكام التجويد", "تدريب عملي", "شهادة إتمام"],
  },
  course_hifz_001: {
    features: ["خطة حفظ", "متابعة دورية", "تفسير مختصر"],
  },
};

function formatOmr(value: number) {
  return `${value.toFixed(3)} ر.ع`;
}

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponPreview, setCouponPreview] = useState<CouponPreview | null>(null);
  const [couponCourseId, setCouponCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/checkout/options")
        .then(async (res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(setCourses)
        .catch(() => toast.error("تعذر تحميل الدورات المتاحة"))
        .finally(() => setLoadingCourses(false));
    }
  }, [status, router]);

  const couponSummary = useMemo(() => {
    if (!couponPreview) return null;
    return `${couponPreview.coupon.code} — خصم ${formatOmr(couponPreview.course.discountAmount)}`;
  }, [couponPreview]);

  async function applyCoupon(courseId: string) {
    if (!couponCode.trim()) {
      toast.error("أدخلي كود الخصم أولًا");
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponPreview(null);
        setCouponCourseId(null);
        throw new Error(data.error || "تعذر تطبيق الكوبون");
      }

      setCouponPreview(data);
      setCouponCourseId(courseId);
      toast.success("تم تطبيق كود الخصم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تطبيق الكوبون");
    } finally {
      setCouponLoading(false);
    }
  }

  const handleCheckout = async (courseId: string) => {
    setLoading(true);
    setSelectedProgram(courseId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          couponCode: couponCourseId === courseId ? couponCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "حدث خطأ أثناء إنشاء جلسة الدفع");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("حدث خطأ أثناء إنشاء جلسة الدفع");
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجددًا");
    } finally {
      setLoading(false);
      setSelectedProgram(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && loadingCourses)) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#F5F0E8" }}>
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
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
            <MuznLogo size={36} ariaLabel="شعار مقرأة مزن الخير" />
            <span className="font-bold text-[#1B6B7A]" style={{ fontFamily: "var(--font-amiri)" }}>
              مقرأة مُزن الخير
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex min-h-11 items-center text-sm hover:underline"
            aria-label="الانتقال إلى لوحة التحكم"
            style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
          >
            لوحة التحكم ←
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
            اختاري الدورة المناسبة
          </h1>
          <p className="text-base" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            التسجيل الآن متصل بقاعدة البيانات والدفع المباشر، مع دعم أكواد الخصم.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-2xl rounded-2xl bg-white p-5" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="grid gap-3 md:grid-cols-[1fr,auto]">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                if (couponPreview && couponCode !== e.target.value.toUpperCase()) {
                  setCouponPreview(null);
                  setCouponCourseId(null);
                }
              }}
              placeholder="أدخلي كود الخصم"
              className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 uppercase outline-none"
              style={{ fontFamily: "var(--font-tajawal)" }}
            />
            <div className="text-xs text-[#7A6555] md:self-center" style={{ fontFamily: "var(--font-tajawal)" }}>
              طبّقي الكود على الدورة التي تختارينها من البطاقات أدناه.
            </div>
          </div>
          {couponSummary ? (
            <p className="mt-3 text-sm text-[#1B6B7A]" style={{ fontFamily: "var(--font-tajawal)" }}>
              {couponSummary}
            </p>
          ) : null}
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {courses.map((course) => {
            const meta = courseMeta[course.id] || {
              features: [`${course.totalLessons} دروس`, "وصول فوري", "دعم مستمر"],
            };
            const pricing = couponPreview && couponCourseId === course.id ? couponPreview.course : null;

            return (
              <div
                key={course.id}
                className="relative flex flex-col rounded-2xl bg-white p-6"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: meta.popular ? "2px solid #1B6B7A" : "2px solid transparent",
                }}
              >
                {meta.popular ? (
                  <div
                    className="absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: "#D4AF37", fontFamily: "var(--font-tajawal)" }}
                  >
                    الأكثر طلبًا
                  </div>
                ) : null}

                <h3 className="mb-2 text-xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
                  {course.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
                  {course.description}
                </p>

                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
                    {pricing ? formatOmr(pricing.finalPrice) : formatOmr(course.price)}
                  </span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
                    دفعة واحدة
                  </span>
                </div>

                {pricing ? (
                  <div className="mb-4 rounded-xl bg-[#F6FBFC] p-3 text-sm" style={{ fontFamily: "var(--font-tajawal)" }}>
                    <div className="text-[#6B7280] line-through">قبل الخصم: {formatOmr(pricing.originalPrice)}</div>
                    <div className="font-medium text-[#1B6B7A]">الخصم: {formatOmr(pricing.discountAmount)}</div>
                  </div>
                ) : (
                  <div className="mb-4 text-xs text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
                    {course.totalLessons} دروس
                  </div>
                )}

                <ul className="mb-6 flex flex-1 flex-col gap-2">
                  {meta.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B6B7A">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mb-3 grid gap-3">
                  <button
                    onClick={() => applyCoupon(course.id)}
                    disabled={couponLoading || !couponCode.trim()}
                    className="min-h-11 w-full rounded-xl border border-[#1B6B7A] py-3 font-medium text-[#1B6B7A] transition-all duration-200 disabled:opacity-60"
                    style={{ fontFamily: "var(--font-tajawal)" }}
                  >
                    {couponLoading && couponCourseId !== course.id ? "جارٍ التحقق..." : "تطبيق كود الخصم"}
                  </button>

                  <button
                    onClick={() => handleCheckout(course.id)}
                    disabled={loading}
                    className="min-h-11 w-full rounded-xl py-3 font-medium text-white transition-all duration-200 disabled:opacity-70"
                    style={{
                      background: meta.popular ? "#1B6B7A" : "#3A8D9E",
                      fontFamily: "var(--font-tajawal)",
                    }}
                  >
                    {loading && selectedProgram === course.id ? "جارٍ التحويل للدفع..." : "اشتركي الآن"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-md text-center">
          <p className="mb-3 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            أو يمكنك التسجيل عبر واتساب
          </p>
          <a
            href="https://wa.me/96897021040"
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
