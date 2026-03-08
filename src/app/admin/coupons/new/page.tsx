"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";

export default function NewCouponPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);

    const payload = {
      code: formData.get("code"),
      description: formData.get("description"),
      discountType: formData.get("discountType"),
      discountValue: Number(formData.get("discountValue")),
      status: formData.get("status"),
      usageLimit: Number(formData.get("usageLimit")),
      expiresAt: formData.get("expiresAt"),
      appliesTo: formData.get("appliesTo"),
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تجهيز الكوبون في واجهة الإدارة");
      router.push("/admin/coupons");
    } catch {
      toast.error("تعذر حفظ الكوبون");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="إضافة كوبون" description="إنشاء كوبون خصم جديد لواجهة الإدارة V1." />
      <AdminCard className="max-w-3xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">كود الخصم</label>
              <input name="code" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 uppercase outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">نوع الخصم</label>
              <select name="discountType" className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                <option value="PERCENTAGE">نسبة مئوية</option>
                <option value="FIXED">مبلغ ثابت</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الوصف</label>
            <textarea name="description" rows={4} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">قيمة الخصم</label>
              <input name="discountValue" type="number" step="0.01" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الحد الأقصى للاستخدام</label>
              <input name="usageLimit" type="number" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الحالة</label>
              <select name="status" className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                <option value="ACTIVE">نشط</option>
                <option value="SCHEDULED">مجدول</option>
                <option value="DISABLED">معطّل</option>
              </select>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">تاريخ الانتهاء</label>
              <input name="expiresAt" type="date" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">ينطبق على</label>
              <input name="appliesTo" defaultValue="جميع الدورات" className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button disabled={saving} className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "جاري الحفظ..." : "حفظ الكوبون"}</button>
            <button type="button" onClick={() => router.back()} className="rounded-2xl border border-[#E7DDD2] px-5 py-3 text-sm font-medium text-[#7A6555]">إلغاء</button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
