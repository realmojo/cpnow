// components/AlarmButton.tsx
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getUserAuth } from "@/utils/utils"; // 클라이언트에서 작동해야 함
import { useAppStore } from "@/src/store/useAppStore";
import { useState } from "react";
import { Loader2 } from "lucide-react";
// ✅ 알람등록
async function addAlarm(params: any): Promise<any | null> {
  const response = await fetch(`/api/userAlarm`, {
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
// ✅ 알람 삭제 함수
async function removeAlarm(params: any): Promise<any | null> {
  const response = await fetch(
    `/api/userAlarm/delete?userId=${params.userId}&pId=${params.pId}`,
    {
      method: "DELETE",
    },
  );

  const res = await response.json();
  if (!res.ok) return null;
  return res.data;
}

export default function AlarmButton({ productItem }: { productItem: any }) {
  const { myAlarmList, setMyAlarmList } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const isAlarmed = myAlarmList.some(
    (alarm: any) => alarm.id === productItem.id,
  );

  const handleNotify = async () => {
    try {
      const userInfo = await getUserAuth();
      const params = {
        userId: userInfo.userId,
        pId: productItem.id,
      };

      if (isAlarmed) {
        // ✅ 알림 취소 로직
        await removeAlarm(params);

        // 상태에서 해당 항목 제거
        const updatedList = myAlarmList.filter(
          (item: any) => item.id !== productItem.id,
        );
        useAppStore.setState({ myAlarmList: updatedList });

        toast("🔕  알림이 취소되었습니다.", {
          description: (
            <span className="font-semibold text-gray-400">
              더 이상 이 상품의 가격 알림을 받지 않습니다.
            </span>
          ),
        });
      } else {
        // ✅ 알림 등록 로직
        await addAlarm(params);
        setMyAlarmList(productItem);

        toast("🔔  최저가 알림 설정 완료", {
          description: (
            <span className="font-semibold text-gray-400">
              가격이 내려가면 바로 알려드릴게요!
            </span>
          ),
        });
      }
    } catch (error) {
      console.log(error);
      toast("알람 등록에 실패했습니다.", {
        description: (
          <span className="font-semibold text-gray-400">
            다시 시도해 주세요.
          </span>
        ),
      });
    }
  };

  return (
    <Button
      className="h-14 w-full flex-1 px-0"
      size="lg"
      title={isAlarmed ? "알림취소" : "알림받기"}
      onClick={() => {
        try {
          setIsLoading(true);
          handleNotify();
        } catch (error) {
          console.log(error);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>{isAlarmed ? "🔕 알림취소" : "🔔 알림받기"}</>
      )}
    </Button>
  );
}
