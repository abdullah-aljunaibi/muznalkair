import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة المدفوعات",
};

export default function AdminPaymentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
