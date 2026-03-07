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

  // Check purchase
  const purchase = await prisma.purchase.findFirst({
    where: { userId, courseId, status: "COMPLETED" },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Course not purchased" }, { status: 403 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          documents: true,
          progress: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const progress = await prisma.progress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const totalLessons = course.lessons.length;
  const completedLessons = course.lessons.filter(
    (l) => l.progress[0]?.completed
  ).length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return NextResponse.json({
    course,
    progress: {
      ...progress,
      completedLessons,
      totalLessons,
      progressPercentage,
    },
  });
}
