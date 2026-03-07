"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  documents: Document[];
}

export default function EditLessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Document form state
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [addingDoc, setAddingDoc] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`)
      .then((res) => res.json())
      .then(setLesson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      duration: parseInt(formData.get("duration") as string) || 0,
      order: parseInt(formData.get("order") as string) || 0,
      isPreview: formData.get("isPreview") === "on",
    };

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/lessons/${lessonId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("تم تحديث الدرس بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDocument() {
    if (!docTitle || !docUrl) {
      toast.error("العنوان والرابط مطلوبان");
      return;
    }

    setAddingDoc(true);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: docTitle, fileUrl: docUrl, fileType: docType }),
      });

      if (!res.ok) throw new Error();
      const newDoc = await res.json();
      setLesson((prev) =>
        prev ? { ...prev, documents: [newDoc, ...prev.documents] } : prev
      );
      setDocTitle("");
      setDocUrl("");
      setDocType("pdf");
      toast.success("تمت إضافة المستند");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setAddingDoc(false);
    }
  }

  async function handleDeleteDocument(docId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المستند؟")) return;

    try {
      const res = await fetch(`/api/admin/documents/${docId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setLesson((prev) =>
        prev
          ? { ...prev, documents: prev.documents.filter((d) => d.id !== docId) }
          : prev
      );
      toast.success("تم حذف المستند");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  if (loading) return <p className="text-gray-500">جاري التحميل...</p>;
  if (!lesson) return <p className="text-red-500">الدرس غير موجود</p>;

  return (
    <div>
      <button
        onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; العودة للدروس
      </button>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        تعديل الدرس
      </h1>

      {/* Lesson Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl space-y-6 mb-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الدرس
          </label>
          <input
            name="title"
            required
            defaultValue={lesson.title}
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
            defaultValue={lesson.description || ""}
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
            defaultValue={lesson.videoUrl || ""}
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
              defaultValue={lesson.duration}
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
              defaultValue={lesson.order}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="isPreview"
            type="checkbox"
            defaultChecked={lesson.isPreview}
            id="isPreview"
            className="w-4 h-4"
          />
          <label htmlFor="isPreview" className="text-sm text-gray-700">
            متاح كمعاينة مجانية
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
        </div>
      </form>

      {/* Documents Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl">
        <h2
          className="text-xl font-bold mb-6"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          المستندات والملفات
        </h2>

        {/* Add Document Form */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان المستند
            </label>
            <input
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رابط الملف
            </label>
            <input
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع الملف
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
            >
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
              <option value="ppt">PowerPoint</option>
              <option value="image">صورة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <button
            onClick={handleAddDocument}
            disabled={addingDoc}
            className="px-6 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#D4AF37" }}
          >
            {addingDoc ? "جاري الإضافة..." : "إضافة مستند"}
          </button>
        </div>

        {/* Documents List */}
        {lesson.documents.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد مستندات</p>
        ) : (
          <div className="space-y-3">
            {lesson.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-500 mt-1" dir="ltr">
                    {doc.fileType.toUpperCase()} - {doc.fileUrl}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
