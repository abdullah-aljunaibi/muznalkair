"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      thumbnail: (formData.get("thumbnail") as string) || undefined,
    };

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "حدث خطأ");
      }

      toast.success("تم إنشاء الدورة بنجاح");
      router.push("/admin/courses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        إضافة دورة جديدة
      </h1>

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
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{ focusRingColor: "#D4AF37" } as React.CSSProperties}
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
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            placeholder="https://..."
            dir="ltr"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#0A2830" }}
          >
            {loading ? "جاري الحفظ..." : "إنشاء الدورة"}
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
