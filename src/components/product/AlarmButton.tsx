// components/AlarmButton.tsx
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getUserAuth } from "@/utils/utils"; // 클라이언트에서 작동해야 함

// ✅ 알람등록
async function addAlarm(params: any): Promise<any | null> {
  const response = await fetch(`/api/alarm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const res = await response.json();

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function AlarmButton({ pId }: { pId: number }) {
  const handleNotify = async () => {
    try {
      const userInfo = await getUserAuth();
      const params = {
        userId: userInfo.userId,
        pId: pId,
      };

      await addAlarm(params);

      toast("최저가 알림 설정 완료 🚀", {
        description: (
          <span className="font-semibold text-gray-400">
            가격이 내려가면 바로 알려드릴게요!
          </span>
        ),
      });
    } catch (error) {
      console.log(error);
      toast("알람 등록에 실패했습니다.", {
        description: "다시 시도해 주세요.",
      });
    }
  };

  return (
    <Button
      className="h-14 w-full flex-1 px-0"
      size="lg"
      onClick={handleNotify}
    >
      알람받기
    </Button>
  );
}
