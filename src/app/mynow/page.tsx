"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/src/components/ProductList";
import { Button } from "@/components/ui/button";
import { detectDevice } from "@/utils/utils";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { MessagePayload } from "firebase/messaging";
import { nanoid } from "nanoid";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ 상품 호출 함수
async function getProductByUserId(userId: string): Promise<any | null> {
  const res = await fetch(`/api/alarm/my?userId=${userId}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

const openForegroundMessage = (messaging: any) => {
  console.log("✅ 포그라운드 메세지 수신", messaging);
  if (messaging) {
    onMessage(messaging, (payload: MessagePayload) => {
      console.log("foreground payload", payload);
      new Notification(payload.notification?.title || "", {
        body: payload.notification?.body,
        icon: payload.notification?.icon,
      });
    });
  }
};

const sendProductInfo = async (parsedItem: any, parsed: any) => {
  try {
    const res = await fetch("/api/alarm/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...parsedItem,
        userId: parsed.userId,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ API 호출 실패:", error);
  }
};

export default function LocalAuthViewer() {
  const searchParams = useSearchParams();
  const [myProductsItems, setMyProductsItems] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    loginInit();
    setOpen(false); // 모달 닫기
  };
  const loginInit = async () => {
    localStorage.removeItem("cpnow-auth");

    const deviceInfo = detectDevice();
    if (messaging) {
      // FCM 토큰 받아오기
      const userId = nanoid(12);
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      const cpnowInfo = {
        userId,
        fcmToken,
      };
      const res = await axios.post("/api/token", cpnowInfo);
      if (res.status === 200 && res.data.data === "ok") {
        localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
        // setAuth(cpnowInfo);
      }

      if (deviceInfo.isDesktop) {
        let firstNoti: any = "";
        try {
          firstNoti = new Notification("최저가 알람을 받을 수 있어요 🚀", {
            body: "알림을 받고 싶은 상품을 담아보세요",
            icon: "/icons/android-icon-192x192.png",
            data: {
              click_action: "https://cpnow.kr", // ✅ 클릭 시 이동할 링크
            },
          });
        } catch (e) {
          alert(e);
        }

        firstNoti.onclick = (event: any) => {
          event.preventDefault();
          window.open(firstNoti.data.click_action, "_blank");
        };

        // 포그라운드 메세지 수신
        openForegroundMessage(messaging);
      }
    }

    location.href = "/mynow";
  };

  const initData = async () => {
    const stored = localStorage.getItem("cpnow-auth");
    if (!stored) {
      return;
    }
    const parsed = JSON.parse(stored);

    const item = searchParams.get("item");
    const parsedItem = JSON.parse(item || "{}");

    if (parsedItem) {
      parsedItem.lowPrice = parsedItem.price;
      parsedItem.highPrice = parsedItem.price;
      parsedItem.link = `https://www.coupang.com/vp/products/${parsedItem.productId}?itemId=${parsedItem.itemId}&vendorItemId=${parsedItem.vendorItemId}`;

      // 파라미터가 모두 있으면 API 호출
      if (
        parsedItem.productId &&
        parsedItem.itemId &&
        parsedItem.vendorItemId &&
        parsedItem.categoryId &&
        parsed.userId
      ) {
        const data = await sendProductInfo(parsedItem, parsed);
        setMyProductsItems(data);
      }
    }

    if (parsed?.userId) {
      const data = await getProductByUserId(parsed.userId);
      setMyProductsItems(data);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <article>
      <section className="mt-8 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
            내 알람 리스트
          </h2>

          {myProductsItems === null ? (
            // ✅ 데이터 불러오는 중
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 animate-spin text-4xl">🔄</div>
              <p className="text-lg font-semibold text-gray-700">
                데이터를 불러오는 중입니다...
              </p>
            </div>
          ) : myProductsItems.length > 0 ? (
            // ✅ 데이터 있음
            <>
              <ProductList items={myProductsItems} />

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full">
                    알림 초기화 하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>알림 초기화</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-sm text-gray-700">
                    정말 알림을 초기화하시겠습니까?
                  </div>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      취소
                    </Button>
                    <Button variant="default" onClick={handleConfirm}>
                      확인
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            // ✅ 데이터 없음
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 text-4xl">🔔</div>
              <p className="text-lg font-semibold text-gray-700">
                아직 등록된 알람이 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                상품을 등록하고 가격 변동 알림을 받아보세요!
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
