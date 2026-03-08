"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { couponStatusLabels } from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/utils";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  status: keyof typeof couponStatusLabels;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  appliesTo: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then(setCoupons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="إدارة الكوبونات"
        description="إدارة أكواد الخصم الفعلية المرتبطة بقاعدة البيانات والدفع."
        action={<Link href="/admin/coupons/new" className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white hover:opacity-90">إضافة كوبون</Link>}
      />

      <AdminCard className="overflow-hidden p-0">
        {loading ? (
          <div className="p-6 text-sm text-[#7A6555]">جاري تحميل الكوبونات...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="mb-3 text-sm text-[#7A6555]">لا توجد كوبونات محفوظة بعد.</p>
            <Link href="/admin/coupons/new" className="inline-flex rounded-xl bg-[#0A2830] px-4 py-2 text-sm font-medium text-white">
              إنشاء أول كوبون
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0A2830] text-white">
                <tr>
                  <th className="px-5 py-4 text-right font-medium">الكود</th>
                  <th className="px-5 py-4 text-right font-medium">الوصف</th>
                  <th className="px-5 py-4 text-right font-medium">الخصم</th>
                  <th className="px-5 py-4 text-right font-medium">ينطبق على</th>
                  <th className="px-5 py-4 text-right font-medium">الاستخدام</th>
                  <th className="px-5 py-4 text-right font-medium">الانتهاء</th>
                  <th className="px-5 py-4 text-right font-medium">الحالة</th>
                  <th className="px-5 py-4 text-right font-medium">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-[#F1E7DC]">
                    <td className="px-5 py-4 font-semibold text-[#0A2830]">{coupon.code}</td>
                    <td className="px-5 py-4 text-[#7A6555]">{coupon.description || "—"}</td>
                    <td className="px-5 py-4">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `${coupon.discountValue} ر.ع`}</td>
                    <td className="px-5 py-4">{coupon.appliesTo}</td>
                    <td className="px-5 py-4">{coupon.usageCount}/{coupon.usageLimit || "∞"}</td>
                    <td className="px-5 py-4 text-[#7A6555]">{formatDate(coupon.expiresAt)}</td>
                    <td className="px-5 py-4"><StatusBadge label={couponStatusLabels[coupon.status]} tone={coupon.status === "ACTIVE" ? "success" : coupon.status === "SCHEDULED" ? "info" : "neutral"} /></td>
                    <td className="px-5 py-4"><Link href={`/admin/coupons/${coupon.id}`} className="rounded-xl border border-[#D4AF37]/40 px-3 py-2 text-xs font-medium text-[#9E7E2C] hover:bg-[#FFF8E6]">تعديل</Link></td>
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
