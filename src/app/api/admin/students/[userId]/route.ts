import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      purchases: {
        orderBy: { createdAt: "desc" },
        include: { course: { select: { id: true, title: true, description: true } } },
      },
      progress: {
        include: { course: { select: { id: true, title: true, totalLessons: true } } },
      },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "الطالبة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json(student);
}
