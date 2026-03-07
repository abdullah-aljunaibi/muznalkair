"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: "📊" },
  { href: "/admin/courses", label: "الدورات", icon: "📚" },
  { href: "/admin/payments", label: "المدفوعات", icon: "💳" },
  { href: "/admin/students", label: "الطالبات", icon: "👩‍🎓" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Sidebar */}
      <aside
        className="w-64 text-white flex flex-col shrink-0"
        style={{ backgroundColor: "#030D10" }}
      >
        <div className="p-6 border-b border-white/10">
          <h1
            className="text-xl font-bold"
            style={{ color: "#D4AF37", fontFamily: "var(--font-amiri)" }}
          >
            مُزن الخير
          </h1>
          <p className="text-sm text-white/60 mt-1">لوحة الإدارة</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                style={isActive ? { backgroundColor: "#D4AF37" } : undefined}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="block text-white/60 hover:text-white text-sm mb-3 px-4"
          >
            العودة للموقع
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-right text-white/60 hover:text-white text-sm px-4 py-2 rounded hover:bg-white/5 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-auto"
        style={{ backgroundColor: "#FAF4EE" }}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
