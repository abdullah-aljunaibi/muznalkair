import { auth } from "@/lib/auth";
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

  // Check purchase
  const purchase = await prisma.purchase.findFirst({
    where: { userId, courseId, status: "COMPLETED" },
  });

  if (!purchase) redirect("/checkout?courseId=" + courseId);

  // Load course with all lessons
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

  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) redirect(`/dashboard/courses/${courseId}`);

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  const completedCount = course.lessons.filter(
    (l) => l.progress[0]?.completed
  ).length;

  // Update lastAccessedAt
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

  // Serialize for client component
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

  const allLessons = course.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    duration: l.duration,
    order: l.order,
    isCompleted: l.progress[0]?.completed ?? false,
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
    />
  );
}
