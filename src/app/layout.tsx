import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import Script from "next/script";
import Header from "@/src/components/layouts/Header";
// import Footer from "@/src/components/layouts/Footer";
import RegisterServiceWorker from "@/src/app/register-service-worker";
import localFont from "next/font/local";
import GoogleAnalytics from "@/src/components/GoogleAnalytics";
import NaverAnalyticsTracker from "@/src/components/NaverAnalyticsTracker";
import "./globals.css";

import SendAuthToSW from "@/src/components/SendAuthToSW";
// import InstallPromptBanner from "@/src/components/InstallPromptBanner";
import ClientOnly from "@/src/components/ClientOnly";
import ForegroundNotification from "@/src/components/ForegroundNotification";
import LayoutClientWrapper from "@/src/components/LayoutClientWrapper";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "시피나우 - 쿠팡 최저가 알림 서비스(실시간 가격 알림)",
  description:
    "시피나우(CPNOW)는 실시간 쿠팡 가격 추이와 최저가 정보를 알려주는 스마트한 가격 알림 서비스입니다.",
  keywords: [
    "CPNOW",
    "시피나우",
    "쿠팡 가격 알림",
    "최저가 추적",
    "쿠팡 최저가",
    "coupang price tracker",
  ],
  authors: [{ name: "CPNOW", url: "https://cpnow.kr" }],
  openGraph: {
    title: "시피나우 - 쿠팡 최저가 알림 서비스(실시간 가격 알림)",
    description:
      "시피나우(CPNOW)는 실시간 쿠팡 가격 추이와 최저가 정보를 알려주는 스마트한 가격 알림 서비스입니다.",
    url: "https://cpnow.kr",
    siteName: "시피나우",
    images: [
      {
        url: "https://cpnow.kr/icons/android-icon-512x512.png",
        width: 1200,
        height: 630,
        alt: "시피나우(CPNOW) 최저가 알림",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "시피나우 - 쿠팡 최저가 알림 서비스(실시간 가격 알림)",
    description:
      "실시간 쿠팡 가격 추이와 최저가 정보를 알려주는 스마트한 가격 알림 서비스입니다.",
    site: "@cpnow_official",
    creator: "@cpnow_official",
    images: ["https://cpnow.kr/android-icon-512x512.png"],
  },
};

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <meta
          name="naver-site-verification"
          content="80d6139455845cdbf1c9f9457d7dceef48681fb3"
        />
        <meta
          name="google-site-verification"
          content="FrevTocD5esK1kGfI3LURLhqx1zfKAcM-v_-WvAI9Qw"
        />

        {/* Google Analytics 삽입 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script type="text/javascript" src="//wcs.naver.net/wcslog.js" />
        <Script id="naver-analytics" type="text/javascript">{`
             if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "4f989b4b54c848";
              if(window.wcs) {
              wcs_do();
            }
            `}</Script>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={pretendard.className}>
        <ClientOnly />
        <NaverAnalyticsTracker />
        <GoogleAnalytics />
        <ForegroundNotification />
        <main className="min-h-[80vh] w-full">
          <Header />
          {children}
          {modal}
          {/* <Footer /> */}
        </main>
        <LayoutClientWrapper />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "mb-12", // 하단에서 살짝 위
            style: {
              backgroundColor: "#e6ffed", // 연한 초록 배경
              color: "#065f46", // 진한 초록 텍스트
              border: "1px solid rgb(141, 229, 197)", // 테두리 색상
              fontWeight: "600",
            },
          }}
        />
        <RegisterServiceWorker />
        <SendAuthToSW />
        {/* <InstallPromptBanner /> */}
      </body>
    </html>
  );
}
