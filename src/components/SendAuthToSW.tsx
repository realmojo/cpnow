"use client";

import { useEffect } from "react";
function waitForServiceWorkerController(): Promise<ServiceWorker> {
  return new Promise((resolve) => {
    if (navigator.serviceWorker.controller) {
      resolve(navigator.serviceWorker.controller);
    } else {
      const listener = () => {
        if (navigator.serviceWorker.controller) {
          resolve(navigator.serviceWorker.controller);
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener,
          );
        }
      };
      navigator.serviceWorker.addEventListener("controllerchange", listener);
    }
  });
}
export default function SendAuthToSW() {
  useEffect(() => {
    const authStr = localStorage.getItem("cpnow-auth");
    if (!authStr) return;

    const auth = JSON.parse(authStr);

    async function sendToSW() {
      await navigator.serviceWorker.ready; // 등록 완료까지 대기
      const controller = await waitForServiceWorkerController(); // 활성화 및 컨트롤러 확보

      controller.postMessage({
        type: "AUTH_TOKEN",
        userId: auth.userId,
        fcmToken: auth.fcmToken,
      });

      console.log("✅ SW에 안전하게 postMessage 전송됨");
    }

    sendToSW();
  }, []);

  return null; // 렌더링 요소는 필요 없음
}
