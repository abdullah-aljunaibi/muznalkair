import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "أنشئي حسابًا جديدًا في مقرأة مُزن الخير وابدئي رحلة تعلّم القرآن الكريم.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
