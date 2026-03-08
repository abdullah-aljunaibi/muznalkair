"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { studentAccessLabels } from "@/lib/admin/mock-data";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  courseCount: number;
  totalSpent: number;
  accessStatus: keyof typeof studentAccessLabels;
  completedPurchases: number;
  pendingPurchases: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = search ? `?search=${encodeURIComponent(search)}` : "";

    void (async () => {
      try {
        const res = await fetch(`/api/admin/students${params}`, { signal: controller.signal });
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        if ((error as { name?: string })?.name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [search]);

  const totals = useMemo(() => ({
    active: students.filter((student) => student.accessStatus === "ACTIVE").length,
    pending: students.filter((student) => student.accessStatus === "PENDING_PAYMENT").length,
    totalRevenue: students.reduce((sum, student) => sum + student.totalSpent, 0),
  }), [students]);

  return (
    <div>
      <AdminPageHeader
        title="إدارة الطالبات"
        description="عرض الطالبات، حالة الوصول، الدورات الملتحقن بها، وسجل الإنفاق لكل طالبة."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <AdminCard><div className="text-sm text-[#7A6555]">طالبات نشطات</div><div className="mt-2 text-3xl font-bold text-[#166534]">{totals.active}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">بانتظار الدفع</div><div className="mt-2 text-3xl font-bold text-[#B7791F]">{totals.pending}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">إجمالي إنفاق الطالبات</div><div className="mt-2 text-3xl font-bold text-[#0A2830]">{formatCurrency(totals.totalRevenue)}</div></AdminCard>
      </div>

      <AdminCard className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو البريد الإلكتروني"
          className="w-full rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none md:max-w-lg"
        />
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        {loading ? (
          <div className="p-6 text-sm text-[#7A6555]">جاري تحميل الطالبات...</div>
        ) : students.length === 0 ? (
          <div className="p-6 text-sm text-[#7A6555]">لا توجد نتائج مطابقة.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[840px] text-sm">
              <thead className="bg-[#0A2830] text-white">
                <tr>
                  <th className="px-5 py-4 text-right font-medium">الطالبة</th>
                  <th className="px-5 py-4 text-right font-medium">تاريخ الانضمام</th>
                  <th className="px-5 py-4 text-right font-medium">الدورات</th>
                  <th className="px-5 py-4 text-right font-medium">الوصول</th>
                  <th className="px-5 py-4 text-right font-medium">المدفوع</th>
                  <th className="px-5 py-4 text-right font-medium">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-[#F1E7DC]">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#0A2830]">{student.name}</div>
                      <div className="text-xs text-[#7A6555]">{student.email}</div>
                    </td>
                    <td className="px-5 py-4 text-[#7A6555]">{formatDate(student.createdAt)}</td>
                    <td className="px-5 py-4">{student.courseCount}</td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={studentAccessLabels[student.accessStatus]}
                        tone={student.accessStatus === "ACTIVE" ? "success" : student.accessStatus === "PENDING_PAYMENT" ? "warning" : "danger"}
                      />
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0A2830]">{formatCurrency(student.totalSpent)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/students/${student.id}`} className="rounded-xl border border-[#D4AF37]/40 px-3 py-2 text-xs font-medium text-[#9E7E2C] hover:bg-[#FFF8E6]">
                        عرض الملف
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
