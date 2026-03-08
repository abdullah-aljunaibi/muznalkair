"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { getUploadStatusLabel, formatDate } from "@/lib/admin/utils";

interface UploadItem {
  id: string;
  title: string;
  courseName: string;
  lessonName: string;
  type: string;
  status: string;
  updatedAt: string;
  uploadedBy: string;
  notes?: string;
}

interface UploadResponse {
  items: UploadItem[];
  storageConfigured: boolean;
  todo: string[];
}

export default function UploadsPage() {
  const [data, setData] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content-uploads")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const res = await fetch("/api/admin/content-uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      toast.success("تم تنفيذ تدفق الرفع الأمامي بنجاح");
      event.currentTarget.reset();
    } catch {
      toast.error("تعذر تنفيذ تدفق الرفع");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="رفع المحتوى" description="تدفق إداري جاهز لرفع الفيديوهات والملفات مع توضيح ما بقي من ربط الخلفية والتخزين." />

      <div className="grid gap-6 xl:grid-cols-[1fr,0.95fr]">
        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">إضافة ملف جديد</h2>
          <p className="mt-2 text-sm text-[#7A6555]">هذه الواجهة جاهزة للاستخدام الإداري الآن، لكن التخزين الفعلي ما يزال بحاجة ربط بخدمة ملفات.</p>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">عنوان الملف</label>
                <input name="title" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">نوع الملف</label>
                <select name="type" className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none">
                  <option value="VIDEO">فيديو</option>
                  <option value="PDF">PDF</option>
                  <option value="AUDIO">صوت</option>
                  <option value="WORKSHEET">ورقة عمل</option>
                </select>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الدورة</label>
                <input name="courseName" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الدرس / الوحدة</label>
                <input name="lessonName" required className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">الملف</label>
              <input name="file" type="file" className="w-full rounded-2xl border border-dashed border-[#D4AF37]/50 bg-[#FFFDF8] px-4 py-4" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6E5B4D]">ملاحظات داخلية</label>
              <textarea name="notes" rows={4} className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none" />
            </div>
            <button disabled={uploading} className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{uploading ? "جاري التنفيذ..." : "تنفيذ تدفق الرفع"}</button>
          </form>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">حالة الربط الخلفي</h2>
            {loading || !data ? (
              <p className="mt-4 text-sm text-[#7A6555]">جاري تحميل الحالة...</p>
            ) : (
              <>
                <div className="mt-4">
                  <StatusBadge label={data.storageConfigured ? "التخزين مفعّل" : "التخزين غير مربوط بعد"} tone={data.storageConfigured ? "success" : "warning"} />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#7A6555]">
                  {data.todo.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
          </AdminCard>

          <AdminCard>
            <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">آخر عناصر المحتوى</h2>
            <div className="mt-4 space-y-4">
              {(data?.items || []).map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#EEE3D8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#0A2830]">{item.title}</div>
                      <div className="mt-1 text-sm text-[#7A6555]">{item.courseName} • {item.lessonName}</div>
                      <div className="mt-2 text-xs text-[#9A8675]">{item.type} • بواسطة {item.uploadedBy} • {formatDate(item.updatedAt)}</div>
                    </div>
                    <StatusBadge label={getUploadStatusLabel(item.status)} tone={item.status === "READY" ? "success" : item.status === "PROCESSING" ? "info" : item.status === "FAILED" ? "danger" : "warning"} />
                  </div>
                  {item.notes ? <div className="mt-3 text-xs text-[#7A6555]">{item.notes}</div> : null}
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
