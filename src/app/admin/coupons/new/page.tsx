"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";

type CourseOption = { id: string; title: string };

export default function NewCouponPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [appliesToAll, setAppliesToAll] = useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then(() => fetch("/api/admin/courses"))
      .then((res) => res.json())
      .then((data) => setCourses(data.map((course: { id: string; title: string }) => ({ id: course.id, title: course.title }))))
      .catch(console.error);
  }, []);

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
      appliesToAll,
      applicableCourseIds: appliesToAll ? [] : selectedCourseIds,
      maxUsesPerUser: Number(formData.get("maxUsesPerUser")),
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر حفظ الكوبون");
      toast.success("تم إنشاء الكوبون بنجاح");
      router.push("/admin/coupons");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الكوبون");
    } finally {
      setSaving(false);
    }
  }

  function toggleCourse(courseId: string) {
    setSelectedCourseIds((current) =>
      current.includes(courseId) ? current.filter((id) => id !== courseId) : [...current, courseId]
    );
  }

  return (
    <div>
      <AdminPageHeader title="إضافة كوبون" description="إنشاء كوبون خصم جديد وربطه بالدفع مباشرة مع قواعد استخدام واضحة." />
      <AdminCard className="max-w-4xl">
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

          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">قيمة الخصم</label>
              <input name="discountValue" type="number" step="0.001" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الحد الأقصى للاستخدام</label>
              <input name="usageLimit" type="number" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">لكل مستخدم</label>
              <input name="maxUsesPerUser" type="number" min="1" defaultValue="1" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
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

          <div>
            <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">تاريخ الانتهاء</label>
            <input name="expiresAt" type="date" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
          </div>

          <div className="rounded-2xl border border-[#E7DDD2] p-4">
            <div className="mb-3 flex items-center gap-3">
              <input id="all-courses" type="checkbox" checked={appliesToAll} onChange={(e) => setAppliesToAll(e.target.checked)} />
              <label htmlFor="all-courses" className="text-sm font-medium text-[#6E5B4D]">ينطبق على جميع الدورات</label>
            </div>
            {!appliesToAll ? (
              <div className="grid gap-2 md:grid-cols-2">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center gap-3 rounded-xl border border-[#F1E7DC] px-3 py-2 text-sm text-[#4A3828]">
                    <input
                      type="checkbox"
                      checked={selectedCourseIds.includes(course.id)}
                      onChange={() => toggleCourse(course.id)}
                    />
                    <span>{course.title}</span>
                  </label>
                ))}
              </div>
            ) : null}
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
