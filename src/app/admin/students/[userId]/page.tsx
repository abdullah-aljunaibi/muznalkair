"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { orderStatusLabels, paymentMethodLabels, studentAccessLabels } from "@/lib/admin/mock-data";

interface Purchase {
  id: string;
  amount: number;
  status: keyof typeof orderStatusLabels;
  paymentMethod: keyof typeof paymentMethodLabels;
  createdAt: string;
  course: { id: string; title: string; description: string };
}

interface Progress {
  id: string;
  completedLessons: number;
  totalMinutesWatched: number;
  lastAccessedAt: string;
  course: { id: string; title: string; totalLessons: number };
}

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  purchases: Purchase[];
  progress: Progress[];
}

export default function StudentDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/students/${userId}`)
      .then((res) => res.json())
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const accessStatus = useMemo(() => {
    if (!student) return "SUSPENDED" as const;
    if (student.purchases.some((purchase) => purchase.status === "COMPLETED")) return "ACTIVE" as const;
    if (student.purchases.some((purchase) => purchase.status === "PENDING")) return "PENDING_PAYMENT" as const;
    return "SUSPENDED" as const;
  }, [student]);

  if (loading || !student) return <p className="text-sm text-[#7A6555]">جاري تحميل ملف الطالبة...</p>;

  return (
    <div>
      <Link href="/admin/students" className="mb-4 inline-block text-sm text-[#9E7E2C] hover:underline">العودة إلى الطالبات</Link>
      <AdminPageHeader title="ملف الطالبة" description="عرض الحالة الحالية والدورات المسجلة وسجل المدفوعات والتقدم التعليمي." />

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">البيانات الأساسية</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><div className="text-sm text-[#7A6555]">الاسم</div><div className="mt-1 font-medium text-[#0A2830]">{student.name}</div></div>
            <div><div className="text-sm text-[#7A6555]">البريد الإلكتروني</div><div className="mt-1 font-medium text-[#0A2830]">{student.email}</div></div>
            <div><div className="text-sm text-[#7A6555]">تاريخ الانضمام</div><div className="mt-1">{formatDate(student.createdAt)}</div></div>
            <div><div className="text-sm text-[#7A6555]">حالة الوصول</div><div className="mt-2"><StatusBadge label={studentAccessLabels[accessStatus]} tone={accessStatus === "ACTIVE" ? "success" : accessStatus === "PENDING_PAYMENT" ? "warning" : "danger"} /></div></div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">ملخص التسجيلات</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div><div className="text-sm text-[#7A6555]">الدورات المسجلة</div><div className="mt-1 text-2xl font-bold text-[#0A2830]">{student.purchases.length}</div></div>
            <div><div className="text-sm text-[#7A6555]">الدورات النشطة</div><div className="mt-1 text-2xl font-bold text-[#166534]">{student.purchases.filter((purchase) => purchase.status === "COMPLETED").length}</div></div>
            <div><div className="text-sm text-[#7A6555]">إجمالي الإنفاق</div><div className="mt-1 text-2xl font-bold text-[#0A2830]">{formatCurrency(student.purchases.reduce((sum, purchase) => sum + purchase.amount, 0))}</div></div>
          </div>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">الدورات والمدفوعات</h2>
          <div className="mt-4 space-y-4">
            {student.purchases.length === 0 ? (
              <p className="text-sm text-[#7A6555]">لا توجد أي دورات مسجلة لهذه الطالبة حتى الآن.</p>
            ) : (
              student.purchases.map((purchase) => (
                <div key={purchase.id} className="rounded-2xl border border-[#EEE3D8] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="font-medium text-[#0A2830]">{purchase.course.title}</div>
                      <div className="mt-1 text-sm text-[#7A6555]">{purchase.course.description}</div>
                      <div className="mt-2 text-xs text-[#9A8675]">{paymentMethodLabels[purchase.paymentMethod]} • {formatDate(purchase.createdAt)}</div>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <div className="font-semibold text-[#0A2830]">{formatCurrency(purchase.amount)}</div>
                      <StatusBadge
                        label={orderStatusLabels[purchase.status]}
                        tone={purchase.status === "COMPLETED" ? "success" : purchase.status === "PENDING" ? "warning" : purchase.status === "FAILED" ? "danger" : "neutral"}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">التقدم التعليمي</h2>
          <div className="mt-4 space-y-4">
            {student.progress.length === 0 ? (
              <p className="text-sm text-[#7A6555]">لا يوجد تقدم مسجل بعد.</p>
            ) : (
              student.progress.map((item) => {
                const percent = item.course.totalLessons > 0 ? Math.round((item.completedLessons / item.course.totalLessons) * 100) : 0;
                return (
                  <div key={item.id} className="rounded-2xl border border-[#EEE3D8] p-4">
                    <div className="font-medium text-[#0A2830]">{item.course.title}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EFE7DE]">
                      <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#7A6555]">
                      <span>{item.completedLessons} / {item.course.totalLessons} دروس</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="mt-2 text-xs text-[#9A8675]">آخر دخول: {formatDate(item.lastAccessedAt)} • {item.totalMinutesWatched} دقيقة مشاهدة</div>
                  </div>
                );
              })
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
