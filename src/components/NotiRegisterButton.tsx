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
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? "default"
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

    alert(messaging);

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
    } else if (result === "denied") {
      setPermission(result);
      // alert(1);
      // new Notification("title" || "", {
      //   body: "hi",
      //   // icon: payload.notification?.icon,
      // });
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
      {permission === "denied" ? (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md rounded-lg border border-red-300 bg-red-100 p-4 text-red-700 shadow-md">
          <h2 className="mb-1 text-sm font-bold">알림 권한이 꺼져 있어요 😢</h2>
          <p className="mb-2 text-xs">
            현재 브라우저 알림 권한이 꺼져 있어 푸시 알림을 받을 수 없어요. 아래
            설명을 따라 권한을 다시 켜주세요.
          </p>
          <ul className="mb-2 list-inside list-disc text-xs text-gray-700">
            <li>
              <strong>Android Chrome:</strong> 주소창 오른쪽 ⋮ {">"} 설정 {">"}{" "}
              알림 {">"} 알림 허용
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
