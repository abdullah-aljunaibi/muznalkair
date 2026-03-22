import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";

function formatPrice(price: number, currency: string) {
  if (price === 0) return "مجاني";

  return new Intl.NumberFormat("ar-OM", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatDuration(totalMinutes: number) {
  if (totalMinutes <= 0) return "المدة تُحدّد لاحقًا";
  if (totalMinutes < 60) return `${totalMinutes} دقيقة`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return hours === 1 ? "ساعة واحدة" : `${hours} ساعات`;
  }

  return `${hours} س ${minutes} د`;
}

function LessonStatusIcon({ isPreview }: { isPreview: boolean }) {
  if (isPreview) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
        <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 11-3.2-6.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--color-text-soft)]">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type SyllabusLesson = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
};

function LessonCard({ lesson, index }: { lesson: SyllabusLesson; index: number }) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_12px_32px_rgba(10,40,48,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-sand)] font-bold text-[var(--color-primary)]">
            {lesson.order || index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-amiri text-2xl leading-tight text-[var(--color-text-dark)]">{lesson.title}</h3>
              {lesson.isPreview ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  معاينة
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-soft)]">
              {lesson.duration > 0 ? `${lesson.duration} دقيقة` : "المدة تُحدّد لاحقًا"}
            </p>
            {lesson.description ? (
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">{lesson.description}</p>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <LessonStatusIcon isPreview={lesson.isPreview} />
        </div>
      </div>
    </div>
  );
}

function ModuleSection({
  title,
  lessons,
  defaultOpen = false,
}: {
  title: string;
  lessons: SyllabusLesson[];
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white/70"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <div>
          <h3 className="font-amiri text-2xl text-[var(--color-text-dark)]">{title}</h3>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">{lessons.length} {lessons.length === 1 ? "درس" : "دروس"}</p>
        </div>
        <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
          قابل للطي
        </span>
      </summary>

      <div className="space-y-4 border-t border-[var(--color-border)] px-4 py-4 sm:px-5">
        {lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} index={index} />
        ))}
      </div>
    </details>
  );
}

async function getCourse(courseId: string) {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          documents: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      modules: {
        orderBy: {
          order: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      title: true,
      description: true,
      thumbnail: true,
      isActive: true,
    },
  });

  if (!course || !course.isActive) {
    return {
      title: "الدورة غير موجودة",
      description: "تعذر العثور على الدورة المطلوبة.",
    };
  }

  const description = course.description.slice(0, 160);

  return {
    title: course.title,
    description,
    alternates: {
      canonical: `/courses/${courseId}`,
    },
    openGraph: {
      title: `${course.title} | ${siteConfig.name}`,
      description,
      url: `/courses/${courseId}`,
      type: "article",
      images: course.thumbnail ? [{ url: course.thumbnail, alt: course.title }] : undefined,
    },
    twitter: {
      title: `${course.title} | ${siteConfig.name}`,
      description,
      images: course.thumbnail ? [course.thumbnail] : undefined,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const course = await getCourse(courseId);

  if (!course || !course.isActive) {
    notFound();
  }

  const purchase = session?.user?.id
    ? await prisma.purchase.findFirst({
        where: {
          userId: session.user.id,
          courseId,
          status: "COMPLETED",
        },
        select: {
          id: true,
        },
      })
    : null;

  const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const totalDocuments = course.lessons.reduce((sum, lesson) => sum + lesson.documents.length, 0);
  const lessonCount = course.lessons.length || course.totalLessons;
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(`/courses/${course.id}`)}`;
  const lessonsWithoutModule = course.lessons.filter((lesson) => !lesson.moduleId);
  const hasModules = course.modules.length > 0;

  return (
    <div className="premium-shell">
      <Navbar />
      <main className="pt-28" dir="rtl">
        <section className="section-padding">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div className="overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(135deg,var(--color-primary-deep),var(--color-primary),#267f90)] shadow-[0_28px_80px_rgba(10,40,48,0.24)]">
                <div className="relative overflow-hidden p-8 sm:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_28%)]" />
                  <div className="absolute -left-12 top-8 h-36 w-36 rounded-full border border-white/10" />
                  <div className="absolute left-24 top-24 h-16 w-16 rounded-full border border-white/8" />

                  <div className="relative z-10">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${
                          course.price === 0
                            ? "bg-emerald-500 text-white"
                            : "bg-[var(--color-gold)] text-[var(--color-primary-deep)]"
                        }`}
                      >
                        {formatPrice(course.price, course.currency)}
                      </span>
                      <span className="rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-sm text-white/88">
                        {lessonCount} {lessonCount === 1 ? "درس" : "دروس"}
                      </span>
                      <span className="rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-sm text-white/88">
                        {formatDuration(totalDuration)}
                      </span>
                    </div>

                    <h1 className="font-amiri text-4xl leading-tight text-white sm:text-5xl">
                      {course.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-white/82 sm:text-lg">
                      {course.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                      {purchase ? (
                        <Link href={`/dashboard/courses/${course.id}`} className="premium-cta premium-cta-primary">
                          ابدئي التعلم
                        </Link>
                      ) : !session?.user?.id ? (
                        <Link href={loginUrl} className="premium-cta premium-cta-primary">
                          سجّلي الآن
                        </Link>
                      ) : course.price > 0 ? (
                        <Link href={`/checkout?courseId=${course.id}`} className="premium-cta premium-cta-primary">
                          سجّلي الآن
                        </Link>
                      ) : (
                        <form action="/api/enroll" method="post">
                          <input type="hidden" name="courseId" value={course.id} />
                          <button type="submit" className="premium-cta premium-cta-primary">
                            سجّلي الآن
                          </button>
                        </form>
                      )}

                      <Link href="/courses" className="premium-cta premium-cta-secondary">
                        عودة إلى الدورات
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="glass-panel rounded-[28px] p-6">
                <h2 className="font-amiri text-3xl text-[var(--color-text-dark)]">ملخص الدورة</h2>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
                    <div className="text-sm text-[var(--color-text-soft)]">عدد الدروس</div>
                    <div className="mt-1 font-amiri text-2xl text-[var(--color-primary)]">{lessonCount}</div>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
                    <div className="text-sm text-[var(--color-text-soft)]">المدة الإجمالية</div>
                    <div className="mt-1 font-amiri text-2xl text-[var(--color-primary)]">{formatDuration(totalDuration)}</div>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
                    <div className="text-sm text-[var(--color-text-soft)]">الملفات المرفقة</div>
                    <div className="mt-1 font-amiri text-2xl text-[var(--color-primary)]">{totalDocuments}</div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="glass-panel rounded-[28px] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="section-kicker">محتوى الدورة</p>
                  <h2 className="font-amiri text-4xl text-[var(--color-text-dark)]">الخطة التعليمية</h2>
                </div>

                <div className="space-y-4">
                  {hasModules ? (
                    <>
                      {course.modules
                        .filter((module) => module.lessons.length > 0)
                        .map((module, index) => (
                          <ModuleSection
                            key={module.id}
                            title={module.title}
                            lessons={module.lessons}
                            defaultOpen={index === 0}
                          />
                        ))}

                      {lessonsWithoutModule.length > 0 ? (
                        <ModuleSection
                          title="أخرى"
                          lessons={lessonsWithoutModule}
                          defaultOpen={course.modules.length === 0}
                        />
                      ) : null}
                    </>
                  ) : (
                    course.lessons.map((lesson, index) => (
                      <LessonCard key={lesson.id} lesson={lesson} index={index} />
                    ))
                  )}
                </div>
              </section>

              <div className="space-y-6">
                <section className="glass-panel rounded-[28px] p-6">
                  <p className="section-kicker">المتطلبات</p>
                  <h2 className="font-amiri text-3xl text-[var(--color-text-dark)]">ما الذي تحتاجينه؟</h2>
                  <p className="mt-4 text-sm leading-8 text-[var(--color-text-soft)]">
                    {course.description}
                  </p>
                </section>

                <section className="glass-panel rounded-[28px] p-6">
                  <p className="section-kicker">المرفقات</p>
                  <h2 className="font-amiri text-3xl text-[var(--color-text-dark)]">مواد مساندة</h2>
                  {totalDocuments > 0 ? (
                    <div className="mt-4 space-y-3">
                      {course.lessons
                        .filter((lesson) => lesson.documents.length > 0)
                        .map((lesson) => (
                          <div key={lesson.id} className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
                            <div className="font-medium text-[var(--color-text-dark)]">{lesson.title}</div>
                            <div className="mt-1 text-sm text-[var(--color-text-soft)]">
                              {lesson.documents.length} {lesson.documents.length === 1 ? "ملف" : "ملفات"} مرفقة
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-[var(--color-text-soft)]">
                      لا توجد مرفقات منشورة لهذه الدورة حاليًا.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
