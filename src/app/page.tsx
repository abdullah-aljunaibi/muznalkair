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
    eyebrow: "وجهات ملهمة",
    title: "اكتشفي رحلة قرآنية بهوية بصرية أكثر فخامة",
    description:
      "تجربة رقمية غامرة تجمع بين السكينة، التنظيم، وسهولة الانطلاق في مسارات التلاوة والحفظ.",
  },
  {
    image: "/premium/hero-2.jpg",
    eyebrow: "تجربة هادئة",
    title: "مساحات تعليمية تنبض بالضوء والتدرجات والرقي",
    description:
      "من الصفحة الأولى حتى التسجيل، كل تفصيل يعكس جودة أعلى وحركة سلسة مستوحاة من مواقع السياحة الفاخرة.",
  },
  {
    image: "/premium/hero-3.jpg",
    eyebrow: "حضور بصري",
    title: "محتوى واضح فوق صور كاملة الارتفاع وانتقالات ناعمة",
    description:
      "بطاقات متحركة، أقسام تكشف نفسها أثناء التمرير، وشريط فئات قابل للسحب على الجوال.",
  },
  {
    image: "/premium/hero-4.jpg",
    eyebrow: "تنقل ذكي",
    title: "شريط علوي شفاف يتحول تدريجيًا مع التمرير",
    description:
      "تنقل ثابت، شريط سفلي للجوال، وتجربة أكثر انسيابًا بين المقاطع والصفحات.",
  },
];

const categories = [
  "المقرأة العامة",
  "مقرأة الأمهات",
  "برنامج الأترجة",
  "حلقات الصباح",
  "الدورات المكثفة",
  "التهيئة للإجازة",
];

const destinations = [
  {
    title: "المقرأة العامة",
    description: "جلسات يومية متدرجة المستويات مع تركيز على جودة التلاوة وسلاسة الانضمام.",
    image: "/premium/hero-2.jpg",
    stats: "جلسات ممتدة من الفجر حتى المساء",
  },
  {
    title: "برنامج الأترجة",
    description: "مسارات حفظ منظمة بتجربة متابعة أوضح، بطاقات معلومات أهدأ، وتدرج بصري أرقى.",
    image: "/premium/hero-3.jpg",
    stats: "ثلاثة مسارات حفظ مرنة",
  },
  {
    title: "الدورات المتخصصة",
    description: "رحلة تعليمية تبدو أكثر premium مع صور واسعة، طبقات شفافة، وتفاصيل تبرز القيمة.",
    image: "/premium/hero-5.jpg",
    stats: "محتوى منظم ونقاط قرار أوضح",
  },
];

const experienceSteps = [
  {
    title: "اختاري المسار",
    text: "الشريط الأفقي للفئات يعطي بداية أسرع على الجوال مع نقاط snap دقيقة وسهلة.",
  },
  {
    title: "استكشفي التفاصيل",
    text: "البطاقات تستخدم رفعًا بصريًا خفيفًا وتكبيرًا للصورة لإبراز المحتوى دون مبالغة.",
  },
  {
    title: "ابدئي التسجيل",
    text: "الانتقالات الهادئة والهيكل الأوضح يوجهان الطالبة من الإلهام إلى الإجراء مباشرة.",
  },
];

const metrics = [
  { value: "٣ آلاف+", label: "طالبة" },
  { value: "٥", label: "ختمات مكتملة" },
  { value: "٢٠+", label: "معلمة متطوعة" },
  { value: "١٠٠٪", label: "روح تطوعية" },
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
        "https://instagram.com/mozn_alkair",
        "https://youtube.com/@mozn_alkair",
        "https://wa.me/96897021040",
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
                <a href="#destinations" className="premium-cta premium-cta-secondary">
                  استكشفي التجربة
                </a>
              </div>
            </div>

            <div className="self-end lg:justify-self-end">
              <div className="glass-panel max-w-md p-6 text-white/88 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-[--color-gold-soft]">Premium Journey</p>
                <p className="mt-4 font-amiri text-3xl leading-relaxed text-white">
                  تصميم أهدأ، صور أوسع، طبقات ذهبية ورملية، وتجربة أقرب إلى صفحات الوجهات الراقية.
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

        <section className="premium-band">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[28px] border border-white/10 bg-white/6 px-6 py-5 text-center text-white backdrop-blur-sm">
                <div className="font-amiri text-4xl text-[--color-gold]">{metric.value}</div>
                <div className="mt-2 text-sm text-white/72">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="categories" className="section-padding" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <span className="section-kicker">الفئات</span>
                <h2 className="section-title">شريط فئات مرن ومهيأ بالكامل للجوال</h2>
              </div>
              <p className="hidden max-w-xl text-base leading-7 text-[--color-text-soft] md:block">
                تم تحويل الفئات إلى شريط أفقي قابل للتمرير مع snap points، ليبدو كمسار استكشاف سريع بدل شبكة تقليدية مزدحمة.
              </p>
            </div>

            <div className="snap-strip">
              {categories.map((category, index) => (
                <button key={category} type="button" className="snap-chip">
                  <span className="font-amiri text-3xl text-[--color-gold]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base text-[--color-text-dark]">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="destinations" className="section-padding pt-0" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <span className="section-kicker">الوجهات</span>
              <h2 className="section-title">بطاقات أهدأ مع حركة تكبير للصورة ورفع بصري خفيف</h2>
              <p className="mt-4 text-lg leading-8 text-[--color-text-soft]">
                إعادة البناء تركز على premium feel: صور طويلة، زجاجيات مدروسة، وتفاعل hover محسوب يحافظ على الرصانة.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {destinations.map((item) => (
                <article key={item.title} className="destination-card">
                  <div className="destination-card-media">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                    <div className="destination-card-overlay" />
                  </div>
                  <div className="destination-card-body">
                    <span className="text-sm tracking-[0.3em] text-[--color-gold]">{item.stats}</span>
                    <h3 className="mt-4 font-amiri text-3xl text-white">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/80">{item.description}</p>
                    <a href="#experience" className="mt-6 inline-flex text-sm font-medium text-[--color-gold-soft]">
                      متابعة التفاصيل
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section-padding" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="rounded-[36px] border border-[rgba(10,40,48,0.08)] bg-white/70 p-8 shadow-[0_30px_80px_rgba(10,40,48,0.08)] backdrop-blur-xl">
              <span className="section-kicker">التجربة</span>
              <h2 className="section-title">حركة دخول متدرجة عبر IntersectionObserver فقط</h2>
              <p className="mt-4 text-lg leading-8 text-[--color-text-soft]">
                لا توجد مكتبات حركة ثقيلة هنا. كل قسم يكشف نفسه بصعود خفيف وشفافية محسوبة للحفاظ على الأداء.
              </p>
              <div className="mt-8 space-y-4">
                {experienceSteps.map((step, index) => (
                  <div key={step.title} className="rounded-[28px] bg-[linear-gradient(180deg,rgba(250,244,238,0.9),rgba(255,255,255,0.98))] p-5">
                    <div className="text-sm tracking-[0.28em] text-[--color-gold]">0{index + 1}</div>
                    <h3 className="mt-2 font-amiri text-2xl text-[--color-text-dark]">{step.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[--color-text-soft]">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="glass-tile relative min-h-[280px] overflow-hidden rounded-[36px] p-7 text-white sm:col-span-2">
                <Image src="/premium/hero-4.jpg" alt="مشهد بصري واسع" fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,24,30,0.3),rgba(4,24,30,0.82))]" />
                <div className="relative z-10 max-w-xl">
                  <span className="premium-pill">Hero Parallax</span>
                  <p className="mt-5 font-amiri text-4xl leading-tight">
                    صور كاملة الارتفاع مع طبقات gradient وتبديل crossfade سريع وناعم.
                  </p>
                </div>
              </div>
              <div className="glass-tile rounded-[32px] p-7">
                <div className="text-sm tracking-[0.28em] text-[--color-gold]">Sticky Nav</div>
                <p className="mt-4 font-amiri text-3xl text-[--color-text-dark]">ينتقل من شفاف إلى صلب عند التمرير</p>
              </div>
              <div className="glass-tile rounded-[32px] p-7">
                <div className="text-sm tracking-[0.28em] text-[--color-gold]">Route Motion</div>
                <p className="mt-4 font-amiri text-3xl text-[--color-text-dark]">انتقال صفحة خفيف قائم على CSS عند تغيير المسار</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
