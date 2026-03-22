import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "مشترياتي",
};

const paymentMethodLabels = {
  THAWANI: "THAWANI",
  WHATSAPP_BANK_TRANSFER: "WHATSAPP_BANK_TRANSFER",
  STRIPE: "STRIPE",
} as const;

const statusStyles = {
  COMPLETED: {
    label: "مكتمل",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  },
  PENDING: {
    label: "قيد الانتظار",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  },
  FAILED: {
    label: "فشل",
    className: "bg-red-50 text-red-700 ring-1 ring-red-100",
  },
  REFUNDED: {
    label: "مسترد",
    className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  },
} as const;

function formatPrice(amount: number, currency: string) {
  if (amount === 0) return "مجاني";

  return new Intl.NumberFormat("ar-OM", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat("ar-OM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function PurchasesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
          currency: true,
        },
      },
      coupon: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl" dir="rtl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}>
          مشترياتي
        </h1>
        <p className="text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
          جميع طلبات الشراء والمدفوعات المرتبطة بحسابك.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
          <p className="mb-2 text-lg font-medium" style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}>
            لا توجد مشتريات بعد
          </p>
          <p className="mb-6 text-sm" style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}>
            يمكنك تصفح الدورات المتاحة والبدء بالشراء من صفحة الدورات.
          </p>
          <Link
            href="/courses"
            className="inline-flex min-h-11 items-center rounded-xl px-6 py-2 text-sm font-medium text-white"
            style={{ background: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
          >
            استعرضي الدورات
          </Link>
        </div>
      ) : (
        <>
          <div
            className="hidden overflow-hidden rounded-2xl bg-white md:block"
            style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
          >
            <table className="min-w-full divide-y divide-[#EEE3D8] text-right">
              <thead className="bg-[#F8F5F1]">
                <tr className="text-sm text-[#7A6555]" style={{ fontFamily: "var(--font-tajawal)" }}>
                  <th className="px-5 py-4 font-medium">الدورة</th>
                  <th className="px-5 py-4 font-medium">المبلغ</th>
                  <th className="px-5 py-4 font-medium">الخصم</th>
                  <th className="px-5 py-4 font-medium">طريقة الدفع</th>
                  <th className="px-5 py-4 font-medium">الحالة</th>
                  <th className="px-5 py-4 font-medium">التاريخ</th>
                  <th className="px-5 py-4 font-medium">الكوبون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E7DB]">
                {purchases.map((purchase) => {
                  const status = statusStyles[purchase.status];

                  return (
                    <tr key={purchase.id} className="text-sm text-[#2C2C2C]" style={{ fontFamily: "var(--font-tajawal)" }}>
                      <td className="px-5 py-4 font-medium text-[#1B1F2E]">{purchase.course.title}</td>
                      <td className="px-5 py-4">{formatPrice(purchase.amount, purchase.course.currency)}</td>
                      <td className="px-5 py-4">
                        {purchase.discountAmount > 0 ? formatPrice(purchase.discountAmount, purchase.course.currency) : "—"}
                      </td>
                      <td className="px-5 py-4">{paymentMethodLabels[purchase.paymentMethod] ?? purchase.paymentMethod}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">{formatArabicDate(purchase.createdAt)}</td>
                      <td className="px-5 py-4">{purchase.coupon?.code || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {purchases.map((purchase) => {
              const status = statusStyles[purchase.status];

              return (
                <div
                  key={purchase.id}
                  className="rounded-2xl bg-white p-5"
                  style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-[#1B1F2E]" style={{ fontFamily: "var(--font-amiri)" }}>
                        {purchase.course.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#8A7A6B]" style={{ fontFamily: "var(--font-tajawal)" }}>
                        {formatArabicDate(purchase.createdAt)}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: "var(--font-tajawal)" }}>
                    <div className="rounded-xl bg-[#F8F5F1] p-3">
                      <div className="text-[#7A6555]">المبلغ</div>
                      <div className="mt-1 font-medium text-[#1B1F2E]">{formatPrice(purchase.amount, purchase.course.currency)}</div>
                    </div>
                    <div className="rounded-xl bg-[#F8F5F1] p-3">
                      <div className="text-[#7A6555]">الخصم</div>
                      <div className="mt-1 font-medium text-[#1B1F2E]">
                        {purchase.discountAmount > 0 ? formatPrice(purchase.discountAmount, purchase.course.currency) : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F8F5F1] p-3">
                      <div className="text-[#7A6555]">طريقة الدفع</div>
                      <div className="mt-1 font-medium text-[#1B1F2E]">
                        {paymentMethodLabels[purchase.paymentMethod] ?? purchase.paymentMethod}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F8F5F1] p-3">
                      <div className="text-[#7A6555]">الكوبون</div>
                      <div className="mt-1 font-medium text-[#1B1F2E]">{purchase.coupon?.code || "—"}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
