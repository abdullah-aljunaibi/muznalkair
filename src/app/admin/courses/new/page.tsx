"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";

export default function NewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      thumbnail: formData.get("thumbnail") || null,
      totalLessons: Number(formData.get("totalLessons")),
      visibilityStatus: formData.get("visibilityStatus"),
    };

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success("تم إنشاء الدورة بنجاح");
      router.push("/admin/courses");
    } catch {
      toast.error("تعذر إنشاء الدورة");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="إضافة دورة جديدة" description="أدخل البيانات الأساسية للدورة كما ستظهر في الأكاديمية والمتجر." />
      <AdminCard className="max-w-3xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">اسم الدورة</label>
            <input name="title" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الوصف</label>
            <textarea name="description" rows={5} required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">السعر</label>
              <input name="price" type="number" step="0.001" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">عدد الدروس</label>
              <input name="totalLessons" type="number" min="0" defaultValue={0} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الحالة</label>
              <select name="visibilityStatus" defaultValue="PUBLISHED" className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                <option value="PUBLISHED">منشورة</option>
                <option value="DRAFT">مسودة</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">رابط الصورة المصغرة</label>
            <input name="thumbnail" type="url" dir="ltr" placeholder="https://..." className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
          </div>
          <div className="flex gap-3">
            <button disabled={saving} className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "جاري الحفظ..." : "إنشاء الدورة"}</button>
            <button type="button" onClick={() => router.back()} className="rounded-2xl border border-[#E7DDD2] px-5 py-3 text-sm font-medium text-[#7A6555]">إلغاء</button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
