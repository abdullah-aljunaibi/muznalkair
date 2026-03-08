"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/admin/mock-data";

interface Payment {
  id: string;
  amount: number;
  status: keyof typeof orderStatusLabels;
  paymentMethod: keyof typeof paymentMethodLabels;
  createdAt: string;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string };
}

const availableStatuses = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadPayments = () => {
    setLoading(true);
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const stats = useMemo(() => ({
    completed: payments.filter((payment) => payment.status === "COMPLETED").reduce((sum, payment) => sum + payment.amount, 0),
    pendingCount: payments.filter((payment) => payment.status === "PENDING").length,
    refunds: payments.filter((payment) => payment.status === "REFUNDED").length,
  }), [payments]);

  const updateStatus = async (paymentId: string, status: string) => {
    setSavingId(paymentId);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, status }),
      });

      if (!res.ok) throw new Error();
      toast.success("تم تحديث سجل الدفع");
      loadPayments();
    } catch {
      toast.error("فشل تحديث حالة الدفع");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="إدارة المدفوعات"
        description="سجل كامل للمدفوعات مع تعديل سريع للحالة ومتابعة التحويلات البنكية ودفعات Stripe."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <AdminCard><div className="text-sm text-[#7A6555]">الإيراد المحصل</div><div className="mt-2 text-3xl font-bold text-[#166534]">{formatCurrency(stats.completed)}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">دفعات معلقة</div><div className="mt-2 text-3xl font-bold text-[#B7791F]">{stats.pendingCount}</div></AdminCard>
        <AdminCard><div className="text-sm text-[#7A6555]">عمليات استرداد</div><div className="mt-2 text-3xl font-bold text-[#7C3AED]">{stats.refunds}</div></AdminCard>
      </div>

      <AdminCard className="overflow-hidden p-0">
        {loading ? (
          <div className="p-6 text-sm text-[#7A6555]">جاري تحميل سجلات الدفع...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[920px] text-sm">
              <thead className="bg-[#0A2830] text-white">
                <tr>
                  <th className="px-5 py-4 text-right font-medium">الطالبة</th>
                  <th className="px-5 py-4 text-right font-medium">الدورة</th>
                  <th className="px-5 py-4 text-right font-medium">المبلغ</th>
                  <th className="px-5 py-4 text-right font-medium">الطريقة</th>
                  <th className="px-5 py-4 text-right font-medium">الحالة</th>
                  <th className="px-5 py-4 text-right font-medium">تحديث سريع</th>
                  <th className="px-5 py-4 text-right font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#F1E7DC]">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#0A2830]">{payment.user.name}</div>
                      <div className="text-xs text-[#7A6555]">{payment.user.email}</div>
                    </td>
                    <td className="px-5 py-4">{payment.course.title}</td>
                    <td className="px-5 py-4 font-semibold text-[#0A2830]">{formatCurrency(payment.amount)}</td>
                    <td className="px-5 py-4">{paymentMethodLabels[payment.paymentMethod]}</td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={orderStatusLabels[payment.status]}
                        tone={payment.status === "COMPLETED" ? "success" : payment.status === "PENDING" ? "warning" : payment.status === "FAILED" ? "danger" : "neutral"}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        defaultValue={payment.status}
                        onChange={(e) => updateStatus(payment.id, e.target.value)}
                        disabled={savingId === payment.id}
                        className="rounded-xl border border-[#E7DDD2] px-3 py-2 text-xs outline-none"
                      >
                        {availableStatuses.map((status) => (
                          <option key={status} value={status}>{orderStatusLabels[status]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[#7A6555]">{formatDate(payment.createdAt)}</td>
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
