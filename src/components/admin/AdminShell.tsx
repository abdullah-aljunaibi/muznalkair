"use client";

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

  return (
    <div className="min-h-screen bg-[#F7F0E8] text-[#1A0A00]" dir="rtl">
      <div className="flex min-h-screen flex-col lg:flex-row-reverse">
        <aside className="w-full border-b border-white/10 bg-[#051820] text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-l lg:border-white/10">
          <div className="sticky top-0 flex h-full flex-col">
            <div className="border-b border-white/10 p-6">
              <Link href="/admin" className="flex items-center gap-3">
                <MuznLogo size={38} />
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
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition"
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

            <div className="border-t border-white/10 p-4 space-y-2">
              <Link
                href="/"
                className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                العودة للموقع العام
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full rounded-xl px-4 py-3 text-right text-sm text-white/70 transition hover:bg-red-500/10 hover:text-white"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
