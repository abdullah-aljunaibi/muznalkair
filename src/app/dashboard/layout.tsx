import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "لوحة الطالبة",
  description: "لوحة الطالبة في مقرأة مُزن الخير لمتابعة الدورات، التقدم، والملف الشخصي.",
  alternates: { canonical: "/dashboard" },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div
      className="min-h-screen flex flex-row-reverse"
      style={{ background: "#F5F0E8" }}
      dir="rtl"
    >
      <DashboardSidebar user={session.user} />
      <main id="main-content" className="flex-1 overflow-auto p-4 pt-16 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
