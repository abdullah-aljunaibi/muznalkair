import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payments = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
      coupon: { select: { id: true, code: true } },
    },
  });

  return NextResponse.json(
    payments.map((payment) => ({
      ...payment,
      originalAmount: payment.amount + payment.discountAmount,
    }))
  );
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const paymentId = body?.paymentId as string | undefined;
  const status = body?.status as "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | undefined;

  if (!paymentId || !status) {
    return NextResponse.json({ error: "paymentId و status مطلوبان" }, { status: 400 });
  }

  const payment = await prisma.purchase.update({
    where: { id: paymentId },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
      coupon: { select: { id: true, code: true } },
    },
  });

  return NextResponse.json({
    ...payment,
    originalAmount: payment.amount + payment.discountAmount,
  });
}
