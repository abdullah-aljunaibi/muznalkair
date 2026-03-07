"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewLessonPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      videoUrl: (formData.get("videoUrl") as string) || undefined,
      duration: parseInt(formData.get("duration") as string) || 0,
      order: parseInt(formData.get("order") as string) || 0,
      isPreview: formData.get("isPreview") === "on",
    };

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "حدث خطأ");
      }

      toast.success("تم إنشاء الدرس بنجاح");
      router.push(`/admin/courses/${courseId}/lessons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; العودة
      </button>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        إضافة درس جديد
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الدرس
          </label>
          <input
            name="title"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الفيديو
          </label>
          <input
            name="videoUrl"
            type="url"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدة (بالدقائق)
            </label>
            <input
              name="duration"
              type="number"
              defaultValue={0}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الترتيب
            </label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input name="isPreview" type="checkbox" id="isPreview" className="w-4 h-4" />
          <label htmlFor="isPreview" className="text-sm text-gray-700">
            متاح كمعاينة مجانية
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#0A2830" }}
          >
            {loading ? "جاري الحفظ..." : "إنشاء الدرس"}
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
