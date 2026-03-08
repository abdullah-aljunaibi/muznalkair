"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/admin/mock-data";

interface Order {
  id: string;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  status: keyof typeof orderStatusLabels;
  paymentMethod: keyof typeof paymentMethodLabels;
  stripeSessionId?: string | null;
  createdAt: string;
  student: { id: string; name: string; email: string };
  course: { id: string; title: string };
  coupon?: { id: string; code: string } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);

    void (async () => {
      try {
        const res = await fetch(`/api/admin/orders?${params.toString()}`, { signal: controller.signal });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        if ((error as { name?: string })?.name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [search, status]);

  const summary = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((order) => order.status === "PENDING").length,
    completed: orders.filter((order) => order.status === "COMPLETED").length,
    revenue: orders.filter((order) => order.status === "COMPLETED").reduce((sum, order) => sum + order.amount, 0),
  }), [orders]);

  return (
    <div>
      <AdminPageHeader
        title="إدارة الطلبات"
        description="قائمة الطلبات مع مراجعة حالة الدفع والخصومات المطبقة وتفاصيل كل طلب."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard><div className="text-sm text-[#7A6555]">إجمالي الطلبات</div><div className="mt-2 text-3xl font-bold text-[#0A2830]">{summary.all}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">طلبات معلقة</div><div className="mt-2 text-3xl font-bold text-[#B7791F]">{summary.pending}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">طلبات مدفوعة</div><div className="mt-2 text-3xl font-bold text-[#166534]">{summary.completed}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">إيرادات مؤكدة</div><div className="mt-2 text-3xl font-bold text-[#0A2830]">{formatCurrency(summary.revenue)}</div></AdminCard>
      </div>

      <AdminCard className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr,220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الطالبة أو البريد أو الدورة أو الكوبون"
            className="rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none"
          >
            <option value="ALL">كل الحالات</option>
            <option value="PENDING">معلّق</option>
            <option value="COMPLETED">مدفوع</option>
            <option value="FAILED">فشل الدفع</option>
            <option value="REFUNDED">مسترد</option>
          </select>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        {loading ? (
          <div className="p-6 text-sm text-[#7A6555]">جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-[#7A6555]">لا توجد طلبات مطابقة حاليًا.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0A2830] text-white">
                <tr>
                  <th className="px-5 py-4 text-right font-medium">رقم الطلب</th>
                  <th className="px-5 py-4 text-right font-medium">الطالبة</th>
                  <th className="px-5 py-4 text-right font-medium">الدورة</th>
                  <th className="px-5 py-4 text-right font-medium">المبلغ</th>
                  <th className="px-5 py-4 text-right font-medium">الكوبون</th>
                  <th className="px-5 py-4 text-right font-medium">طريقة الدفع</th>
                  <th className="px-5 py-4 text-right font-medium">الحالة</th>
                  <th className="px-5 py-4 text-right font-medium">التاريخ</th>
                  <th className="px-5 py-4 text-right font-medium">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#F1E7DC] bg-white">
                    <td className="px-5 py-4 text-[#7A6555]">#{order.id.slice(-8)}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#0A2830]">{order.student.name}</div>
                      <div className="text-xs text-[#7A6555]">{order.student.email}</div>
                    </td>
                    <td className="px-5 py-4">{order.course.title}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0A2830]">{formatCurrency(order.amount)}</div>
                      {order.discountAmount > 0 ? (
                        <div className="text-xs text-[#7A6555]">
                          قبل الخصم {formatCurrency(order.originalAmount)} • خصم {formatCurrency(order.discountAmount)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">{order.coupon?.code || "—"}</td>
                    <td className="px-5 py-4">{paymentMethodLabels[order.paymentMethod]}</td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={orderStatusLabels[order.status]}
                        tone={order.status === "COMPLETED" ? "success" : order.status === "PENDING" ? "warning" : order.status === "FAILED" ? "danger" : "neutral"}
                      />
                    </td>
                    <td className="px-5 py-4 text-[#7A6555]">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="rounded-xl border border-[#D4AF37]/40 px-3 py-2 text-xs font-medium text-[#9E7E2C] hover:bg-[#FFF8E6]">
                        التفاصيل
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
