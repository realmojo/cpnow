"use client";
import { messaging, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import { useEffect } from "react";

export default function ForegroundNotification() {
  console.log("✅ 포그라운드 메세지 수신");
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload: MessagePayload) => {
        console.log("foreground payload", payload);
        new Notification(payload.notification?.title || "", {
          body: payload.notification?.body,
          icon: payload.notification?.icon,
          requireInteraction: true,
        });
      });
    }
  }, []);

  return null;
}
