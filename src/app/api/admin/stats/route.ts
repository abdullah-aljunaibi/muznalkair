import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPendingUploadsCount, formatRelativeTime } from "@/lib/admin/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalStudents,
    activeCourses,
    revenueResult,
    pendingWhatsapp,
    totalOrders,
    activeCouponCount,
    recentOrders,
    recentStudents,
    recentCoupons,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.purchase.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.purchase.count({
      where: { status: "PENDING", paymentMethod: "WHATSAPP_BANK_TRANSFER" },
    }),
    prisma.purchase.count(),
    prisma.coupon.count({ where: { status: { in: ["ACTIVE", "SCHEDULED"] } } }),
    prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
        coupon: { select: { code: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, code: true, createdAt: true },
    }),
  ]);

  const recentActivity = [
    ...recentOrders.slice(0, 3).map((order) => ({
      id: `order-${order.id}`,
      title: order.status === "COMPLETED" ? "تم تسجيل دفعة مكتملة" : "تم إنشاء طلب جديد",
      description: `${order.user.name} — ${order.course.title}${order.coupon?.code ? ` • كوبون ${order.coupon.code}` : ""}`,
      time: formatRelativeTime(order.createdAt),
      ts: new Date(order.createdAt).getTime(),
      type: "payment",
    })),
    ...recentStudents.map((student) => ({
      id: `student-${student.id}`,
      title: "طالبة جديدة سجّلت",
      description: `انضمت ${student.name} إلى المنصة.`,
      time: formatRelativeTime(student.createdAt),
      ts: new Date(student.createdAt).getTime(),
      type: "student",
    })),
    ...recentCoupons.map((coupon) => ({
      id: `coupon-${coupon.id}`,
      title: "تم إنشاء كوبون جديد",
      description: `تمت إضافة الكوبون ${coupon.code}.`,
      time: formatRelativeTime(coupon.createdAt),
      ts: new Date(coupon.createdAt).getTime(),
      type: "coupon",
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      time: item.time,
      type: item.type,
    }));

  return NextResponse.json({
    totalStudents,
    activeCourses,
    totalRevenue: revenueResult._sum.amount || 0,
    pendingWhatsapp,
    totalOrders,
    recentOrders,
    recentActivity,
    couponCount: activeCouponCount,
    pendingUploads: getPendingUploadsCount(),
  });
}
