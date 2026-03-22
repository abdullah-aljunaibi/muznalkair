import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "المساعدة",
  description: "الأسئلة الشائعة حول التسجيل والبرامج والشهادات ووسائل التواصل في مقرأة مُزن الخير.",
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    title: `المساعدة | ${siteConfig.name}`,
    description: "الأسئلة الشائعة في مقرأة مُزن الخير.",
    url: "/help",
    type: "website",
  },
  twitter: {
    title: `المساعدة | ${siteConfig.name}`,
    description: "الأسئلة الشائعة في مقرأة مُزن الخير.",
  },
};

const faqs = [
  {
    question: "كيف أسجّل في المقرأة؟",
    answer: "أنشئي حسابًا من صفحة التسجيل، ثم فعّلي بريدكِ الإلكتروني.",
  },
  {
    question: "هل البرامج مجانية؟",
    answer:
      "نعم، جميع حلقات المقرأة العامة ومقرأة الأمهات مجانية وتطوعية. توجد أيضًا دورات مدفوعة اختيارية.",
  },
  {
    question: "كيف أنضم إلى الحلقات؟",
    answer: "بعد التسجيل، اختاري البرنامج المناسب من صفحة البرامج وانضمي عبر رابط Zoom المتاح.",
  },
  {
    question: "متى تفتح تسجيل مقرأة التحفيظ (الأترجة)؟",
    answer: "يفتح التسجيل نهاية شهر أغسطس من كل عام.",
  },
  {
    question: "كيف أحصل على شهادة؟",
    answer: 'أكملي جميع دروس الدورة وسيتم إصدار الشهادة تلقائيًا من صفحة "شهاداتي".',
  },
  {
    question: "نسيت كلمة المرور",
    answer: 'اضغطي على "نسيت كلمة المرور" في صفحة تسجيل الدخول وسنرسل رابط إعادة التعيين إلى بريدكِ.',
  },
  {
    question: "كيف أتواصل مع الإدارة؟",
    answer: "عبر واتساب +968 9702 1040 أو حساب إنستغرام @mozn_alkair",
  },
];

export default function HelpPage() {
  return (
    <div className="premium-shell min-h-screen">
      <Navbar />
      <main className="pt-28" dir="rtl">
        <section className="section-padding">
          <div className="mx-auto max-w-5xl">
            <div className="glass-panel rounded-[36px] p-8 sm:p-10 lg:p-14">
              <div className="max-w-3xl">
                <p className="section-kicker">الدعم والمساعدة</p>
                <h1 className="section-title">الأسئلة الشائعة</h1>
                <p className="mt-5 text-base leading-8 text-[var(--color-text-soft)] sm:text-lg">
                  إجابات سريعة وواضحة حول التسجيل، البرامج، الشهادات، وطرق التواصل مع إدارة مقرأة مُزن الخير.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto max-w-5xl space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="glass-panel group rounded-[28px] border border-[rgba(27,107,122,0.12)] p-6 open:border-[var(--color-primary)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-right font-amiri text-2xl text-[var(--color-text-dark)] marker:content-none">
                  <span>{item.question}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(27,107,122,0.1)] text-[var(--color-primary)] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-5 border-t border-[rgba(10,40,48,0.08)] pt-5 text-base leading-8 text-[var(--color-text-soft)]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="section-padding pt-0">
          <div className="mx-auto max-w-5xl">
            <div className="glass-panel rounded-[32px] p-8 text-center sm:p-10">
              <p className="section-kicker">ما زال لديكِ سؤال؟</p>
              <h2 className="font-amiri text-4xl text-[var(--color-text-dark)]">تواصلي معنا مباشرة</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-soft)]">
                يمكنكِ الوصول إلى الإدارة عبر الواتساب أو إنستغرام وسنرد عليكِ في أقرب وقت.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta premium-cta-primary justify-center"
                  dir="ltr"
                >
                  +968 9702 1040
                </a>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta premium-cta-secondary justify-center"
                >
                  @mozn_alkair
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
