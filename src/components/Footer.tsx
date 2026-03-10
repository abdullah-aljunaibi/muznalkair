import Link from "next/link";
import MuznLogo from "./MuznLogo";

const footerLinks = {
  explore: [
    { href: "#hero", label: "الرئيسية" },
    { href: "#categories", label: "الفئات" },
    { href: "#destinations", label: "الوجهات" },
  ],
  journey: [
    { href: "/register", label: "إنشاء حساب" },
    { href: "/login", label: "تسجيل الدخول" },
    { href: "/checkout", label: "الاشتراك" },
  ],
};

export default function Footer() {
  return (
    <footer className="premium-footer" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <MuznLogo size={42} ariaLabel="شعار مقرأة مزن الخير" />
            <div>
              <div className="font-amiri text-2xl font-bold text-white">مقرأة مُزن الخير</div>
              <div className="text-xs tracking-[0.3em] text-white/48">PREMIUM TOURISM-STYLE UI</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-base leading-8 text-white/66">
            واجهة أكثر هدوءًا وفخامة، مستوحاة من مواقع الوجهات الراقية مع المحافظة على الهوية اللونية الأساسية للمشروع.
          </p>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">الاستكشاف</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.explore.map((item) => (
              <a key={item.label} href={item.href} className="premium-footer-link">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">الرحلة</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.journey.map((item) => (
              <Link key={item.label} href={item.href} className="premium-footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">النشرة البريدية</h3>
          <p className="mt-5 text-base leading-8 text-white/66">
            مساحة placeholder لنموذج اشتراك مستقبلي، منسقة لتنسجم مع التذييل متعدد الأعمدة.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="min-h-12 flex-1 rounded-full border border-white/12 bg-white/8 px-5 text-white placeholder:text-white/35 focus:outline-none"
            />
            <button type="button" className="premium-nav-button premium-nav-button-solid whitespace-nowrap">
              اشتركي
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/42 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© ٢٠٢٦ مقرأة مُزن الخير. جميع الحقوق محفوظة.</p>
          <p>واجهة مطورة ضمن تذكرة UI premium overhaul.</p>
        </div>
      </div>
    </footer>
  );
}
