"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { settingsStore } from "@/src/store/settingsStore";

export default function RocketPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, setSettings, updateSettings } = settingsStore();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSettings();
  }, []);

  return (
    <article className="mt-4 mb-24 flex flex-col items-center justify-center">
      <section className="w-full max-w-[600px] px-4">
        <h2 className="mb-6 text-xl font-bold">알림 설정</h2>

        <ul className="space-y-4">
          <li className="flex items-center justify-between border-b py-3">
            <Label htmlFor="my-alert">내 알림 받기</Label>
            <Switch
              id="my-alert"
              checked={settings?.isMyAlarm === "Y"}
              onCheckedChange={async () => {
                await updateSettings(
                  "isMyAlarm",
                  settings?.isMyAlarm === "Y" ? "N" : "Y",
                );
              }}
            />
          </li>

          <li className="flex items-center justify-between border-b py-3">
            <div className="flex flex-col">
              <Label htmlFor="random-alert">추천 알림 받기</Label>
              <span className="mt-1 text-xs text-gray-500">
                CPNOW에서 추천하는 알람을 보내드립니다.
              </span>
            </div>
            <Switch
              id="random-alert"
              checked={settings?.isPriceAlarm === "Y"}
              onCheckedChange={async () => {
                await updateSettings(
                  "isPriceAlarm",
                  settings?.isPriceAlarm === "Y" ? "N" : "Y",
                );
              }}
            />
          </li>

          <li className="flex items-center justify-between border-b py-3">
            <div className="flex flex-col">
              <Label htmlFor="block-alert">알림방해 시간 설정</Label>
              {settings?.isBlockAlarm === "Y" ? (
                <span className="mt-1 text-xs text-gray-500">
                  {settings?.blockStartTime} ~ {settings?.blockEndTime}
                </span>
              ) : null}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="block-alert"
                checked={settings?.isBlockAlarm === "Y"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setIsOpen(true);
                    updateSettings("isBlockAlarm", "Y");
                  } else {
                    updateSettings("isBlockAlarm", "N");
                  }
                }}
              />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>알림방해 시간 설정</DialogTitle>
                  <DialogDescription>
                    시작 시간과 종료 시간을 설정해 주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-time">시작 시간</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={settings?.blockStartTime}
                      onChange={(e) => {
                        updateSettings("blockStartTime", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">종료 시간</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={settings?.blockEndTime}
                      onChange={(e) => {
                        updateSettings("blockEndTime", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </section>
    </article>
  );
}
