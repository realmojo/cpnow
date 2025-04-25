import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";

import Header from "@/src/components/layouts/Header";
import Footer from "@/src/components/layouts/Footer";
import RegisterServiceWorker from "@/src/app/register-service-worker";
import localFont from "next/font/local";

import "./globals.css";

import SendAuthToSW from "../components/SendAuthToSW";
// import ConsoleOverlay from "../components/ConsoleOverlay";
import { SidebarProvider } from "@/components/ui/sidebar";
import InstallPromptBanner from "../components/InstallPromptBanner";
import { AppSidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "CPNOW - 쿠팡 최저가 알림 서비스",
  description:
    "실시간 쿠팡 가격 추이와 최저가 정보를 알려주는 스마트한 가격 알림 서비스입니다.",
  keywords: [
    "CPNOW",
    "쿠팡 가격 알림",
    "최저가 추적",
    "쿠팡 최저가",
    "coupang price tracker",
  ],
  authors: [{ name: "CPNOW", url: "https://cpnow.kr" }],
  openGraph: {
    title: "CPNOW - 쿠팡 최저가 알림 서비스",
    description:
      "실시간 쿠팡 가격 추이와 최저가 정보를 알려주는 스마트한 가격 알림 서비스입니다.",
    url: "https://cpnow.kr",
    siteName: "CPNOW",
    images: [
      {
        url: "https://cpnow.kr/icons/android-icon-512x512.png",
        width: 1200,
        height: 630,
        alt: "CPNOW 최저가 알림",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPNOW - 쿠팡 최저가 알림",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={pretendard.className}>
        {/* <ClientDefaultSeo /> */}
        <SidebarProvider defaultOpen={defaultOpen}>
          {/* <Header /> */}
          {/* <DefaultSeo
            openGraph={{
              type: "website",
              locale: "en_IE",
              url: "https://www.url.ie/",
              siteName: "SiteName",
            }}
            twitter={{
              handle: "@handle",
              site: "@site",
              cardType: "summary_large_image",
            }}
          /> */}
          <AppSidebar />
          <main className="min-h-[80vh] w-full">
            <Header />
            {children}
            <Footer />
          </main>
          <Toaster />
          <RegisterServiceWorker />
          <SendAuthToSW />
          {/* <ConsoleOverlay /> */}
          <InstallPromptBanner />
        </SidebarProvider>
      </body>
    </html>
  );
}
