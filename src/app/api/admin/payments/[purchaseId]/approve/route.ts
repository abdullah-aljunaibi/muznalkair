import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
  });

  if (!purchase) {
    return NextResponse.json({ error: "الدفعة غير موجودة" }, { status: 404 });
  }

  if (purchase.status !== "PENDING") {
    return NextResponse.json({ error: "لا يمكن الموافقة على هذه الدفعة" }, { status: 400 });
  }

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: "COMPLETED" },
  });

  // Upsert Progress record for the student
  await prisma.progress.upsert({
    where: {
      userId_courseId: {
        userId: purchase.userId,
        courseId: purchase.courseId,
      },
    },
    update: {
      lastAccessedAt: new Date(),
    },
    create: {
      userId: purchase.userId,
      courseId: purchase.courseId,
      completedLessons: 0,
      totalMinutesWatched: 0,
    },
  });

  return NextResponse.json({ success: true });
}
