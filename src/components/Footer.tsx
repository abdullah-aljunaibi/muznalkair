import Link from "next/link";
import MuznLogo from "./MuznLogo";
import { siteConfig } from "@/lib/seo";

const footerLinks = {
  programs: [
    { href: "#programs", label: "المقرأة العامة" },
    { href: "#programs", label: "مقرأة الأمهات" },
    { href: "#programs", label: "مقرأة الحفظ" },
  ],
  account: [
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
              <div className="text-xs tracking-[0.2em] text-white/48">لتعليم القرآن الكريم</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-base leading-8 text-white/66">
            أول مقرأة إلكترونية عُمانية نسائية لتعليم القرآن الكريم. حلقات تصحيح التلاوة، التجويد، الحفظ، والتدبر عن بُعد.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition hover:text-[#25D366]"
              aria-label="واتساب"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition hover:text-[#E4405F]"
              aria-label="انستقرام"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">البرامج</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.programs.map((item, i) => (
              <a key={i} href={item.href} className="premium-footer-link">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">الحساب</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.account.map((item) => (
              <Link key={item.label} href={item.href} className="premium-footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-amiri text-2xl text-[--color-gold]">تواصلي معنا</h3>
          <div className="mt-5 space-y-4">
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-base text-white/66 transition hover:text-white"
              dir="ltr"
            >
              واتساب: {siteConfig.whatsappDisplay}
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-base text-white/66 transition hover:text-white"
            >
              انستقرام: {siteConfig.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/42 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© ٢٠٢٦ مقرأة مُزن الخير. جميع الحقوق محفوظة.</p>
          <p>تأسيس {siteConfig.founder}</p>
        </div>
      </div>
    </footer>
  );
}
