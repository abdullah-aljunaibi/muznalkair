"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import MuznLogo from "@/components/MuznLogo";

const navItems = [
  { href: "/admin", label: "التحليلات", icon: "📊" },
  { href: "/admin/orders", label: "الطلبات", icon: "🧾" },
  { href: "/admin/students", label: "الطالبات", icon: "👩‍🎓" },
  { href: "/admin/payments", label: "المدفوعات", icon: "💳" },
  { href: "/admin/courses", label: "الدورات", icon: "📚" },
  { href: "/admin/coupons", label: "الكوبونات", icon: "🏷️" },
  { href: "/admin/uploads", label: "رفع المحتوى", icon: "⬆️" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="sticky top-0 flex h-full flex-col">
      <div className="border-b border-white/10 p-6">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          aria-label="الانتقال إلى لوحة الإدارة الرئيسية"
          onClick={() => setMobileOpen(false)}
        >
          <MuznLogo size={38} ariaLabel="شعار مقرأة مزن الخير" />
          <div>
            <div className="font-amiri text-lg font-bold text-white">مقرأة مُزن الخير</div>
            <div className="text-sm text-[#D4AF37]">لوحة الإدارة — V1</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-label={`الانتقال إلى ${item.label}`}
              className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm transition"
              style={{
                background: active ? "rgba(212,175,55,0.14)" : "transparent",
                color: active ? "#F7D672" : "rgba(255,255,255,0.78)",
                border: active ? "1px solid rgba(212,175,55,0.22)" : "1px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          href="/"
          className="block min-h-11 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label="العودة إلى الموقع العام"
          onClick={() => setMobileOpen(false)}
        >
          العودة للموقع العام
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="min-h-11 w-full rounded-xl px-4 py-3 text-right text-sm text-white/70 transition hover:bg-red-500/10 hover:text-white"
          aria-label="تسجيل الخروج من لوحة الإدارة"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F0E8] text-[#1A0A00]" dir="rtl">
      <button
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
        style={{ background: "#051820" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "إغلاق قائمة الإدارة" : "فتح قائمة الإدارة"}
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

      <div className="flex min-h-screen flex-col lg:flex-row-reverse">
        <aside className="hidden w-full border-b border-white/10 bg-[#051820] text-white lg:flex lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-l lg:border-white/10">
          <SidebarContent />
        </aside>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="absolute right-0 top-0 h-full w-72 border-l border-white/10 bg-[#051820] text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent />
            </aside>
          </div>
        ) : null}

        <main id="main-content" className="flex-1">
          <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8 md:pt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
