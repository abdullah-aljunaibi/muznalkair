"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminCard, AdminPageHeader, KPI, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/admin/mock-data";

interface StatsResponse {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  pendingWhatsapp: number;
  totalOrders?: number;
  recentOrders?: Array<{
    id: string;
    amount: number;
    status: keyof typeof orderStatusLabels;
    paymentMethod: keyof typeof paymentMethodLabels;
    createdAt: string;
    user: { name: string; email: string };
    course: { title: string };
  }>;
  recentActivity?: Array<{ id: string; title: string; description: string; time: string; type: string }>;
  couponCount?: number;
  pendingUploads?: number;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const revenuePerStudent = useMemo(() => {
    if (!data?.totalStudents) return 0;
    return data.totalRevenue / data.totalStudents;
  }, [data]);

  return (
    <div>
      <AdminPageHeader
        title="لوحة إدارة الأكاديمية"
        description="نظرة سريعة على الطلبات، الطالبات، الدورات، والتحركات اليومية داخل مقرأة مُزن الخير."
      />

      {loading || !data ? (
        <p className="text-sm text-[#7A6555]">جاري تحميل بيانات لوحة الإدارة...</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPI label="إجمالي الطالبات" value={String(data.totalStudents)} hint="جميع الحسابات ذات دور طالبة" />
            <KPI label="إجمالي الطلبات" value={String(data.totalOrders || 0)} hint="طلبات الشراء بجميع الحالات" />
            <KPI label="إجمالي الإيرادات" value={formatCurrency(data.totalRevenue)} hint="طلبات مكتملة فقط" />
            <KPI label="المحتوى بانتظار الإجراء" value={String(data.pendingUploads || 0)} hint="ملفات تحتاج ربط تخزين أو معالجة" />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPI label="الدورات المنشورة" value={String(data.activeCourses)} hint="الدورات المفعلة حاليًا" />
            <KPI label="دفعات التحويل المعلقة" value={String(data.pendingWhatsapp)} hint="تحتاج مراجعة يدوية" />
            <KPI label="الكوبونات المتاحة" value={String(data.couponCount || 0)} hint="واجهة V1 جاهزة" />
            <KPI label="متوسط العائد لكل طالبة" value={formatCurrency(revenuePerStudent)} hint="مؤشر تقريبي سريع" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
            <AdminCard>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">أحدث الطلبات</h2>
                <Link href="/admin/orders" className="text-sm text-[#9E7E2C] hover:underline">عرض الكل</Link>
              </div>

              <div className="space-y-4">
                {(data.recentOrders || []).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-[#EEE3D8] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-medium text-[#0A2830]">{order.user.name} — {order.course.title}</div>
                        <div className="mt-1 text-sm text-[#7A6555]">{order.user.email} • {formatDate(order.createdAt)} • {paymentMethodLabels[order.paymentMethod]}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-[#0A2830]">{formatCurrency(order.amount)}</div>
                        <StatusBadge
                          label={orderStatusLabels[order.status]}
                          tone={order.status === "COMPLETED" ? "success" : order.status === "PENDING" ? "warning" : order.status === "FAILED" ? "danger" : "neutral"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">النشاط الأخير</h2>
              </div>

              <div className="space-y-4">
                {(data.recentActivity || []).map((item) => (
                  <div key={item.id} className="border-r-2 border-[#D4AF37] pr-4">
                    <div className="font-medium text-[#0A2830]">{item.title}</div>
                    <div className="mt-1 text-sm text-[#7A6555]">{item.description}</div>
                    <div className="mt-2 text-xs text-[#9A8675]">{item.time}</div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}
