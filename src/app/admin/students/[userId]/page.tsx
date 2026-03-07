"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Purchase {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  course: { id: string; title: string };
}

interface Progress {
  id: string;
  completedLessons: number;
  totalMinutesWatched: number;
  lastAccessedAt: string;
  course: { id: string; title: string; totalLessons: number };
}

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  purchases: Purchase[];
  progress: Progress[];
}

export default function AdminStudentDetailPage() {
  const { userId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/students/${userId}`)
      .then((res) => res.json())
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-OM", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-700",
      PENDING: "bg-yellow-100 text-yellow-700",
      FAILED: "bg-red-100 text-red-700",
      REFUNDED: "bg-gray-100 text-gray-700",
    };
    const labels: Record<string, string> = {
      COMPLETED: "مكتمل",
      PENDING: "معلق",
      FAILED: "مرفوض",
      REFUNDED: "مسترد",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <p className="text-red-600">الطالبة غير موجودة</p>
        <Link href="/admin/students" className="text-sm underline mt-2 inline-block" style={{ color: "#D4AF37" }}>
          العودة للقائمة
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/students"
        className="text-sm mb-6 inline-block hover:underline"
        style={{ color: "#D4AF37" }}
      >
        &larr; العودة لقائمة الطالبات
      </Link>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        تفاصيل الطالبة
      </h1>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">الاسم</p>
            <p className="font-medium text-lg">{student.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
            <p className="font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">تاريخ الانضمام</p>
            <p className="font-medium">{formatDate(student.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        المشتريات
      </h2>
      {student.purchases.length === 0 ? (
        <p className="text-gray-500 mb-8">لا توجد مشتريات</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">الدورة</th>
                <th className="text-right text-white px-6 py-4 font-medium">المبلغ</th>
                <th className="text-right text-white px-6 py-4 font-medium">طريقة الدفع</th>
                <th className="text-right text-white px-6 py-4 font-medium">الحالة</th>
                <th className="text-right text-white px-6 py-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {student.purchases.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{p.course.title}</td>
                  <td className="px-6 py-4">{p.amount} ر.ع</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.paymentMethod === "WHATSAPP_BANK_TRANSFER" ? "تحويل بنكي" : "Stripe"}
                  </td>
                  <td className="px-6 py-4">{statusBadge(p.status)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Progress Table */}
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        التقدم الدراسي
      </h2>
      {student.progress.length === 0 ? (
        <p className="text-gray-500">لا يوجد تقدم مسجل</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">الدورة</th>
                <th className="text-right text-white px-6 py-4 font-medium">الدروس المكتملة</th>
                <th className="text-right text-white px-6 py-4 font-medium">إجمالي الدروس</th>
                <th className="text-right text-white px-6 py-4 font-medium">دقائق المشاهدة</th>
                <th className="text-right text-white px-6 py-4 font-medium">آخر وصول</th>
              </tr>
            </thead>
            <tbody>
              {student.progress.map((prog) => {
                const percent =
                  prog.course.totalLessons > 0
                    ? Math.round((prog.completedLessons / prog.course.totalLessons) * 100)
                    : 0;
                return (
                  <tr key={prog.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{prog.course.title}</td>
                    <td className="px-6 py-4">
                      {prog.completedLessons}
                      <span className="text-gray-400 text-xs mr-1">({percent}%)</span>
                    </td>
                    <td className="px-6 py-4">{prog.course.totalLessons}</td>
                    <td className="px-6 py-4">{prog.totalMinutesWatched}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(prog.lastAccessedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
