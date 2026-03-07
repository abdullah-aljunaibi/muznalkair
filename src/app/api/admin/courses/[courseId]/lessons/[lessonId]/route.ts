import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: "الدرس غير موجود" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  const body = await req.json();
  const { title, description, videoUrl, duration, order, isPreview } = body;

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: { title, description, videoUrl, duration, order, isPreview },
  });

  return NextResponse.json(lesson);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId, lessonId } = await params;

  await prisma.$transaction([
    prisma.lessonProgress.deleteMany({ where: { lessonId } }),
    prisma.document.deleteMany({ where: { lessonId } }),
    prisma.lesson.delete({ where: { id: lessonId } }),
  ]);

  const count = await prisma.lesson.count({ where: { courseId } });
  await prisma.course.update({
    where: { id: courseId },
    data: { totalLessons: count },
  });

  return NextResponse.json({ success: true });
}
