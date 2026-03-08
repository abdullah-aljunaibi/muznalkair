import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { purchaseId } = await params;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
      coupon: { select: { id: true, code: true } },
    },
  });

  if (!purchase) {
    return NextResponse.json({ error: "الدفعة غير موجودة" }, { status: 404 });
  }

  if (purchase.status !== "PENDING") {
    return NextResponse.json({ error: "لا يمكن رفض هذه الدفعة" }, { status: 400 });
  }

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: "FAILED" },
  });

  await createAuditLog({
    actorId: session?.user?.id,
    actorName: session?.user?.name || session?.user?.email || "Admin",
    source: "admin",
    action: "payment.rejected",
    entityType: "purchase",
    entityId: purchaseId,
    details: {
      userId: purchase.user.id,
      userEmail: purchase.user.email,
      courseId: purchase.course.id,
      courseTitle: purchase.course.title,
      couponCode: purchase.coupon?.code || null,
      amount: purchase.amount,
      discountAmount: purchase.discountAmount,
      paymentMethod: purchase.paymentMethod,
    },
  });

  return NextResponse.json({ success: true });
}
