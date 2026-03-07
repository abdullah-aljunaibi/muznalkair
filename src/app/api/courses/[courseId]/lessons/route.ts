import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const userId = session.user.id;

  const purchase = await prisma.purchase.findFirst({
    where: { userId, courseId, status: "COMPLETED" },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Course not purchased" }, { status: 403 });
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    include: {
      documents: true,
      progress: {
        where: { userId },
      },
    },
  });

  return NextResponse.json({ lessons });
}
