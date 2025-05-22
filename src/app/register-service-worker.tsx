"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const loadWorkbox = async () => {
      // 👇 TypeScript에게 이 줄의 타입 오류를 무시하라고 지시
      // @ts-ignore
      const module = await import(
        "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-window.prod.mjs"
      );

      const wb = new module.Workbox("/firebase-messaging-sw.js?v=1.0.13");

      const forceUpdateSW = async () => {
        wb.addEventListener("controlling", () => {
          console.log(
            "✅ New service worker is now controlling the page. Reloading...",
          );
          window.location.reload();
        });

        wb.messageSkipWaiting();
      };

      wb.addEventListener("waiting", () => {
        console.log(
          "🆕 New Service Worker waiting to activate. Forcing activation...",
        );
        forceUpdateSW();
      });

      wb.addEventListener("activated", () => {
        console.log("🔄 Service Worker activated");
      });

      try {
        const reg = await wb.register();
        console.log("🔐 Service Worker registered", reg);
      } catch (err) {
        console.error("❌ Service Worker registration failed:", err);
      }
    };

    loadWorkbox();
  }, []);

  return null;
}
