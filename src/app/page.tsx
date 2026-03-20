"use client";

import type { TouchEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/seo";

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

const programs = [
  {
    title: "المقرأة العامة",
    description: "حلقات تصحيح التلاوة، دروس تجويد متنوعة، أحكام الفقه، المنظومات، كتاب المنير، حلقات لغير الناطقات بالعربية، وحلقات الأطفال.",
    image: "/premium/hero-2.jpg",
    stats: "٧ برامج • ١٥,٠٠٠ طالبة",
    price: "٥ ر.ع / شهريًا",
  },
  {
    title: "مقرأة الأمهات",
    description: "تصحيح التلاوة، القاعدة النورانية، تلقين جزئي عم وتبارك، دروس التجويد والتدبر — برامج مصممة خصيصًا للأمهات.",
    image: "/premium/hero-3.jpg",
    stats: "٥ برامج • ١,١٠٠ طالبة",
    price: "٥ ر.ع / شهريًا",
  },
  {
    title: "مقرأة الحفظ",
    description: "برنامج الأترجة بثلاثة مسارات (الإذخر، السنا، قنوان)، البرامج الرمضانية، وبرنامج السرد القرآني رواء الآي.",
    image: "/premium/hero-5.jpg",
    stats: "٣ برامج • ١,٧٠٠ حافظة",
    price: "٨ ر.ع / شهريًا",
  },
];

const scheduleItems = [
  {
    title: "حلقات الفجر",
    text: "جلسات صباحية بعد صلاة الفجر مباشرة — بداية يوم مباركة مع كتاب الله.",
    time: "٥:٠٠ - ٦:٣٠ صباحًا",
  },
  {
    title: "حلقات الضحى",
    text: "فترة الضحى المخصصة للأمهات والمنتسبات الجدد مع معلمات متخصصات.",
    time: "٩:٠٠ - ١١:٠٠ صباحًا",
  },
  {
    title: "حلقات المساء",
    text: "جلسات مسائية مكثفة للحفظ والمراجعة مع متابعة أسبوعية دقيقة.",
    time: "٨:٠٠ - ١٠:٠٠ مساءً",
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

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useHeroRotation(heroSlides.length);
  const [scrollY, setScrollY] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
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
                <Link href="/register" className="premium-cta premium-cta-primary">
                  انضمي الآن
                </Link>
                <a href="#programs" className="premium-cta premium-cta-secondary">
                  استكشفي البرامج
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
              <span className="section-kicker">برامجنا</span>
              <h2 className="section-title">ثلاث مقارئ تخدم جميع الاحتياجات</h2>
              <p className="mt-4 text-lg leading-8 text-[--color-text-soft]">
                اختاري المسار الأنسب لكِ — من تصحيح التلاوة الأساسي إلى مسارات الحفظ المتقدمة.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {programs.map((item) => (
                <article key={item.title} className="destination-card">
                  <div className="destination-card-media">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                    <div className="destination-card-overlay" />
                  </div>
                  <div className="destination-card-body">
                    <span className="text-sm tracking-[0.3em] text-[--color-gold]">{item.stats}</span>
                    <h3 className="mt-4 font-amiri text-3xl text-white">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/80">{item.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-amiri text-2xl text-[--color-gold]">{item.price}</span>
                      <Link href="/register" className="text-sm font-medium text-[--color-gold-soft] hover:underline">
                        سجلي الآن ←
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Schedule ── */}
        <section id="join" className="section-padding" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="rounded-[36px] border border-[rgba(10,40,48,0.08)] bg-white/70 p-8 shadow-[0_30px_80px_rgba(10,40,48,0.08)] backdrop-blur-xl">
              <span className="section-kicker">أوقات الحلقات</span>
              <h2 className="section-title">جدول مرن يناسب يومكِ</h2>
              <p className="mt-4 text-lg leading-8 text-[--color-text-soft]">
                حلقات على مدار اليوم — اختاري الوقت المناسب لكِ وابدئي رحلتكِ مع كتاب الله.
              </p>
              <div className="mt-8 space-y-4">
                {scheduleItems.map((step, index) => (
                  <div key={step.title} className="rounded-[28px] bg-[linear-gradient(180deg,rgba(250,244,238,0.9),rgba(255,255,255,0.98))] p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm tracking-[0.28em] text-[--color-gold]">0{index + 1}</div>
                      <div className="text-sm font-medium text-[--color-text-soft]" dir="ltr">{step.time}</div>
                    </div>
                    <h3 className="mt-2 font-amiri text-2xl text-[--color-text-dark]">{step.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[--color-text-soft]">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="glass-tile relative min-h-[280px] overflow-hidden rounded-[36px] p-7 text-white sm:col-span-2">
                <Image src="/premium/hero-4.jpg" alt="رحلة قرآنية" fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,24,30,0.3),rgba(4,24,30,0.82))]" />
                <div className="relative z-10 max-w-xl">
                  <span className="premium-pill">انضمي إلينا</span>
                  <p className="mt-5 font-amiri text-4xl leading-tight">
                    أكثر من ١٥ ألف طالبة اخترن مقرأة مُزن الخير. ابدئي رحلتكِ اليوم.
                  </p>
                  <div className="mt-6">
                    <Link href="/register" className="premium-cta premium-cta-primary">
                      سجلي حسابكِ الآن
                    </Link>
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
