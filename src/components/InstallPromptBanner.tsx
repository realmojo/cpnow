"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { detectDevice } from "@/utils/utils";

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const dismissedRef = useRef(false); // 새로고침 시 초기화됨

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // 자동 프롬프트 방지
      if (!dismissedRef.current) {
        setDeferredPrompt(e);
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      console.log("✅ 앱 설치 완료!");
      alert("설치가 완료되었습니다!");
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    // if (!deferredPrompt) return;
    // deferredPrompt.prompt();
    // const { outcome } = await deferredPrompt.userChoice;
    // if (outcome === "accepted") {
    //   console.log("✅ 설치 완료");
    // }
    console.log(deferredPrompt);
    setShowBanner(false);
    location.href =
      "https://play.google.com/store/apps/details?id=com.f5game.cpnow";
  };

  const handleClose = () => {
    dismissedRef.current = true;
    setShowBanner(false);
  };

  if (!showBanner || detectDevice().isDesktop) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-b border-gray-200 bg-white shadow-md">
      <div className="mx-auto flex max-w-screen-md items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/android-icon-48x48.png"
            alt="App Logo"
            width={40}
            height={40}
          />
          <div className="text-sm text-gray-800">
            <strong className="block text-base">
              시피나우 앱을 설치해주세요
            </strong>
            <span className="text-gray-500">
              원활한 사용을 위해 앱을 설치해야 합니다
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={handleInstall} title="설치">
            설치
          </Button>
          <Button variant="ghost" onClick={handleClose} title="닫기">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
