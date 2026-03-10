import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import { fullOgImageUrl, siteConfig } from "@/lib/seo";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — أول مقرأة عُمانية نسائية تطوعية`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["مقرأة", "قرآن كريم", "عمان", "تجويد", "حفظ", "تعليم إسلامي"],
  applicationName: siteConfig.shortName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_OM",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — أول مقرأة عُمانية نسائية تطوعية`,
    description: siteConfig.description,
    images: [
      {
        url: fullOgImageUrl,
        width: 1200,
        height: 630,
        alt: "مقرأة مُزن الخير",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — أول مقرأة عُمانية نسائية تطوعية`,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [fullOgImageUrl],
  },
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
        <a href="#app-main" className="skip-link">
          الانتقال إلى المحتوى الرئيسي
        </a>
        <Providers>
          <div id="app-main">
            <PageTransition>{children}</PageTransition>
          </div>
          <Toaster
            position="top-center"
            dir="rtl"
            richColors
            toastOptions={{
              style: { fontFamily: "var(--font-tajawal)" },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
