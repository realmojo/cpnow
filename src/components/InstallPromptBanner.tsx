"use client";
import { useEffect, useState } from "react";

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // 자동 프롬프트 방지
      console.log(3434);

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
    console.log(outcome);
    if (outcome === "accepted") {
      console.log("✅ 설치 완료");
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-yellow-100 p-4 text-sm text-black shadow-md">
      <span>📲 이 사이트를 앱처럼 설치해보세요!</span>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
        >
          설치하기
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-xs underline"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
