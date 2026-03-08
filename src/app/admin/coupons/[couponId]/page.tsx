"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { couponStatusLabels } from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/utils";

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
  createdAt?: string;
}

export default function CouponDetailPage() {
  const { couponId } = useParams<{ couponId: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/coupons/${couponId}`)
      .then((res) => res.json())
      .then(setCoupon)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [couponId]);

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
          appliesTo: formData.get("appliesTo"),
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
      <AdminPageHeader title={`تعديل الكوبون ${coupon.code}`} description="تحديث حالة الكوبون وحدوده وربطه المباشر بالدفع." />
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
            <div className="grid gap-5 md:grid-cols-3">
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
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">تاريخ الانتهاء</label>
                <input name="expiresAt" type="date" defaultValue={coupon.expiresAt.slice(0, 10)} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">ينطبق على</label>
                <input name="appliesTo" defaultValue={coupon.appliesTo} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
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
            <div className="rounded-2xl bg-[#F6FBFC] p-4 text-xs text-[#4E6971]">هذا الكوبون أصبح مرتبطًا فعليًا بقاعدة البيانات ويمكن استخدامه مباشرة أثناء الدفع.</div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
