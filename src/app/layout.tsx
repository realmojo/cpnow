import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import Header from "@/src/components/layouts/Header";
import Footer from "@/src/components/layouts/Footer";
import RegisterServiceWorker from "@/src/app/register-service-worker";
import localFont from "next/font/local";

import "./globals.css";
import SendAuthToSW from "../components/SendAuthToSW";
// import ConsoleOverlay from "../components/ConsoleOverlay";
import InstallPromptBanner from "../components/InstallPromptBanner";

export const metadata: Metadata = {
  title: "시피나우",
  description: "최저가 확인",
};

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={pretendard.className}>
        <Header />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
        <Toaster />
        <RegisterServiceWorker />
        <SendAuthToSW />
        {/* <ConsoleOverlay /> */}
        <InstallPromptBanner />
      </body>
    </html>
  );
}
