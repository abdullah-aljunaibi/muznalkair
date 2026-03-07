"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (purchaseId: string, action: "approve" | "reject") => {
    const confirmMsg = action === "approve" ? "هل تريد الموافقة على هذه الدفعة؟" : "هل تريد رفض هذه الدفعة؟";
    if (!confirm(confirmMsg)) return;

    const res = await fetch(`/api/admin/payments/${purchaseId}/${action}`, {
      method: "PUT",
    });

    if (res.ok) {
      fetchPayments();
    } else {
      const data = await res.json();
      alert(data.error || "حدث خطأ");
    }
  };

  const pendingWhatsapp = payments.filter(
    (p) => p.status === "PENDING" && p.paymentMethod === "WHATSAPP_BANK_TRANSFER"
  );

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-OM", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div>
        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          إدارة المدفوعات
        </h1>
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        إدارة المدفوعات
      </h1>

      {/* Section 1: Pending WhatsApp Payments */}
      {pendingWhatsapp.length > 0 && (
        <div className="mb-10">
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
          >
            تحويلات واتساب معلقة
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#D4AF37" }}>
                  <th className="text-right text-white px-6 py-4 font-medium">الطالبة</th>
                  <th className="text-right text-white px-6 py-4 font-medium">البريد</th>
                  <th className="text-right text-white px-6 py-4 font-medium">الدورة</th>
                  <th className="text-right text-white px-6 py-4 font-medium">المبلغ</th>
                  <th className="text-right text-white px-6 py-4 font-medium">التاريخ</th>
                  <th className="text-right text-white px-6 py-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pendingWhatsapp.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{p.user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{p.user.email}</td>
                    <td className="px-6 py-4">{p.course.title}</td>
                    <td className="px-6 py-4">{p.amount} ر.ع</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(p.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(p.id, "approve")}
                          className="px-3 py-1.5 text-white rounded text-xs font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: "#0A2830" }}
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => handleAction(p.id, "reject")}
                          className="px-3 py-1.5 text-white rounded text-xs font-medium bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: All Payments */}
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        جميع المدفوعات
      </h2>
      {payments.length === 0 ? (
        <p className="text-gray-500">لا توجد مدفوعات بعد</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">الطالبة</th>
                <th className="text-right text-white px-6 py-4 font-medium">البريد</th>
                <th className="text-right text-white px-6 py-4 font-medium">الدورة</th>
                <th className="text-right text-white px-6 py-4 font-medium">المبلغ</th>
                <th className="text-right text-white px-6 py-4 font-medium">طريقة الدفع</th>
                <th className="text-right text-white px-6 py-4 font-medium">الحالة</th>
                <th className="text-right text-white px-6 py-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{p.user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.user.email}</td>
                  <td className="px-6 py-4">{p.course.title}</td>
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
    </div>
  );
}
