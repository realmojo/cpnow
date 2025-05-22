"use client";
import { messaging, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import { useEffect } from "react";
// import { detectDevice } from "@/utils/utils";
export default function ForegroundNotification() {
  useEffect(() => {
    // messaging이 비동기적으로 초기화될 수 있다고 가정
    const interval = setInterval(() => {
      if (messaging) {
        console.log("✅ messaging 준비 완료", messaging);

        // onMessage 리스너 등록
        onMessage(messaging, (payload: MessagePayload) => {
          console.log("✅ 포그라운드 메시지 수신", payload);

          if (
            payload.data?.silent === "true" &&
            payload.data?.check === "validity"
          ) {
            console.log("🔐 F 토큰 유효성 검사 완료");
            return;
          }
          // if (detectDevice().isMobile) {
          navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification(payload.data?.title || "", {
              body: payload.data?.body,
              icon:
                payload.data?.icon ||
                "https://cpnow.kr/icons/android-icon-48x48.png",
              requireInteraction: true,
            });
          });
          // } else {
          //   new Notification(payload.data?.title || "", {
          //     body: payload.data?.body,
          //     icon:
          //       payload.data?.icon ||
          //       "https://cpnow.kr/icons/android-icon-48x48.png",
          //     requireInteraction: true,
          //   }).onclick = () => {
          //     window.open(payload.data?.link || "https://cpnow.kr", "_blank");
          //   };
          // }
        });

        clearInterval(interval); // 더 이상 반복 확인하지 않음
      }
    }, 300); // 300ms 간격으로 messaging 준비 상태 체크

    return () => clearInterval(interval);
  }, []);

  return null;
}
