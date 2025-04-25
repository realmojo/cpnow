// import type { Metadata } from "next";
// import ClientDefaultSeo from "../components/ClientDefaultSeo"; // ✅ Client 컴포넌트
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

// export const metadata: Metadata = {
//   title: "시피나우",
//   description: "최저가 확인",
// };

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
