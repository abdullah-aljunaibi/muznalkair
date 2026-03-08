import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّلي الدخول إلى حسابكِ في مقرأة مُزن الخير لمتابعة الدورات والحلقات.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
