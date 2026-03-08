"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, KPI, StatusBadge } from "@/components/admin/AdminUI";
import { couponStatusLabels } from "@/lib/admin/mock-data";
import { formatCurrency, formatDate } from "@/lib/admin/utils";

type CourseOption = { id: string; title: string };

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  status: keyof typeof couponStatusLabels;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  appliesTo: string;
  appliesToAll: boolean;
  applicableCourseIds: string[];
  maxUsesPerUser: number;
  analytics: {
    revenue: number;
    totalDiscount: number;
    uniqueUsers: number;
    purchaseCount: number;
  };
  availableCourses: CourseOption[];
}

export default function CouponDetailPage() {
  const { couponId } = useParams<{ couponId: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [appliesToAll, setAppliesToAll] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/coupons/${couponId}`)
      .then((res) => res.json())
      .then((data) => {
        setCoupon(data);
        setSelectedCourseIds(data.applicableCourseIds || []);
        setAppliesToAll(Boolean(data.appliesToAll));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [couponId]);

  function toggleCourse(courseId: string) {
    setSelectedCourseIds((current) =>
      current.includes(courseId) ? current.filter((id) => id !== courseId) : [...current, courseId]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.get("code"),
          description: formData.get("description"),
          discountType: formData.get("discountType"),
          discountValue: Number(formData.get("discountValue")),
          status: formData.get("status"),
          usageLimit: Number(formData.get("usageLimit")),
          expiresAt: formData.get("expiresAt"),
          appliesToAll,
          applicableCourseIds: appliesToAll ? [] : selectedCourseIds,
          maxUsesPerUser: Number(formData.get("maxUsesPerUser")),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر حفظ الكوبون");
      toast.success("تم حفظ إعدادات الكوبون");
      router.push("/admin/coupons");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الكوبون");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !coupon) return <p className="text-sm text-[#7A6555]">جاري تحميل بيانات الكوبون...</p>;

  return (
    <div>
      <AdminPageHeader title={`تعديل الكوبون ${coupon.code}`} description="تحديث الاستهداف، حدود الاستخدام، وتحليلات الأداء." />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI label="استخدامات ناجحة" value={String(coupon.analytics.purchaseCount)} />
        <KPI label="مستخدمون فريدون" value={String(coupon.analytics.uniqueUsers)} />
        <KPI label="إيراد محقق" value={formatCurrency(coupon.analytics.revenue)} />
        <KPI label="إجمالي الخصم" value={formatCurrency(coupon.analytics.totalDiscount)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,0.8fr]">
        <AdminCard>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الكود</label>
                <input name="code" defaultValue={coupon.code} required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 uppercase outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الحالة</label>
                <select name="status" defaultValue={coupon.status} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                  <option value="ACTIVE">نشط</option>
                  <option value="SCHEDULED">مجدول</option>
                  <option value="DISABLED">معطّل</option>
                  <option value="EXPIRED">منتهي</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الوصف</label>
              <textarea name="description" rows={4} defaultValue={coupon.description} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div className="grid gap-5 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">نوع الخصم</label>
                <select name="discountType" defaultValue={coupon.discountType} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                  <option value="PERCENTAGE">نسبة مئوية</option>
                  <option value="FIXED">مبلغ ثابت</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">قيمة الخصم</label>
                <input name="discountValue" type="number" step="0.001" defaultValue={coupon.discountValue} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">حد الاستخدام</label>
                <input name="usageLimit" type="number" defaultValue={coupon.usageLimit} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">لكل مستخدم</label>
                <input name="maxUsesPerUser" type="number" min="1" defaultValue={coupon.maxUsesPerUser} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">تاريخ الانتهاء</label>
              <input name="expiresAt" type="date" defaultValue={coupon.expiresAt.slice(0, 10)} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>

            <div className="rounded-2xl border border-[#E7DDD2] p-4">
              <div className="mb-3 flex items-center gap-3">
                <input id="all-courses" type="checkbox" checked={appliesToAll} onChange={(e) => setAppliesToAll(e.target.checked)} />
                <label htmlFor="all-courses" className="text-sm font-medium text-[#6E5B4D]">ينطبق على جميع الدورات</label>
              </div>
              {!appliesToAll ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {coupon.availableCourses.map((course) => (
                    <label key={course.id} className="flex items-center gap-3 rounded-xl border border-[#F1E7DC] px-3 py-2 text-sm text-[#4A3828]">
                      <input type="checkbox" checked={selectedCourseIds.includes(course.id)} onChange={() => toggleCourse(course.id)} />
                      <span>{course.title}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>

            <button disabled={saving} className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</button>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">ملخص الاستخدام</h2>
          <div className="mt-4 space-y-3 text-sm text-[#6E5B4D]">
            <div><StatusBadge label={couponStatusLabels[coupon.status]} tone={coupon.status === "ACTIVE" ? "success" : coupon.status === "SCHEDULED" ? "info" : "neutral"} /></div>
            <div>الاستخدام الحالي: <span className="font-semibold text-[#0A2830]">{coupon.usageCount} / {coupon.usageLimit || "∞"}</span></div>
            <div>ينتهي في: <span className="font-semibold text-[#0A2830]">{formatDate(coupon.expiresAt)}</span></div>
            <div>ينطبق على: <span className="font-semibold text-[#0A2830]">{coupon.appliesTo}</span></div>
            <div>حد الاستخدام لكل مستخدم: <span className="font-semibold text-[#0A2830]">{coupon.maxUsesPerUser}</span></div>
            <div className="rounded-2xl bg-[#F6FBFC] p-4 text-xs text-[#4E6971]">تم تفعيل الاستهداف حسب الدورات ومنع تكرار الاستخدام فوق الحد المسموح لكل مستخدم.</div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
