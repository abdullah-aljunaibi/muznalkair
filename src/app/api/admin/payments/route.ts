import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

const allowedStatuses = new Set(["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const);

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

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }

  const existing = await prisma.purchase.findUnique({
    where: { id: paymentId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
      coupon: { select: { id: true, code: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "سجل الدفع غير موجود" }, { status: 404 });
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

  if (existing.status !== status) {
    await createAuditLog({
      actorId: session?.user?.id,
      actorName: session?.user?.name || session?.user?.email || "Admin",
      source: "admin",
      action: "payment.status_changed",
      entityType: "purchase",
      entityId: paymentId,
      details: {
        from: existing.status,
        to: status,
        userId: payment.user.id,
        userEmail: payment.user.email,
        courseId: payment.course.id,
        courseTitle: payment.course.title,
        couponCode: payment.coupon?.code || null,
        amount: payment.amount,
        discountAmount: payment.discountAmount,
      },
    });
  }

  return NextResponse.json({
    ...payment,
    originalAmount: payment.amount + payment.discountAmount,
  });
}
