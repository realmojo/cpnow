"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AppleIcon, PlayIcon } from "lucide-react";
import { isApple } from "@/utils/utils";

export default function NotSupported() {
  const router = useRouter();

  const handleGoToAppStore = () => {
    window.location.href = "https://apps.apple.com/kr/app/id6746947388"; // 앱스토어 링크
  };

  const handleGoToPlayStore = () => {
    window.location.href =
      "https://play.google.com/store/apps/details?id=com.f5game.cpnow"; // 안드로이드 앱 링크
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-start justify-center pt-20">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            해당 기기에서는 <br />
            알림이 지원되지 않습니다.
          </h2>
          <p className="text-gray-600">
            모바일 앱에서 알림을 받을 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          {!isApple() && (
            <Button
              onClick={handleGoToPlayStore}
              className="text-md w-full rounded-lg bg-blue-600 px-4 py-6 text-white transition-colors hover:bg-gray-200"
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              안드로이드 다운로드
            </Button>
          )}

          <Button
            onClick={() => {
              handleGoToAppStore();
            }}
            className="text-md w-full rounded-lg bg-blue-600 px-4 py-6 text-white transition-colors hover:bg-blue-700"
          >
            <AppleIcon className="mr-2 h-4 w-4" />
            앱스토어 다운로드
          </Button>
          <Button
            onClick={() => router.push("/rocket")}
            className="text-md text-md w-full rounded-lg bg-gray-400 px-4 py-6 text-white transition-colors hover:bg-gray-700"
          >
            둘러보기
          </Button>
        </div>
      </div>
    </div>
  );
}
