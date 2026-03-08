"use client";

import { useState } from "react";
import Link from "next/link";
import MuznLogo from "./MuznLogo";

const navLinks = [
  { href: "/#about", label: "من نحن" },
  { href: "/#programs", label: "البرامج" },
  { href: "/#courses", label: "الدورات" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(250, 244, 238, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium transition-all duration-200"
              aria-label="الانتقال إلى صفحة تسجيل الدخول"
              style={{
                fontFamily: "var(--font-tajawal)",
                color: "#4A3828",
                border: "1px solid rgba(74,56,40,0.25)",
                borderRadius: "50px",
                padding: "8px 20px",
              }}
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium transition-all duration-200"
              aria-label="الانتقال إلى صفحة إنشاء حساب"
              style={{
                fontFamily: "var(--font-tajawal)",
                background: "#0A2830",
                color: "white",
                borderRadius: "50px",
                padding: "10px 28px",
                boxShadow: "0 2px 12px rgba(10,40,48,0.25)",
              }}
            >
              انضمي الآن ←
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                aria-label={`الانتقال إلى قسم ${link.label}`}
                style={{
                  fontFamily: "var(--font-tajawal)",
                  color: "#4A3828",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
            style={{ color: "#1A0A00" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
            <MuznLogo size={40} ariaLabel="شعار مقرأة مزن الخير" />
            <span className="hidden text-lg font-bold sm:block" style={{ fontFamily: "var(--font-amiri)", color: "#1A0A00" }}>
              مقرأة مُزن الخير
            </span>
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="flex flex-col gap-3 px-4 py-4 md:hidden"
          style={{
            background: "rgba(250, 244, 238, 0.97)",
            borderTop: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 py-2 text-right text-sm"
              aria-label={`الانتقال إلى قسم ${link.label}`}
              style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828", textDecoration: "none" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="min-h-11 px-4 py-2 text-center text-sm font-medium"
            aria-label="الانتقال إلى صفحة تسجيل الدخول"
            style={{
              fontFamily: "var(--font-tajawal)",
              border: "1px solid rgba(74,56,40,0.3)",
              borderRadius: "50px",
              color: "#4A3828",
            }}
            onClick={() => setMenuOpen(false)}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="min-h-11 px-4 py-2 text-center text-sm font-medium"
            aria-label="الانتقال إلى صفحة إنشاء حساب"
            style={{
              fontFamily: "var(--font-tajawal)",
              background: "#0A2830",
              color: "white",
              borderRadius: "50px",
            }}
            onClick={() => setMenuOpen(false)}
          >
            انضمي الآن ←
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
