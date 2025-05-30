"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Bell } from "lucide-react";
import Link from "next/link";
import { isWebView } from "@/utils/utils";

export default function MainSidebarRightButton() {
  const [permission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );
  const [isReady, setIsReady] = useState(false); // ✅ 추가

  const initAuth = async () => {
    setIsReady(true);
  };

  useEffect(() => {
    initAuth();

    // 포그라운드 메세지 수신
    // openForegroundMessage(messaging);

    if (isWebView()) {
      const interval = setInterval(() => {
        const auth = localStorage.getItem("cpnow-auth");
        if (auth) {
          clearInterval(interval); // 감지 완료 후 종료
        }
      }, 300); // 0.3초 간격으로 체크

      return () => clearInterval(interval);
    }
  }, []);

  if (!isReady) return null;

  return (
    <div className="flex items-center gap-3">
      <Link href="/guide">
        <Button variant="ghost" size="icon" title="사용방법">
          <BookOpen className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/alarm">
        <Button variant="ghost" size="icon" title="알람">
          <Bell className="h-5 w-5" />
        </Button>
      </Link>
      {permission === "denied" ? (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md rounded-lg border border-red-300 bg-red-100 p-4 text-red-700 shadow-md">
          <h2 className="mb-1 text-sm font-bold">알림 권한이 꺼져 있어요 😢</h2>
          <p className="mb-2 text-xs">
            현재 브라우저 알림 권한이 꺼져 있어 푸시 알림을 받을 수 없어요. 아래
            설명을 따라 권한을 다시 켜주세요.
          </p>
          <ul className="mb-2 list-inside list-disc text-xs text-gray-700">
            <li>
              <strong>Android Chrome:</strong> 주소창 오른쪽 ⋮ → 설정 → 알림 →
              알림 허용
            </li>
            <li>
              <strong>iOS Safari:</strong> 설정 앱 → Safari → 웹사이트 설정 →
              알림 → 허용
            </li>
          </ul>
          <p className="text-xs text-gray-500 italic">
            권한을 변경한 후 이 페이지를 새로고침 해주세요.
          </p>
        </div>
      ) : null}
    </div>
  );
}
