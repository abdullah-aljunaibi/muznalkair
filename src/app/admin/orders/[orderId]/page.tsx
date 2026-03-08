"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { orderStatusLabels, paymentMethodLabels } from "@/lib/admin/mock-data";

interface OrderDetail {
  id: string;
  amount: number;
  status: keyof typeof orderStatusLabels;
  paymentMethod: keyof typeof paymentMethodLabels;
  stripeSessionId?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    purchases: Array<{ id: string; status: string; amount: number; createdAt: string }>;
  };
  course: {
    id: string;
    title: string;
    description: string;
    totalLessons: number;
    isActive: boolean;
  };
}

const statuses = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const;

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");

  const loadOrder = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setSelectedStatus(data.status);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success("تم تحديث حالة الدفع بنجاح");
      loadOrder();
    } catch {
      toast.error("تعذر تحديث حالة الطلب");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !order) return <p className="text-sm text-[#7A6555]">جاري تحميل تفاصيل الطلب...</p>;

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-block text-sm text-[#9E7E2C] hover:underline">العودة إلى الطلبات</Link>
      <AdminPageHeader
        title={`تفاصيل الطلب #${order.id.slice(-8)}`}
        description="عرض حالة الطلب والبيانات المرتبطة بالطالبة والدورة مع إمكانية التحديث اليدوي."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <AdminCard>
          <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">بيانات الطلب</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><div className="text-sm text-[#7A6555]">المبلغ</div><div className="mt-1 text-xl font-bold">{formatCurrency(order.amount)}</div></div>
            <div><div className="text-sm text-[#7A6555]">طريقة الدفع</div><div className="mt-1">{paymentMethodLabels[order.paymentMethod]}</div></div>
            <div><div className="text-sm text-[#7A6555]">تاريخ الإنشاء</div><div className="mt-1">{formatDate(order.createdAt)}</div></div>
            <div>
              <div className="text-sm text-[#7A6555]">الحالة الحالية</div>
              <div className="mt-2">
                <StatusBadge
                  label={orderStatusLabels[order.status]}
                  tone={order.status === "COMPLETED" ? "success" : order.status === "PENDING" ? "warning" : order.status === "FAILED" ? "danger" : "neutral"}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#EEE3D8] p-4">
            <div className="mb-3 font-medium text-[#0A2830]">تحديث حالة الدفع يدويًا</div>
            <div className="flex flex-col gap-3 md:flex-row">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-2xl border border-[#E7DDD2] px-4 py-3 outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{orderStatusLabels[status]}</option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                disabled={saving}
                className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ الحالة"}
              </button>
            </div>
            <p className="mt-3 text-xs text-[#9A8675]">هذه الميزة مخصصة للتسويات اليدوية أو مراجعة التحويلات البنكية خارج Stripe.</p>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">بيانات الطالبة</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div><span className="text-[#7A6555]">الاسم:</span> {order.user.name}</div>
              <div><span className="text-[#7A6555]">البريد:</span> {order.user.email}</div>
              <div><span className="text-[#7A6555]">تاريخ التسجيل:</span> {formatDate(order.user.createdAt)}</div>
              <div><span className="text-[#7A6555]">عدد الطلبات السابقة:</span> {order.user.purchases.length}</div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">بيانات الدورة</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="font-medium text-[#0A2830]">{order.course.title}</div>
              <div className="text-[#7A6555]">{order.course.description}</div>
              <div><span className="text-[#7A6555]">إجمالي الدروس:</span> {order.course.totalLessons}</div>
              <div><span className="text-[#7A6555]">ظهور الدورة:</span> {order.course.isActive ? "منشورة" : "غير منشورة"}</div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
