"use client";

import { useState } from "react";
import Link from "next/link";
import MuznLogo from "./MuznLogo";

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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-tajawal)",
                color: "#4A3828",
                border: "1px solid rgba(74,56,40,0.25)",
                borderRadius: "50px",
                padding: "8px 20px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#4A3828";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(74,56,40,0.25)";
              }}
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-tajawal)",
                background: "#0A2830",
                color: "white",
                borderRadius: "50px",
                padding: "10px 28px",
                boxShadow: "0 2px 12px rgba(10,40,48,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 20px rgba(212,175,55,0.3), 0 0 0 1px rgba(212,175,55,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(10,40,48,0.25)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              }}
            >
              انضمي الآن ←
            </Link>
          </div>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/#about", label: "من نحن" },
              { href: "/#programs", label: "البرامج" },
              { href: "/#courses", label: "الدورات" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-tajawal)",
                  color: "#4A3828",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#4A3828";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
            style={{ color: "#1A0A00" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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

          {/* Right side: Logo + Name */}
          <Link href="/" className="flex items-center gap-3">
            <MuznLogo size={40} />
            <span
              className="font-bold text-lg"
              style={{ fontFamily: "var(--font-amiri)", color: "#1A0A00" }}
            >
              مقرأة مُزن الخير
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-3"
          style={{
            background: "rgba(250, 244, 238, 0.97)",
            borderTop: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <a
            href="/#about"
            className="py-2 text-right text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828", textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            من نحن
          </a>
          <a
            href="/#programs"
            className="py-2 text-right text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828", textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            البرامج
          </a>
          <a
            href="/#courses"
            className="py-2 text-right text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#4A3828", textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            الدورات
          </a>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-center"
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
            className="px-4 py-2 text-sm font-medium text-center"
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
      )}
    </nav>
  );
}
