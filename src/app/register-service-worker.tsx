"use client";

import { useEffect } from "react";
import { Workbox } from "workbox-window"; // ✅ npm 설치된 모듈 import

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const wb = new Workbox("/firebase-messaging-sw.js?v=1.0.13");

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

    wb.register()
      .then((reg) => {
        console.log("🔐 Service Worker registered", reg);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  }, []);

  return null;
}
