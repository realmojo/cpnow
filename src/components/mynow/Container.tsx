"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/src/components/ProductList";
import { Button } from "@/components/ui/button";
import {
  getUserAuth,
  isWebView,
  sendNotificationTest,
  setUserAuth,
} from "@/utils/utils";
import { messaging, getToken } from "@/lib/firebase";
import { useAppStore } from "@/src/store/useAppStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Loader2, Plus } from "lucide-react"; // shadcn 아이콘
import { nanoid } from "nanoid";

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

export default function MyNowContainer() {
  const { setOpen } = useAppStore();
  const searchParams = useSearchParams();

  const [isReady, setIsReady] = useState(false); // ✅ 추가
  const [myProductsItems, setMyProductsItems] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const [initOpen, setInitOpen] = useState(false);
  const { loginInfo, getMyAlarmList } = useAppStore();

  const handleConfirm = () => {
    loginInit();
    setInitOpen(false); // 모달 닫기
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

      const res = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify(cpnowInfo),
      });
      const r = await res.json();

      if (r.data === "ok") {
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
    const parsed = getUserAuth();
    if (!parsed.userId) return;

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
      const data = await getMyAlarmList();
      setMyProductsItems(data);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const initAuth = async () => {
    const item = localStorage.getItem("cpnow-auth") || "";

    if (item) {
      setUserAuth(JSON.parse(item));
    }
  };

  const initPermission = async () => {
    if (isWebView()) return;
    const result = await Notification.requestPermission();

    if (result !== "granted") {
      location.href = "/";
    }
  };

  useEffect(() => {
    initPermission();
    initAuth();
    initData();
  }, [initData]);

  if (!isReady) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-gray-50 pt-40">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <article>
      <section className="mt-4 mb-24 flex justify-center">
        <div className="w-[800px] px-4">
          {myProductsItems && myProductsItems.length !== 0 ? (
            // ✅ 데이터 있음
            <>
              <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
                찜 목록
              </h2>
              <ProductList items={myProductsItems} type="list" />

              <div className="mt-2 flex w-full gap-2">
                {!isWebView() && (
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
                )}

                <div className="flex min-w-0 flex-1">
                  <Dialog open={initOpen} onOpenChange={setInitOpen}>
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
                          onClick={() => setInitOpen(false)}
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
                </div>
              </div>
            </>
          ) : (
            // ✅ 데이터 없음
            <div className="flex flex-col justify-center py-12 text-center">
              <div className="flex pt-4">
                <div className="w-full rounded-lg bg-white p-10 text-center shadow-lg">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <div className="text-2xl">☑️</div>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                      상품을 담아주세요
                    </h2>
                    <p className="text-sm text-gray-600">
                      이제 관심 있는 상품을 찾아 찜해보세요.
                      <br />
                      최저가 알림을 바로 받아보실 수 있어요.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setOpen(true);
                      }}
                      className="text-md text-md w-full rounded-lg px-4 py-6 text-white transition-colors"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      상품등록
                    </Button>

                    <Button
                      disabled={loading}
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
                      className="text-md text-md w-full rounded-lg bg-gray-100 px-4 py-6 text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      {loading ? (
                        <Loader2 className="text-muted-foreground ml-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Bell className="text-muted-foreground ml-2 h-4 w-4" />
                      )}
                      알림 테스트
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
