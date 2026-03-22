import { auth } from "@/lib/auth";
import { firstUnlockedLessonIndex, isLessonUnlocked } from "@/lib/lessons";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LessonPlayer from "./LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId, lessonId } = await params;
  const userId = session.user.id;

  const purchase = await prisma.purchase.findFirst({
    where: { userId, courseId, status: "COMPLETED" },
  });

  if (!purchase) redirect("/checkout?courseId=" + courseId);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          documents: true,
          progress: { where: { userId } },
        },
      },
    },
  });

  if (!course) redirect("/dashboard/courses");

  const completedFlags = course.lessons.map((l) => l.progress[0]?.completed ?? false);
  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const unlockedIndex = firstUnlockedLessonIndex(completedFlags);

  if (lessonIndex === -1) redirect(`/dashboard/courses/${courseId}`);
  if (!isLessonUnlocked(lessonIndex, completedFlags)) {
    redirect(`/dashboard/courses/${courseId}/lesson/${course.lessons[unlockedIndex].id}`);
  }

  const lesson = course.lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;
  const completedCount = course.lessons.filter((l) => l.progress[0]?.completed).length;

  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  await prisma.progress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { lastAccessedAt: new Date() },
    create: {
      userId,
      courseId,
      completedLessons: 0,
      lastAccessedAt: new Date(),
    },
  });

  const lessonData = {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    duration: lesson.duration,
    order: lesson.order,
    isCompleted: lesson.progress[0]?.completed ?? false,
    documents: lesson.documents.map((d) => ({
      id: d.id,
      title: d.title,
      fileUrl: d.fileUrl,
      fileType: d.fileType,
    })),
  };

  const allLessons = course.lessons.map((l, index) => ({
    id: l.id,
    title: l.title,
    duration: l.duration,
    order: l.order,
    isCompleted: l.progress[0]?.completed ?? false,
    unlocked: isLessonUnlocked(index, completedFlags),
  }));

  return (
    <LessonPlayer
      courseId={courseId}
      courseTitle={course.title}
      lesson={lessonData}
      allLessons={allLessons}
      completedCount={completedCount}
      totalCount={course.lessons.length}
      prevLessonId={prevLesson?.id ?? null}
      nextLessonId={nextLesson?.id ?? null}
      savedWatchedSecs={lessonProgress?.watchedSecs || 0}
    />
  );
}
