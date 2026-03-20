"use client";

import type { TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/seo";

/* ── Zoom link placeholder — replace with real link when available ── */
const ZOOM_LINK = "#"; // TODO: Replace with actual Zoom link

const heroSlides = [
  {
    image: "/premium/hero-1.jpg",
    eyebrow: "مقرأة مُزن الخير",
    title: "رحلتكِ القرآنية تبدأ من هنا",
    description:
      "أول مقرأة إلكترونية عُمانية نسائية لتعليم القرآن الكريم — حلقات تصحيح التلاوة، التجويد، الحفظ، والتدبر عن بُعد.",
  },
  {
    image: "/premium/hero-2.jpg",
    eyebrow: "المقرأة العامة",
    title: "حلقات يومية متعددة المستويات",
    description:
      "من تصحيح التلاوة إلى دروس التجويد والفقه والمنظومات — برامج متكاملة تناسب جميع المستويات.",
  },
  {
    image: "/premium/hero-3.jpg",
    eyebrow: "برنامج الأترجة",
    title: "مسارات حفظ منظمة بمتابعة مستمرة",
    description:
      "ثلاثة مسارات مرنة للحفظ: الإذخر، السنا، وقنوان — مع أكثر من ١٧٠٠ حافظة مسجلة.",
  },
  {
    image: "/premium/hero-4.jpg",
    eyebrow: "مقرأة الأمهات",
    title: "برامج مخصصة للأمهات",
    description:
      "القاعدة النورانية، تلقين الأجزاء، ودروس التدبر — مساحة تعليمية هادئة مصممة للأمهات.",
  },
];

interface ProgramScheduleItem {
  name: string;
  time: string;
  days: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  stats: string;
  schedule: ProgramScheduleItem[];
}

const programs: Program[] = [
  {
    id: "general",
    title: "المقرأة العامة",
    description: "حلقات تصحيح التلاوة، دروس تجويد متنوعة، أحكام الفقه، المنظومات، كتاب المنير، حلقات لغير الناطقات بالعربية، وحلقات الأطفال.",
    image: "/premium/hero-2.jpg",
    stats: "٧ برامج • ١٥,٠٠٠ طالبة",
    schedule: [
      { name: "حلقة تصحيح التلاوة", time: "٥:٠٠ - ٦:٣٠ صباحًا", days: "السبت — الخميس" },
      { name: "دروس التجويد", time: "٩:٠٠ - ١٠:٣٠ صباحًا", days: "الأحد — الثلاثاء" },
      { name: "أحكام الفقه والمنظومات", time: "٨:٠٠ - ٩:٣٠ مساءً", days: "الاثنين — الأربعاء" },
    ],
  },
  {
    id: "mothers",
    title: "مقرأة الأمهات",
    description: "تصحيح التلاوة، القاعدة النورانية، تلقين جزئي عم وتبارك، دروس التجويد والتدبر — برامج مصممة خصيصًا للأمهات.",
    image: "/premium/hero-3.jpg",
    stats: "٥ برامج • ١,١٠٠ طالبة",
    schedule: [
      { name: "تصحيح التلاوة", time: "٩:٠٠ - ١٠:٣٠ صباحًا", days: "السبت — الخميس" },
      { name: "القاعدة النورانية", time: "١٠:٣٠ - ١٢:٠٠ ظهرًا", days: "الأحد — الثلاثاء" },
      { name: "دروس التدبر", time: "٨:٣٠ - ١٠:٠٠ مساءً", days: "الأحد — الأربعاء" },
    ],
  },
  {
    id: "memorization",
    title: "مقرأة الحفظ",
    description: "برنامج الأترجة بثلاثة مسارات (الإذخر، السنا، قنوان)، البرامج الرمضانية، وبرنامج السرد القرآني رواء الآي.",
    image: "/premium/hero-5.jpg",
    stats: "٣ برامج • ١,٧٠٠ حافظة",
    schedule: [
      { name: "مسار الإذخر", time: "٥:٣٠ - ٧:٠٠ صباحًا", days: "السبت — الخميس" },
      { name: "مسار السنا", time: "٩:٠٠ - ١٠:٣٠ صباحًا", days: "السبت — الأربعاء" },
      { name: "مسار قنوان", time: "٨:٠٠ - ٩:٣٠ مساءً", days: "الأحد — الخميس" },
    ],
  },
];

const metrics = [
  { value: "١٥,٠٠٠+", label: "طالبة في المجتمع" },
  { value: "١,٧٠٠+", label: "حافظة في برنامج الأترجة" },
  { value: "١٠٣+", label: "معلمة" },
  { value: "١٤٠+", label: "مشرفة" },
];

function useHeroRotation(totalSlides: number) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % totalSlides);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  return [activeSlide, setActiveSlide] as const;
}

/* ── Schedule Modal ── */
function ScheduleModal({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`جدول ${program.title}`}
    >
      <div
        className="relative w-full max-w-lg animate-[modalIn_0.25s_ease-out] overflow-hidden rounded-[32px] border border-white/10 bg-[--color-surface] shadow-2xl"
        dir="rtl"
      >
        {/* Header with image */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src={program.image}
            alt={program.title}
            fill
            sizes="500px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,24,30,0.92)] to-[rgba(4,24,30,0.3)]" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="mb-2 inline-flex rounded-full bg-[#25D366]/20 px-3 py-1 text-xs font-bold text-[#25D366]">
              مجاني — تطوعي
            </div>
            <h3 className="font-amiri text-3xl font-bold text-white">{program.title}</h3>
            <p className="mt-1 text-sm text-white/60">{program.stats}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/80 transition hover:bg-black/60 hover:text-white"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Schedule list */}
        <div className="p-6">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[--color-gold]">
            مواعيد الحلقات
          </h4>
          <div className="space-y-3">
            {program.schedule.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-[rgba(10,40,48,0.06)] bg-[linear-gradient(180deg,rgba(250,244,238,0.7),rgba(255,255,255,0.95))] p-4"
              >
                <div className="font-amiri text-xl text-[--color-text-dark]">{item.name}</div>
                <div className="mt-2 flex items-center justify-between text-sm text-[--color-text-soft]">
                  <span>{item.days}</span>
                  <span dir="ltr" className="font-medium">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <a
              href={ZOOM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-cta premium-cta-primary flex w-full items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3l4 3V6l-4 3V5a2 2 0 00-2-2H4z" />
              </svg>
              انضمي عبر Zoom
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}?text=${encodeURIComponent(`السلام عليكم، أرغب في الاستفسار عن ${program.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-cta premium-cta-secondary flex w-full items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              استفسري عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useHeroRotation(heroSlides.length);
  const [scrollY, setScrollY] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const organizationSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/og-image.jpg`,
      sameAs: [
        siteConfig.instagram,
        `https://wa.me/${siteConfig.whatsapp.replace("+", "")}`,
      ],
      description: siteConfig.description,
    }),
    [],
  );

  const goToSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX === null) {
      return;
    }

    const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX;

    if (Math.abs(deltaX) > 48) {
      goToSlide(deltaX < 0 ? 1 : -1);
    }

    setTouchStartX(null);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedProgram(null);
  }, []);

  const parallaxOffset = Math.min(scrollY * 0.18, 120);

  return (
    <div className="premium-shell min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1 pb-24 md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* ── Hero ── */}
        <section
          id="hero"
          ref={heroRef}
          className="relative flex min-h-screen items-end overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.image}
                className={`hero-slide ${index === activeSlide ? "is-active" : ""}`}
                style={{ transform: `translateY(${parallaxOffset}px) scale(1.08)` }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="hero-overlay absolute inset-0" />
            <div className="hero-secondary-overlay absolute inset-x-0 bottom-0 h-2/5" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 pt-36 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pb-24">
            <div className="max-w-3xl text-white">
              <span className="premium-pill mb-6 inline-flex">{heroSlides[activeSlide].eyebrow}</span>
              <h1 className="font-amiri text-5xl font-bold leading-[1.1] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-8xl">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                {heroSlides[activeSlide].description}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#programs" className="premium-cta premium-cta-primary">
                  استكشفي البرامج
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta premium-cta-secondary"
                >
                  تواصلي عبر واتساب
                </a>
              </div>
            </div>

            <div className="self-end lg:justify-self-end">
              <div className="glass-panel max-w-md p-6 text-white/88 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-[--color-gold-soft]">تأسيس {siteConfig.founder}</p>
                <p className="mt-4 font-amiri text-3xl leading-relaxed text-white">
                  مقرأة إلكترونية تطوعية تخدم أكثر من ١٥ ألف امرأة في تعلم وحفظ القرآن الكريم.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-right">
                  {metrics.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/12 bg-white/6 p-4">
                      <div className="font-amiri text-3xl text-[--color-gold]">{item.value}</div>
                      <div className="mt-1 text-sm text-white/68">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-7 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="hidden items-center gap-3 md:flex">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                  className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <div className="mr-auto flex items-center gap-3">
              <button type="button" className="hero-arrow" onClick={() => goToSlide(-1)} aria-label="الشريحة السابقة">
                &#8594;
              </button>
              <button type="button" className="hero-arrow" onClick={() => goToSlide(1)} aria-label="الشريحة التالية">
                &#8592;
              </button>
            </div>
          </div>
        </section>

        {/* ── Stats Band ── */}
        <section id="stats" className="premium-band">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[28px] border border-white/10 bg-white/6 px-6 py-5 text-center text-white backdrop-blur-sm">
                <div className="font-amiri text-4xl text-[--color-gold]">{metric.value}</div>
                <div className="mt-2 text-sm text-white/72">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Programs ── */}
        <section id="programs" className="section-padding" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <span className="section-kicker">برامجنا المجانية</span>
              <h2 className="section-title">ثلاث مقارئ تطوعية تخدم جميع الاحتياجات</h2>
              <p className="mt-4 text-lg leading-8 text-[--color-text-soft]">
                جميع البرامج مجانية بالكامل — عمل تطوعي خالص لوجه الله. اختاري المسار الأنسب واطلعي على الجدول.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {programs.map((item) => (
                <article
                  key={item.id}
                  className="destination-card cursor-pointer"
                  onClick={() => setSelectedProgram(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProgram(item);
                    }
                  }}
                >
                  <div className="destination-card-media">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                    <div className="destination-card-overlay" />
                  </div>
                  <div className="destination-card-body">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="inline-flex rounded-full bg-[#25D366]/20 px-3 py-1 text-xs font-bold text-[#25D366]">
                        مجاني — تطوعي
                      </span>
                      <span className="text-sm tracking-[0.2em] text-[--color-gold]">{item.stats}</span>
                    </div>
                    <h3 className="mt-2 font-amiri text-3xl text-white">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/80">{item.description}</p>
                    <div className="mt-5">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[--color-gold-soft]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        اطلعي على الجدول وانضمي ←
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join / Contact ── */}
        <section id="join" className="section-padding" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div className="glass-tile relative min-h-[400px] overflow-hidden rounded-[36px] p-8 text-white">
              <Image src="/premium/hero-4.jpg" alt="رحلة قرآنية" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,24,30,0.3),rgba(4,24,30,0.85))]" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <span className="premium-pill mb-4">انضمي إلينا</span>
                <p className="font-amiri text-4xl leading-tight">
                  أكثر من ١٥ ألف طالبة اخترن مقرأة مُزن الخير. ابدئي رحلتكِ اليوم.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={ZOOM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-cta premium-cta-primary inline-flex items-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3l4 3V6l-4 3V5a2 2 0 00-2-2H4z" />
                    </svg>
                    انضمي عبر Zoom
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-cta premium-cta-secondary inline-flex items-center gap-2"
                  >
                    تواصلي عبر واتساب
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="glass-tile rounded-[32px] p-7">
                <div className="text-sm tracking-[0.28em] text-[--color-gold]">واتساب</div>
                <p className="mt-4 font-amiri text-3xl text-[--color-text-dark]">تواصلي معنا مباشرة</p>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-base font-medium text-[--color-gold] hover:underline"
                >
                  {siteConfig.whatsappDisplay} ←
                </a>
              </div>
              <div className="glass-tile rounded-[32px] p-7">
                <div className="text-sm tracking-[0.28em] text-[--color-gold]">انستقرام</div>
                <p className="mt-4 font-amiri text-3xl text-[--color-text-dark]">تابعينا للمستجدات</p>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-base font-medium text-[--color-gold] hover:underline"
                >
                  {siteConfig.instagramHandle} ←
                </a>
              </div>
              <div className="glass-tile rounded-[32px] p-7 sm:col-span-2">
                <div className="text-sm tracking-[0.28em] text-[--color-gold]">عن المقرأة</div>
                <p className="mt-4 font-amiri text-2xl leading-relaxed text-[--color-text-dark]">
                  مقرأة مُزن الخير — مقرأة إلكترونية تطوعية أسستها {siteConfig.founder} لتعليم القرآن الكريم للنساء عن بُعد. تضم أكثر من ١٠٣ معلمة و١٤٠ مشرفة.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* ── Schedule Modal ── */}
      {selectedProgram ? (
        <ScheduleModal program={selectedProgram} onClose={handleCloseModal} />
      ) : null}
    </div>
  );
}
