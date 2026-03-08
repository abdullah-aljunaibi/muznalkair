import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور",
  description: "استعيدي الوصول إلى حسابكِ عبر إرسال رابط إعادة تعيين كلمة المرور إلى بريدكِ الإلكتروني.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
