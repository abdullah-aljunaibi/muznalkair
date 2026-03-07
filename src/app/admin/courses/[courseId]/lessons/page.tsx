"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: number;
  isPreview: boolean;
  _count: { documents: number };
}

export default function LessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/lessons`)
      .then((res) => res.json())
      .then(setLessons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleDelete(lessonId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      toast.success("تم حذف الدرس");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  return (
    <div>
      <button
        onClick={() => router.push(`/admin/courses/${courseId}`)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; العودة للدورة
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          إدارة الدروس
        </h1>
        <Link
          href={`/admin/courses/${courseId}/lessons/new`}
          className="px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#D4AF37" }}
        >
          إضافة درس جديد
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-500">لا توجد دروس بعد</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">الترتيب</th>
                <th className="text-right text-white px-6 py-4 font-medium">العنوان</th>
                <th className="text-right text-white px-6 py-4 font-medium">المدة (دقيقة)</th>
                <th className="text-right text-white px-6 py-4 font-medium">مستندات</th>
                <th className="text-right text-white px-6 py-4 font-medium">معاينة</th>
                <th className="text-right text-white px-6 py-4 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">{lesson.order}</td>
                  <td className="px-6 py-4 font-medium">{lesson.title}</td>
                  <td className="px-6 py-4">{lesson.duration}</td>
                  <td className="px-6 py-4">{lesson._count.documents}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.isPreview
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lesson.isPreview ? "نعم" : "لا"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                        className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                        style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                      >
                        تعديل
                      </Link>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
