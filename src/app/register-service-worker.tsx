"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js?v=v1.0.11")
        .then(() => console.log("✅ Service Worker 등록 완료 v1.0.11"))
        .catch((err) => console.error("Service Worker 등록 실패:", err));
    }
  }, []);

  return null;
}
