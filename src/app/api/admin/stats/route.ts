import { getAnalyticsExtras } from "@/lib/admin/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalStudents, activeCourses, revenueResult, pendingWhatsapp, totalOrders, recentOrders] =
    await Promise.all([
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
      prisma.purchase.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
    ]);

  const extras = getAnalyticsExtras();

  return NextResponse.json({
    totalStudents,
    activeCourses,
    totalRevenue: revenueResult._sum.amount || 0,
    pendingWhatsapp,
    totalOrders,
    recentOrders,
    ...extras,
  });
}
