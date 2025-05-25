"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store/useAppStore";

export default function ClientOnly() {
  useEffect(() => {
    // 상태 전역 노출 (WebView에서 접근 가능하도록)
    (window as any).__ZUSTAND_STORE__ = useAppStore;

    // WebView에서 온 메시지 수신
    window.addEventListener("message", (event) => {
      try {
        const { type } = JSON.parse(event.data);

        if (type === "REFRESH_ALARM_LIST") {
          console.log("📩 알람 목록 새로고침 요청 수신");
          useAppStore.getState().getMyAlarmList();
        }
      } catch (e) {
        console.warn("❌ WebView 메시지 파싱 실패", e);
      }
    });

    useAppStore.getState().getMyAlarmList();

    // 정리
    return () => {
      window.removeEventListener("message", () => {});
    };
  }, []);

  return null;
}
