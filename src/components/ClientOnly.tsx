"use client";
import { useEffect } from "react";
import { useAppStore } from "@/src/store/useAppStore";

export default function ClientOnly() {
  useEffect(() => {
    useAppStore.getState().getMyAlarmList();
  }, []);

  return null;
}
