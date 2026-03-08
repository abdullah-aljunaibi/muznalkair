import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  const orders = await prisma.purchase.findMany({
    where: {
      ...(status !== "ALL" ? { status: status as "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" } : {}),
      ...(search
        ? {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { course: { title: { contains: search, mode: "insensitive" } } },
              { coupon: { code: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
      coupon: { select: { id: true, code: true } },
    },
  });

  return NextResponse.json(
    orders.map((order) => ({
      id: order.id,
      amount: order.amount,
      originalAmount: order.amount + order.discountAmount,
      discountAmount: order.discountAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      stripeSessionId: order.stripeSessionId,
      createdAt: order.createdAt,
      student: order.user,
      course: order.course,
      coupon: order.coupon,
    }))
  );
}
