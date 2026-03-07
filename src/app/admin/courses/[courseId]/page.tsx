"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  isActive: boolean;
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      thumbnail: (formData.get("thumbnail") as string) || null,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم تحديث الدورة بنجاح");
      router.push("/admin/courses");
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع الدروس المرتبطة بها.")) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("حدث خطأ");
      toast.success("تم حذف الدورة بنجاح");
      router.push("/admin/courses");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  if (loading) return <p className="text-gray-500">جاري التحميل...</p>;
  if (!course) return <p className="text-red-500">الدورة غير موجودة</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          تعديل الدورة
        </h1>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          حذف الدورة
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الدورة
          </label>
          <input
            name="title"
            required
            defaultValue={course.title}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={course.description}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر (ر.ع)
          </label>
          <input
            name="price"
            type="number"
            step="0.001"
            required
            defaultValue={course.price}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الصورة المصغرة
          </label>
          <input
            name="thumbnail"
            type="url"
            defaultValue={course.thumbnail || ""}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            dir="ltr"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={course.isActive}
            id="isActive"
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            الدورة نشطة (ظاهرة للطالبات)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#0A2830" }}
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
