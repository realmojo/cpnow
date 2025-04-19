"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import axios from "axios";

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );

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

        localStorage.setItem("cpnow-fb-token", token);
        const firstNoti = new Notification("알림이 허용되었습니다", {
          body: "최저가 알람을 받을 수 있어요 🚀",
          icon: "/icons/android-icon-192x192.png",
          data: {
            click_action: "https://cpnow.kr", // ✅ 클릭 시 이동할 링크
          },
        });

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
  };

  const sendNotification = () => {
    if (permission === "granted") {
      new Notification("시피나우", {
        body: "등록하신 상품이 최저가로 올라왔습니다.",
        icon: "/icons/logo-512x512.png",
        data: {
          click_action: "https://www.naver.com", // ✅ 클릭 시 이동할 링크
        },
      });
    } else {
      alert("알림 권한이 필요합니다.");
    }
  };

  const sendFCMNotification = async () => {
    try {
      const token = localStorage.getItem("cpnow-fb-token");
      if (permission !== "granted") {
        toast("알림을 먼저 허용해주세요", {
          description: "쿠팡 할인 알람입니다! 🚀",
        });
      } else if (permission === "granted" && token) {
        const response = await axios.post("/api/notify", {
          token,
          title: "쿠팡 최저가 알림이 도달했습니다.",
          body: "왜 안되는거야!!",
          link: "https://naver.com",
        });

        if (response.status === 200) {
          toast("알림이 성공적으로 보내졌습니다!", {
            duration: Infinity,
            description: "쿠팡 할인 알람입니다! 🚀",
            action: {
              label: "확인하기",
              onClick: () => window.open("https://cpnow.kr"),
            },
          });
          // const notification = new Notification("시피나우", {
          //   // requireInteraction: true,
          //   body: "알림이 성공적으로 보내졌습니다!.",
          //   badge: "32",
          //   icon: "/icons/logo-512x512.png",
          //   data: {
          //     click_action: "https://www.naver.com", // ✅ 클릭 시 이동할 링크
          //   },
          // });
          // notification.onclick = (event) => {
          //   event.preventDefault();
          //   window.open(notification.data.click_action, "_blank");
          // };
        }
      } else {
      }
    } catch (e) {
      console.log(e);
    }

    // await admin.messaging().send({
    //   token:
    //     "cgEhW5uCJBoL17YbW_hXaU:APA91bFX_Enb7r4MEmFc753wDmYUJFa46Bc-aX8mQBri7q_rXB3PJfczdYsRfzFJQBn0tOMQFoE9QRpebvifQo0mzyMbTOSV-oGdJ1cY0wi3uXkgDwt_DXk",
    //   notification: {
    //     title: "📢 새로운 소식!",
    //     body: "지금 확인해보세요.",
    //   },
    //   webpush: {
    //     notification: {
    //       click_action: "https://yourapp.com/product/123",
    //     },
    //   },
    // });
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleRequestPermission}>알림 권한 요청</Button>
      <Button variant="secondary" onClick={sendNotification}>
        알림 테스트 발송
      </Button>
      <Button variant="secondary" onClick={sendFCMNotification}>
        FCM 테스트 발송
      </Button>
    </div>
  );
}
