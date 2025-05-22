"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js?v=v1.0.12")
        .then((registration) => {
          console.log("🔐 Service Worker 등록 진행 v1.0.12", registration);
          // 강제 업데이트 시도
          try {
            registration.update();

            // 변경 감지
            registration.onupdatefound = () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.onstatechange = () => {
                  if (newWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                      // 새 서비스워커가 설치되었음
                      console.log(
                        "✅ Service Worker 등록 완료 v1.0.12",
                        registration,
                      );
                    }
                  }
                };
              }
            };
          } catch (e) {
            console.error("Service Worker 강제 업데이트 실패:", e);
          }
        })
        .catch((err) => console.error("Service Worker 등록 실패:", err));
    }
  }, []);

  return null;
}
