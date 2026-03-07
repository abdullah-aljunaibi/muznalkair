import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مقرأة مُزن الخير — أول مقرأة عُمانية نسائية تطوعية",
  description:
    "مقرأة مُزن الخير أول مقرأة عُمانية نسائية تطوعية، تُقدّم حلقات تصحيح تلاوة وتحفيظ القرآن الكريم عن بُعد",
  keywords: ["مقرأة", "قرآن كريم", "عمان", "تجويد", "حفظ", "تعليم إسلامي"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${tajawal.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
      >
        <Providers>
          {children}
          <Toaster
            position="top-center"
            dir="rtl"
            richColors
            toastOptions={{
              style: { fontFamily: "var(--font-tajawal)" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
