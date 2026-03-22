import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "الدورات",
  description: "استعرضي الدورات القرآنية المتاحة في مقرأة مُزن الخير، مع خيارات مجانية ومدفوعة تناسب مستواكِ.",
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: `الدورات | ${siteConfig.name}`,
    description: "فهرس الدورات العامة في مقرأة مُزن الخير.",
    url: "/courses",
    type: "website",
  },
  twitter: {
    title: `الدورات | ${siteConfig.name}`,
    description: "فهرس الدورات العامة في مقرأة مُزن الخير.",
  },
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function formatPrice(price: number, currency: string) {
  if (price === 0) return "مجاني";

  return new Intl.NumberFormat("ar-OM", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

const filterScript = `
(() => {
  const buttons = Array.from(document.querySelectorAll("[data-course-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-course-card]"));
  const emptyState = document.querySelector("[data-empty-state]");

  const applyFilter = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const type = card.getAttribute("data-course-type");
      const visible = filter === "all" || type === filter;
      card.toggleAttribute("hidden", !visible);
      if (visible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount > 0);
    }

    buttons.forEach((button) => {
      const active = button.getAttribute("data-course-filter") === filter;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("bg-[var(--color-primary)]", active);
      button.classList.toggle("text-white", active);
      button.classList.toggle("border-[var(--color-primary)]", active);
      button.classList.toggle("text-[var(--color-text-soft)]", !active);
      button.classList.toggle("bg-white/70", !active);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.getAttribute("data-course-filter") || "all");
    });
  });

  applyFilter("all");
})();
`;

export default async function CoursesCatalogPage() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      thumbnail: true,
      totalLessons: true,
      createdAt: true,
      lessons: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="premium-shell">
      <Navbar />
      <main className="pt-28" dir="rtl">
        <section className="section-padding">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker">رحلة قرآنية رقمية</p>
                <h1 className="section-title">الدورات</h1>
                <p className="mt-4 text-base leading-8 text-[var(--color-text-soft)] sm:text-lg">
                  اختاري الدورة المناسبة وابدئي التعلّم بخطوات واضحة، سواء كانت دورة مجانية أو مسارًا مدفوعًا بمتابعة متكاملة.
                </p>
              </div>

              <div className="glass-panel inline-flex flex-wrap gap-3 rounded-[24px] p-2">
                <button
                  type="button"
                  data-course-filter="all"
                  aria-pressed="true"
                  className="rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition"
                >
                  الكل
                </button>
                <button
                  type="button"
                  data-course-filter="free"
                  aria-pressed="false"
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-5 py-2.5 text-sm font-medium text-[var(--color-text-soft)] transition"
                >
                  مجاني
                </button>
                <button
                  type="button"
                  data-course-filter="paid"
                  aria-pressed="false"
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-5 py-2.5 text-sm font-medium text-[var(--color-text-soft)] transition"
                >
                  مدفوع
                </button>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="glass-panel rounded-[28px] p-10 text-center">
                <div className="mb-4 text-5xl">📚</div>
                <h2 className="font-amiri text-3xl text-[var(--color-text-dark)]">لا توجد دورات متاحة حاليًا</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
                  سيتم إضافة الدورات الجديدة قريبًا. تابعي المنصة للاطلاع على أحدث المسارات.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => {
                    const lessonCount = course.lessons.length || course.totalLessons;
                    const courseType = course.price === 0 ? "free" : "paid";

                    return (
                      <article
                        key={course.id}
                        data-course-card
                        data-course-type={courseType}
                        className="group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-[0_18px_50px_rgba(10,40,48,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(10,40,48,0.14)]"
                      >
                        <Link href={`/courses/${course.id}`} className="block h-full">
                          <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,var(--color-primary-deep),var(--color-primary),#3c97a8)]">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.28),transparent_38%)]" />
                                <div className="absolute inset-0 opacity-15">
                                  {[0, 72, 144, 216, 288].map((x) =>
                                    [0, 64, 128].map((y) => (
                                      <span
                                        key={`${course.id}-${x}-${y}`}
                                        className="absolute h-10 w-10 rotate-45 rounded-[10px] border border-white/25"
                                        style={{ left: `${x}px`, top: `${y}px` }}
                                      />
                                    ))
                                  )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-6xl text-white/90">
                                  <span aria-hidden="true">📖</span>
                                </div>
                              </>
                            )}

                            <div className="absolute right-4 top-4">
                              <span
                                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${
                                  course.price === 0
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[var(--color-gold)] text-[var(--color-primary-deep)]"
                                }`}
                              >
                                {formatPrice(course.price, course.currency)}
                              </span>
                            </div>
                          </div>

                          <div className="flex h-[calc(100%-14rem)] flex-col p-6">
                            <h2 className="font-amiri text-3xl leading-tight text-[var(--color-text-dark)]">
                              {course.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
                              {truncateText(course.description, 150)}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-soft)]">
                              <span className="rounded-full bg-[var(--color-sand)] px-3 py-1.5">
                                {lessonCount} {lessonCount === 1 ? "درس" : "دروس"}
                              </span>
                              <span className="rounded-full border border-[var(--color-border)] px-3 py-1.5">
                                {course.price === 0 ? "وصول فوري" : "دفع إلكتروني"}
                              </span>
                            </div>

                            <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                              عرض التفاصيل
                              <span aria-hidden="true">←</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                <div hidden data-empty-state className="glass-panel mt-8 rounded-[28px] p-8 text-center">
                  <h2 className="font-amiri text-2xl text-[var(--color-text-dark)]">لا توجد نتائج لهذا التصنيف</h2>
                  <p className="mt-3 text-sm text-[var(--color-text-soft)]">
                    اختاري تصنيفًا آخر لعرض المزيد من الدورات المتاحة.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <script dangerouslySetInnerHTML={{ __html: filterScript }} />
    </div>
  );
}
