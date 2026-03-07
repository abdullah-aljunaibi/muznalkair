import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  return NextResponse.json(lessons);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const body = await req.json();
  const { title, description, videoUrl, duration, order, isPreview } = body;

  if (!title) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      description,
      videoUrl,
      duration: duration || 0,
      order: order || 0,
      isPreview: isPreview || false,
    },
  });

  const count = await prisma.lesson.count({ where: { courseId } });
  await prisma.course.update({
    where: { id: courseId },
    data: { totalLessons: count },
  });

  return NextResponse.json(lesson, { status: 201 });
}
