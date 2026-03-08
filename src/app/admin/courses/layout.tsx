import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة الدورات",
};

export default function AdminCoursesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
