import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "عن المقرأة",
  description: "تعرّفي على مقرأة مُزن الخير، رسالتها، أقسامها، ومسيرتها في تعليم القرآن الكريم عبر منصة رقمية متكاملة.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `عن المقرأة | ${siteConfig.name}`,
    description: "نبذة عن مقرأة مُزن الخير ومسيرتها في تعليم القرآن الكريم.",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: `عن المقرأة | ${siteConfig.name}`,
    description: "نبذة عن مقرأة مُزن الخير ومسيرتها في تعليم القرآن الكريم.",
  },
};

const stats = [
  { value: "15,000+", label: "عضو" },
  { value: "103+", label: "معلمة" },
  { value: "140+", label: "مشرفة" },
  { value: "15", label: "برنامج" },
];

const divisions = [
  {
    title: "المقرأة العامة",
    subtitle: "7 برامج",
    description:
      "مساحة يومية مفتوحة لتعليم التلاوة والتجويد والتدبر، تستقبل مختلف المستويات ضمن بيئة تعليمية رقمية متدرجة.",
  },
  {
    title: "مقرأة الأمهات",
    subtitle: "5 برامج",
    description:
      "برامج مرنة ومناسبة للأمهات، تجمع بين تصحيح التلاوة والقاعدة النورانية والدروس المساندة في أوقات تراعي مسؤولياتهن.",
  },
  {
    title: "الأترجة / التحفيظ",
    subtitle: "3 برامج",
    description:
      "مسارات حفظ مركزة بإشراف أكاديمي ومتابعة مستمرة، تهدف إلى بناء حفظ متقن ومنهجي لطالبات التحفيظ.",
  },
];

export default function AboutPage() {
  return (
    <div className="premium-shell min-h-screen">
      <Navbar />
      <main className="pt-28" dir="rtl">
        <section className="section-padding">
          <div className="mx-auto max-w-7xl">
            <div className="glass-panel overflow-hidden rounded-[36px] p-8 sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="max-w-3xl">
                  <p className="section-kicker">عن المقرأة</p>
                  <h1 className="section-title">مقرأة مُزن الخير لتعليم القرآن الكريم</h1>
                  <p className="mt-5 text-lg leading-9 text-[var(--color-text-soft)]">
                    تعليم القرآن الكريم تلاوةً وتجويدًا وحفظًا وتدبرًا عبر منصة إلكترونية متكاملة.
                  </p>
                  <p className="mt-6 text-base leading-8 text-[var(--color-text-soft)]">
                    انطلقت المقرأة سنة 2021 كمجموعة واتساب تعليمية، ثم نمت لتصبح أكاديمية رقمية متكاملة تجمع آلاف المنتسبات
                    ومئات المعلمات والمشرفات ضمن منظومة قرآنية نسائية راسخة في عُمان.
                  </p>
                </div>

                <div className="rounded-[32px] border border-white/20 bg-[linear-gradient(135deg,rgba(27,107,122,0.96),rgba(10,40,48,0.98))] p-8 text-white shadow-[0_30px_80px_rgba(10,40,48,0.24)]">
                  <p className="text-sm tracking-[0.28em] text-[var(--color-gold)]">تزكية ودعم</p>
                  <p className="mt-4 font-amiri text-3xl leading-tight">بتأييد سماحة الشيخ أحمد بن حمد الخليلي</p>
                  <p className="mt-3 text-sm leading-7 text-white/74">المفتي العام لسلطنة عُمان</p>
                  <div className="mt-8 h-px bg-white/10" />
                  <p className="mt-8 text-sm leading-8 text-white/78">
                    3 أقسام رئيسية، 15 برنامجًا، ومجتمع قرآني متنامٍ يواصل خدمة تعليم كتاب الله عن بُعد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel rounded-[32px] p-8 sm:p-10">
                <p className="section-kicker">قصتنا</p>
                <h2 className="section-title text-4xl sm:text-5xl">من مجموعة صغيرة إلى أكاديمية رقمية</h2>
                <div className="mt-6 space-y-4 text-base leading-8 text-[var(--color-text-soft)]">
                  <p>
                    بدأت مقرأة مُزن الخير بمبادرة تطوعية أسستها الأستاذة آمنة بنت سلطان الجنيبية لتيسير تعلم القرآن الكريم
                    للنساء عبر وسائل رقمية بسيطة وسهلة الوصول.
                  </p>
                  <p>
                    ومع اتساع الحاجة والإقبال، تطورت المبادرة إلى منصة إلكترونية أكثر تنظيمًا تضم برامج متعددة، وإشرافًا
                    أكاديميًا، وتقسيمات واضحة تلبي احتياجات شرائح مختلفة من الطالبات.
                  </p>
                  <p>
                    اليوم تواصل المقرأة رسالتها في بناء رحلة قرآنية متكاملة تجمع بين الإتقان، والمرونة، وروح المجتمع
                    الإيماني الداعم.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-[32px] p-8 sm:p-10">
                <p className="section-kicker">الرؤية</p>
                <h2 className="font-amiri text-3xl text-[var(--color-text-dark)] sm:text-4xl">رسالة قرآنية رقمية للمرأة</h2>
                <p className="mt-6 text-base leading-8 text-[var(--color-text-soft)]">
                  تسعى المقرأة إلى تقديم تعليم قرآني متقن وميسر، يجمع بين التلاوة والتجويد والحفظ والتدبر ضمن بيئة إلكترونية
                  آمنة واحترافية ومناسبة للنساء في عُمان وخارجها.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-[28px] p-8 text-center">
                <div className="font-amiri text-5xl text-[var(--color-primary)]">{stat.value}</div>
                <div className="mt-3 text-sm tracking-[0.18em] text-[var(--color-text-soft)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="section-kicker">الأقسام الثلاثة</p>
              <h2 className="section-title">برامج مصممة لاحتياجات متنوعة</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {divisions.map((division) => (
                <article key={division.title} className="glass-panel rounded-[30px] p-8">
                  <p className="text-sm tracking-[0.24em] text-[var(--color-gold)]">{division.subtitle}</p>
                  <h3 className="mt-4 font-amiri text-3xl text-[var(--color-text-dark)]">{division.title}</h3>
                  <p className="mt-5 text-base leading-8 text-[var(--color-text-soft)]">{division.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[32px] p-8 sm:p-10">
              <p className="section-kicker">المؤسسة</p>
              <h2 className="font-amiri text-4xl text-[var(--color-text-dark)]">الأستاذة آمنة بنت سلطان الجنيبية</h2>
              <p className="mt-4 text-base leading-8 text-[var(--color-text-soft)]">
                مؤسسة مقرأة مُزن الخير وصاحبة المبادرة التي قادت تحولها من مجموعة تعليمية على واتساب إلى أكاديمية رقمية
                قرآنية متكاملة.
              </p>
            </div>

            <div className="glass-panel rounded-[32px] p-8 sm:p-10">
              <p className="section-kicker">تواصلي معنا</p>
              <h2 className="font-amiri text-4xl text-[var(--color-text-dark)]">نرحب باستفساراتكِ</h2>
              <div className="mt-6 flex flex-col gap-4">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta premium-cta-primary justify-center text-center"
                  dir="ltr"
                >
                  واتساب: +968 9702 1040
                </a>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta premium-cta-secondary justify-center text-center"
                >
                  انستغرام: @mozn_alkair
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
