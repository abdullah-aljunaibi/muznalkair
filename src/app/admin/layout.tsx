import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  description: "إدارة مقرأة مُزن الخير: الدورات، الطالبات، الطلبات، المدفوعات، والتحليلات.",
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
