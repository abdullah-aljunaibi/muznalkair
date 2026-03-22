"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MuznLogo from "./MuznLogo";

const navLinks = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#programs", label: "البرامج" },
  { href: "/courses", label: "الدورات" },
  { href: "#stats", label: "الإنجازات" },
  { href: "#join", label: "الانضمام" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`premium-navbar ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
              <MuznLogo size={42} ariaLabel="شعار مقرأة مزن الخير" />
              <div className="hidden sm:block">
                <div className="font-amiri text-2xl font-bold text-white">مقرأة مُزن الخير</div>
                <div className="text-xs tracking-[0.2em] text-white/60">لتعليم القرآن الكريم</div>
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="premium-nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="premium-nav-button premium-nav-button-muted">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="premium-nav-button premium-nav-button-solid">
              انضمي الآن
            </Link>
          </div>

          <button
            type="button"
            className="premium-mobile-toggle md:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="القائمة"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 bg-[rgba(4,24,30,0.92)] px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-right text-white/84 transition hover:bg-white/6"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/login" className="premium-nav-button premium-nav-button-muted text-center" onClick={() => setMenuOpen(false)}>
                تسجيل الدخول
              </Link>
              <Link href="/register" className="premium-nav-button premium-nav-button-solid text-center" onClick={() => setMenuOpen(false)}>
                انضمي الآن
              </Link>
            </div>
          </div>
        ) : null}
      </nav>

      <div className="premium-bottom-tabs md:hidden" style={{ gridTemplateColumns: `repeat(${navLinks.length}, minmax(0, 1fr))` }}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="premium-bottom-tab">
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
