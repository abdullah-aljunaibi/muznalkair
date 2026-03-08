import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الاشتراك",
  description: "اختاري برنامجكِ المناسب وأكملي الاشتراك في مقرأة مُزن الخير بأمان.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
