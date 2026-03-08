import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await params;

  const order = await prisma.purchase.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          purchases: {
            orderBy: { createdAt: "desc" },
            select: { id: true, status: true, amount: true, discountAmount: true, createdAt: true },
          },
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          totalLessons: true,
          isActive: true,
        },
      },
      coupon: {
        select: {
          id: true,
          code: true,
          description: true,
          discountType: true,
          discountValue: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    originalAmount: order.amount + order.discountAmount,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await params;
  const body = await req.json();
  const status = body?.status as "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | undefined;

  if (!status) {
    return NextResponse.json({ error: "حالة الدفع مطلوبة" }, { status: 400 });
  }

  const updated = await prisma.purchase.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json(updated);
}
