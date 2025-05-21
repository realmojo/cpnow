"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { messaging, getToken } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { Bell } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { detectDevice, isWebView, sendNotificationTest } from "@/utils/utils";

// const isIOS = () =>
//   /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

// if (isIOS() && !(navigator as any).standalone) {
//   alert(
//     "홈 화면에 추가하여 앱처럼 사용해보세요!\n사파리 하단의 공유 버튼 → '홈 화면에 추가'",
//   );
// }

export default function NotiRegisterButton() {
  const [auth, setAuth] = useState<any>({
    userId: "",
    fcmToken: "",
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? "default"
      : "default",
  );
  const [isReady, setIsReady] = useState(false); // ✅ 추가

  const handleRequestPermission = async () => {
    const deviceInfo = detectDevice();
    if (!("Notification" in window)) {
      alert("이 브라우저는 Notification을 지원하지 않습니다.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast("알림이 허용되었습니다!", {
        description: (
          <span className="font-semibold text-gray-400">
            이제 최저가 알람 메시지를 받을 수 있어요 🚀
          </span>
        ),
      });
    } else {
      setPermission(result);
    }

    if (messaging) {
      // FCM 토큰 받아오기
      const userId = nanoid(12);
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      const cpnowInfo = {
        userId,
        joinType: "web",
        fcmToken,
      };
      const res = await axios.post("/api/token", cpnowInfo);
      if (res.status === 200 && res.data.data === "ok") {
        localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
        setAuth(cpnowInfo);
      }

      if (deviceInfo.isDesktop) {
        sendNotificationTest();

        // 포그라운드 메세지 수신
        // openForegroundMessage(messaging);
      }
    }
  };

  const initAuth = async () => {
    const item = localStorage.getItem("cpnow-auth") || "";

    if (item) {
      setAuth(JSON.parse(item));
    }
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
          setAuth(JSON.parse(auth));
          clearInterval(interval); // 감지 완료 후 종료
        }
      }, 300); // 0.3초 간격으로 체크

      return () => clearInterval(interval);
    }
  }, []);

  if (!isReady) return null;

  return (
    <React.Fragment>
      {auth.userId ? (
        <Link href="/mynow">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
      ) : !isWebView() ? (
        <Button onClick={handleRequestPermission}>알림 받기</Button>
      ) : null}
      {/* <Button onClick={sendNotificationTest}>테스트 알림</Button> */}
      {/* <Button onClick={() => deleteFcmToken()}>알림 토큰 삭제</Button> */}
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
    </React.Fragment>
  );
}
