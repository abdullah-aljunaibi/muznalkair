import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة الطالبات",
};

export default function AdminStudentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
