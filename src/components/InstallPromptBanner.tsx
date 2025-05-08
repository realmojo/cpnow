"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // 자동 프롬프트 방지
      setDeferredPrompt(e);
      setShowBanner(true); // 배너 표시
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("✅ 앱 설치 완료!");
      alert("설치가 완료되었습니다!");
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ 설치 완료");
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-b border-gray-200 bg-white shadow-md">
      <div className="mx-auto flex max-w-screen-md items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/android-icon-48x48.png"
            alt="App Logo"
            width={40}
            height={40}
            unoptimized
          />
          <div className="text-sm text-gray-800">
            <strong className="block text-base">
              최저가 알람을 설치해주세요
            </strong>
            <span className="text-gray-500">
              원활한 사용을 위해 앱을 설치해야 합니다
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="default" onClick={handleInstall}>
            설치
          </Button>
          {/* <Button variant="ghost" onClick={() => setShowBanner(false)}>
            닫기
          </Button> */}
        </div>
      </div>
    </div>
  );
}
