"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import axios from "axios";
import { nanoid } from "nanoid";
import Link from "next/link";

export default function NotiRegisterButton() {
  const [auth, setAuth] = useState<any>({
    userId: "",
    fcmToken: "",
  });
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );
  const [isReady, setIsReady] = useState(false); // ✅ 추가

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) {
      alert("이 브라우저는 Notification을 지원하지 않습니다.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast("알림이 허용되었습니다!", {
        description: "이제 푸시 메시지를 받을 수 있어요 🚀",
      });

      // FCM 토큰 받아오기
      if (messaging) {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });

        localStorage.setItem("cpnow-fcm-token", token);
        const firstNoti = new Notification("최저가 알람을 받을 수 있어요 🚀", {
          body: "알림을 받고 싶은 상품을 담아보세요",
          icon: "/icons/android-icon-192x192.png",
          data: {
            click_action: "https://cpnow.kr", // ✅ 클릭 시 이동할 링크
          },
        });

        const cpnowInfo = {
          userId: nanoid(12),
          fcmToken: token,
        };
        const res = await axios.post(
          "https://api.mindpang.com/api/cpnow/addUserFcmToken.php",
          cpnowInfo,
        );
        if (res.status === 200 && res.data === "ok") {
          localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
          firstNoti.onclick = (event) => {
            event.preventDefault();
            window.open(firstNoti.data.click_action, "_blank");
          };

          // 포그라운드 메세지 수신
          onMessage(messaging, (payload: MessagePayload) => {
            new Notification(payload.notification?.title || "", {
              body: payload.notification?.body,
              icon: payload.notification?.icon,
            });
          });
        }
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
  }, []);

  if (!isReady) return null;

  return (
    <React.Fragment>
      {auth.userId ? (
        <Link href="/mynow">
          <Button variant="outline">내 알림보기</Button>
        </Link>
      ) : (
        <Button onClick={handleRequestPermission}>알림 받기</Button>
      )}
    </React.Fragment>
  );
}
