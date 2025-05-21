"use client";
import { messaging, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import { useEffect } from "react";

export default function ForegroundNotification() {
  console.log("✅ 포그라운드 메세지 수신");
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload: MessagePayload) => {
        console.log("✅ 포그라운드 메세지 수신", payload);
        new Notification(payload.data?.title || "", {
          body: payload.data?.body,
          icon:
            payload.data?.icon ||
            "https://cpnow.kr/icons/android-icon-48x48.png",
          requireInteraction: true,
        }).onclick = () => {
          window.open(payload.data?.link || "https://cpnow.kr", "_blank");
        };
      });
    }
  }, []);

  return null;
}
