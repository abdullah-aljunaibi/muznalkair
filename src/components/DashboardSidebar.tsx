"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import MuznLogo from "./MuznLogo";

interface User {
  name?: string | null;
  email?: string | null;
}

interface DashboardSidebarProps {
  user: User;
}

const navItems = [
  {
    href: "/dashboard",
    label: "الرئيسية",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/dashboard/courses",
    label: "دوراتي",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "ملفي الشخصي",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
          <MuznLogo size={36} ariaLabel="شعار مقرأة مزن الخير" />
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            مقرأة مُزن الخير
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#D4AF37", color: "#1B6B7A", fontFamily: "var(--font-amiri)" }}
          >
            {user.name?.charAt(0) || "م"}
          </div>
          <div className="overflow-hidden">
            <p
              className="text-white text-sm font-medium truncate"
              style={{ fontFamily: "var(--font-tajawal)" }}
            >
              {user.name}
            </p>
            <p
              className="text-white/60 text-xs truncate"
              style={{ fontFamily: "var(--font-tajawal)" }}
            >
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
              aria-label={`الانتقال إلى ${item.label}`}
              style={{
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-tajawal)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-right transition-all duration-200 hover:bg-white/10"
          aria-label="تسجيل الخروج"
          style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-tajawal)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0"
        style={{ background: "#1B6B7A" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile: hamburger button */}
      <button
        className="md:hidden fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ background: "#1B6B7A", color: "white" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? (
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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMobileOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <aside
            className="absolute right-0 top-0 w-64 min-h-full flex flex-col"
            style={{ background: "#1B6B7A" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
