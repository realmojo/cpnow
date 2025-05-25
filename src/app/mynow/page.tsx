"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/src/components/ProductList";
import { Button } from "@/components/ui/button";
import { sendNotificationTest } from "@/utils/utils";
import { messaging, getToken } from "@/lib/firebase";
import { useAppStore } from "@/src/store/useAppStore";
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
import { Loader2 } from "lucide-react"; // shadcn 아이콘

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
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const { loginInfo, myAlarmList } = useAppStore();

  const handleConfirm = () => {
    loginInit();
    setOpen(false); // 모달 닫기
  };
  const loginInit = async () => {
    const { userId } = loginInfo;
    await fetch("/api/alarm/delete?all=true&userId=" + userId, {
      method: "DELETE",
    });

    localStorage.removeItem("cpnow-auth");

    if (messaging) {
      // FCM 토큰 받아오기
      const userId = nanoid(12);
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      const cpnowInfo = {
        userId,
        joinType: "web",
        fcmToken,
      };
      const res = await axios.post("/api/token", cpnowInfo);
      if (res.status === 200 && res.data.data === "ok") {
        localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
      }

      await sendNotificationTest();
    }

    location.href = "/mynow";
  };

  const decodeFromBase64 = (base64: string): string => {
    return decodeURIComponent(decodeURIComponent(escape(atob(base64))));
  };

  const initData = useCallback(async () => {
    const stored = localStorage.getItem("cpnow-auth");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const item = searchParams.get("item") || "";
    if (item) {
      const parsedItem = JSON.parse(decodeFromBase64(item)) || "";

      parsedItem.lowPrice = parsedItem.price;
      parsedItem.highPrice = parsedItem.price;
      parsedItem.link = `https://www.coupang.com/vp/products/${parsedItem.productId}?itemId=${parsedItem.itemId}&vendorItemId=${parsedItem.vendorItemId}`;

      if (
        parsedItem.productId &&
        parsedItem.itemId &&
        parsedItem.vendorItemId &&
        parsedItem.categoryId &&
        parsed.userId
      ) {
        try {
          const data = await sendProductInfo(parsedItem, parsed);
          setMyProductsItems(data);
        } catch (e) {
          console.error("❌ 상품 등록 실패:", e);
        }
      }
    } else if (parsed?.userId) {
      setMyProductsItems(myAlarmList);
    }
  }, [searchParams, myAlarmList]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <article>
      <section className="mt-8 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
            내 알람 리스트
          </h2>

          {myProductsItems === null ? (
            <>
              {/* ✅ 데이터 불러오는 중 */}
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-4 animate-spin text-4xl">🔄</div>
                <p className="text-lg font-semibold text-gray-700">
                  데이터를 불러오는 중입니다...
                </p>
              </div>
            </>
          ) : myProductsItems.length > 0 ? (
            // ✅ 데이터 있음
            <>
              <ProductList items={myProductsItems} type="list" />

              <div className="mt-2 flex w-full gap-2">
                <div className="flex min-w-0 flex-1">
                  <Button
                    className="w-full flex-1"
                    disabled={loading}
                    title="알림 테스트"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await sendNotificationTest();
                      } catch (e) {
                        console.error("알림 전송 실패", e);
                      } finally {
                        setTimeout(() => {
                          setLoading(false);
                        }, 300);
                      }
                    }}
                  >
                    <span className="truncate">알림 테스트</span>
                    {loading && (
                      <Loader2 className="text-muted-foreground ml-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>

                {/* <div className="flex min-w-0 flex-1">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full flex-1"
                        disabled={initLoading}
                        title="알림 초기화"
                      >
                        <span className="truncate">알림 초기화</span>
                        {initLoading && (
                          <Loader2 className="text-muted-foreground ml-2 h-4 w-4 animate-spin" />
                        )}
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
                        <Button
                          variant="outline"
                          title="취소"
                          onClick={() => setOpen(false)}
                        >
                          취소
                        </Button>
                        <Button
                          variant="destructive"
                          title="알림 초기화"
                          onClick={async () => {
                            setInitLoading(true);
                            try {
                              await handleConfirm();
                            } catch (e) {
                              console.error("초기화 실패", e);
                            } finally {
                              setTimeout(() => {
                                setInitLoading(false);
                              }, 300);
                            }
                          }}
                        >
                          확인
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div> */}
              </div>
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
              <Button
                className="mt-2 w-full"
                disabled={loading}
                title="알림 테스트"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await sendNotificationTest();
                  } catch (e) {
                    console.error("알림 전송 실패", e);
                  } finally {
                    setTimeout(() => {
                      setLoading(false);
                    }, 300);
                  }
                }}
              >
                {/* 알림텍스트는 항상 보이게 */}
                알림 테스트
                {/* 로딩 중일 때만 아이콘 표시 (오른쪽 정렬) */}
                {loading && (
                  <Loader2 className="text-muted-foreground ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
