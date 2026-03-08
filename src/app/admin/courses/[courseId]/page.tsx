"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { courseVisibilityLabels } from "@/lib/admin/mock-data";

interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  documents: Array<{ id: string; title: string; fileType: string }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  totalLessons: number;
  visibilityStatus: keyof typeof courseVisibilityLabels;
  isActive: boolean;
  lessons: Lesson[];
  _count: { purchases: number };
}

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}`)
      .then((res) => res.json())
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

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
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success("تم تحديث الدورة");
      router.push("/admin/courses");
    } catch {
      toast.error("تعذر حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("سيتم حذف الدورة وكل ما يرتبط بها. هل تريد المتابعة؟")) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف الدورة");
      router.push("/admin/courses");
    } catch {
      toast.error("تعذر حذف الدورة");
    }
  }

  if (loading || !course) return <p className="text-sm text-[#7A6555]">جاري تحميل الدورة...</p>;

  return (
    <div>
      <AdminPageHeader title="تعديل الدورة" description="تحديث وصف الدورة وبياناتها الأساسية مع مراجعة هيكل الدروس الحالي." />

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <AdminCard>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">البيانات الأساسية</h2>
              <StatusBadge label={courseVisibilityLabels[course.visibilityStatus]} tone={course.visibilityStatus === "PUBLISHED" ? "success" : "warning"} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">اسم الدورة</label>
              <input name="title" defaultValue={course.title} required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الوصف</label>
              <textarea name="description" rows={5} defaultValue={course.description} required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">السعر</label>
                <input name="price" type="number" step="0.001" defaultValue={course.price} required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">عدد الدروس</label>
                <input name="totalLessons" type="number" min="0" defaultValue={course.totalLessons} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الظهور</label>
                <select name="visibilityStatus" defaultValue={course.visibilityStatus} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                  <option value="PUBLISHED">منشورة</option>
                  <option value="DRAFT">مسودة</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">رابط الصورة المصغرة</label>
              <input name="thumbnail" type="url" dir="ltr" defaultValue={course.thumbnail || ""} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <div className="flex flex-wrap gap-3">
              <button disabled={saving} className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</button>
              <button type="button" onClick={handleDelete} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium text-white">حذف الدورة</button>
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">الدروس والمرفقات الحالية</h2>
          <p className="mt-2 text-sm text-[#7A6555]">استعراض سريع لمحتوى الدورة الحالي. إدارة الرفع الكاملة متاحة من صفحة رفع المحتوى.</p>
          <div className="mt-5 space-y-4">
            {course.lessons.length === 0 ? (
              <p className="text-sm text-[#7A6555]">لا توجد دروس مرتبطة بهذه الدورة بعد.</p>
            ) : (
              course.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-[#EEE3D8] p-4">
                  <div className="font-medium text-[#0A2830]">{lesson.order}. {lesson.title}</div>
                  <div className="mt-1 text-xs text-[#7A6555]">المدة: {lesson.duration} دقيقة • المرفقات: {lesson.documents.length}</div>
                  {lesson.documents.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-xs text-[#9A8675]">
                      {lesson.documents.map((document) => (
                        <li key={document.id}>• {document.title} ({document.fileType})</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
