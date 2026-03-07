import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const { lessonId, completed, watchedSecs } = body;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  // Get lesson to find courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Upsert lesson progress
  const lessonProgress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      completed: completed ?? undefined,
      watchedSecs: watchedSecs ?? undefined,
      completedAt: completed ? new Date() : undefined,
    },
    create: {
      userId,
      lessonId,
      completed: completed ?? false,
      watchedSecs: watchedSecs ?? 0,
      completedAt: completed ? new Date() : null,
    },
  });

  // Recalculate course progress
  const courseId = lesson.courseId;
  const allLessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      progress: { where: { userId } },
    },
  });

  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(
    (l) => l.progress[0]?.completed
  ).length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate total minutes watched
  const allProgress = await prisma.lessonProgress.findMany({
    where: { userId, lesson: { courseId } },
    include: { lesson: true },
  });
  const totalMinutesWatched = Math.round(
    allProgress.reduce((acc, p) => acc + p.watchedSecs / 60, 0)
  );

  // Upsert course progress
  const courseProgress = await prisma.progress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {
      completedLessons,
      totalMinutesWatched,
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      courseId,
      completedLessons,
      totalMinutesWatched,
      lastAccessedAt: new Date(),
    },
  });

  return NextResponse.json({
    lessonProgress,
    courseProgress: {
      ...courseProgress,
      progressPercentage,
      totalLessons,
    },
  });
}
