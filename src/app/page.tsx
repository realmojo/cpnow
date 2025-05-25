"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import ProductList from "@/src/components/ProductList";
import { Button } from "@/components/ui/button";
import { detectDevice, sendNotificationTest } from "@/utils/utils";
import { messaging, getToken } from "@/lib/firebase";
import { useAppStore } from "@/src/store/useAppStore";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BellPlus, Loader2, Menu } from "lucide-react"; // shadcn 아이콘
// import { Bell, BookOpen } from "lucide-react";

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

export default function HomePage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [auth, setAuth] = useState<any>({
    userId: "",
    fcmToken: "",
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? "default"
      : "default",
  );
  // const [isReady, setIsReady] = useState(false); // ✅ 추가
  const [myProductsItems, setMyProductsItems] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [alamButtonLoading, setAlamButtonLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const { loginInfo, getMyAlarmList } = useAppStore();

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

    location.href = "/";
  };

  const handleRequestPermission = async () => {
    const deviceInfo = detectDevice();
    if (!("Notification" in window)) {
      alert("이 브라우저는 Notification을 지원하지 않습니다.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast("알림이 허용되었습니다!", {
        description: (
          <span className="font-semibold text-gray-400">
            이제 최저가 알람 메시지를 받을 수 있어요 🚀
          </span>
        ),
      });
    } else {
      setPermission(result);
    }

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
        console.log("🔔 토큰 저장", cpnowInfo);
        setAuth(cpnowInfo);
      }

      if (deviceInfo.isDesktop) {
        sendNotificationTest();
      }
    }
  };

  const decodeFromBase64 = (base64: string): string => {
    return decodeURIComponent(decodeURIComponent(escape(atob(base64))));
  };

  const initData = useCallback(async () => {
    const stored = localStorage.getItem("cpnow-auth");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const item = searchParams.get("item") || "";
    console.log(item);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const initAuth = async () => {
    const item = localStorage.getItem("cpnow-auth") || "";

    if (item) {
      setAuth(JSON.parse(item));
    }
    // setIsReady(true);
  };

  useEffect(() => {
    initData();
    initAuth();
  }, [initData]);

  return (
    <article>
      <section className="mt-8 flex justify-center">
        <div className="w-[800px] px-4">
          {myProductsItems.length === 0 ? (
            <>
              {/* ✅ 데이터 불러오는 중 */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                {auth.userId === "" ? (
                  <>
                    <div className="mb-6 text-5xl">🔔</div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800">
                      알람을 허용하고 최저가 알림을 받아보세요!
                    </h2>
                    <p className="mb-6 text-sm text-gray-500">
                      관심 있는 상품이나 카테고리를 추가하고
                      <br />
                      최저가 알림을 받아보세요!
                    </p>
                    <Button
                      disabled={alamButtonLoading}
                      onClick={() => {
                        try {
                          setAlamButtonLoading(true);
                          handleRequestPermission();
                        } catch (e) {
                          console.error("알림 허용 실패", e);
                        } finally {
                          setTimeout(() => {
                            setAlamButtonLoading(false);
                          }, 300);
                        }
                      }}
                    >
                      <BellPlus className="mr-2 h-4 w-4" />
                      알람
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-6 text-5xl">❤️</div>

                    <h2 className="mb-2 text-xl font-bold text-gray-800">
                      알림이 설정되었습니다!
                    </h2>
                    <p className="mb-6 text-sm text-gray-500">
                      이제 관심 있는 상품을 찾아 <strong>찜</strong>해보세요.{" "}
                      <br />
                      최저가 알림을 바로 받아보실 수 있어요.
                    </p>
                    <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
                      {/* 카테고리 버튼 (고정폭) */}
                      <Button
                        variant="outline"
                        className="w-full sm:w-40"
                        onClick={() => router.push("/categories")}
                      >
                        <Menu className="mr-2 h-4 w-4" />
                        카테고리 보러 가기
                      </Button>

                      {/* 알림 테스트 버튼 (가변폭 + 로딩) */}
                      <Button
                        className="w-full"
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
                      >
                        <span className="truncate">알림 테스트</span>
                        {loading && (
                          <Loader2 className="text-muted-foreground ml-2 h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : myProductsItems.length > 0 ? (
            // ✅ 데이터 있음
            <>
              <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
                찜 목록
              </h2>
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

                <div className="flex min-w-0 flex-1">
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
                </div>
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
      {permission === "denied" ? (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md rounded-lg border border-red-300 bg-red-100 p-4 text-red-700 shadow-md">
          <h2 className="mb-1 text-sm font-bold">알림 권한이 꺼져 있어요 😢</h2>
          <p className="mb-2 text-xs">
            현재 브라우저 알림 권한이 꺼져 있어 푸시 알림을 받을 수 없어요. 아래
            설명을 따라 권한을 다시 켜주세요.
          </p>
          <ul className="mb-2 list-inside list-disc text-xs text-gray-700">
            <li>
              <strong>Android Chrome:</strong> 주소창 오른쪽 ⋮ → 설정 → 알림 →
              알림 허용
            </li>
            <li>
              <strong>iOS Safari:</strong> 설정 앱 → Safari → 웹사이트 설정 →
              알림 → 허용
            </li>
          </ul>
          <p className="text-xs text-gray-500 italic">
            권한을 변경한 후 이 페이지를 새로고침 해주세요.
          </p>
        </div>
      ) : null}
    </article>
  );
}
