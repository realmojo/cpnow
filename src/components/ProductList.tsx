import { useState, useRef, useEffect, Fragment } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserAuth, isDesktopBrowser } from "@/utils/utils"; // 클라이언트에서 작동해야 함
import { addAlarm, removeAlarm } from "@/utils/api"; // 공통 api
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAppStore } from "@/src/store/useAppStore";
import DeliveryBadge from "./DeliveryBadge"; // 배달 타입 배지 컴포넌트

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ComparePriceDetail } from "./product/ComparePriceDetail";
import { BellOffIcon, BellIcon, ChevronRight, ChevronLeft } from "lucide-react";

type Props = {
  items: any;
  type?: string;
  isHash?: boolean;
  setId?: (id: string) => void;
  isOption?: boolean;
};

export default function ProductList({
  items = [],
  type = "grid",
  isHash = false,
  setId,
  isOption = false,
}: Props) {
  const [parentId, setParentId] = useState<number | null>(0); // 현재 옵션 용도 체크
  const { myAlarmList, setMyAlarmList } = useAppStore();
  const [productItems, setProductItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState<any>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.9; // 90% 만큼 자연스럽게 이동
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (item: any) => {
    if (location.href.includes("mynow")) {
      setItem(item);
      timerRef.current = setTimeout(() => {
        setShowModal(true);
      }, 700); // 2초간 누르면 모달 표시
    }
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onDelete = async (id: string | number) => {
    const authStr = localStorage.getItem("cpnow-auth");
    if (!authStr) return;

    const { userId } = JSON.parse(authStr);

    if (userId && id) {
      const res = await fetch(
        `/api/userAlarm/delete?userId=${userId}&pId=${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        const filteredItems = productItems.filter(
          (item: any) => item.id !== id,
        );
        setProductItems(filteredItems);
      }
    }
  };

  const handleNotify = async (item: any) => {
    try {
      const isAlarmed = myAlarmList.some((alarm: any) => alarm.id === item.id);

      const auth = await getUserAuth();
      const params = {
        userId: auth.userId,
        pId: item.id,
      };

      if (isAlarmed) {
        // ✅ 알림 취소 로직
        await removeAlarm(params);

        // 상태에서 해당 항목 제거
        const updatedList = myAlarmList.filter(
          (alarm: any) => alarm.id !== item.id,
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
        setMyAlarmList(item);

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

  const gridCardContent = (item: any) => {
    return (
      <>
        <CardHeader className="p-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={300}
            height={300}
            className="aspect-square w-full object-cover"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
          />
        </CardHeader>
        <CardContent className="space-y-2 p-1">
          <DeliveryBadge deliveryType={item.deliveryType} />
          <CardTitle className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-normal text-gray-600">
            {item.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <span>{item?.price?.toLocaleString()}원</span>
            <ComparePriceDetail
              price={item.price}
              highPrice={item.highPrice ?? item.price}
              lowPrice={item.lowPrice ?? item.price}
              isVisible={false}
              isTextFull={false}
            />
          </div>
        </CardContent>
      </>
    );
  };

  const listCardContent = (item: any) => {
    const isAlarmed = myAlarmList.some((alarm: any) => alarm.id === item.id);
    return (
      <div className="flex w-full items-stretch">
        <div className="w-28 shrink-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={100}
            height={100}
            className="aspect-square rounded-lg object-cover"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
          />
        </div>

        <div className="flex flex-1 flex-col justify-between px-4 py-1">
          <div className="mb-2 flex items-center text-sm font-semibold text-green-600">
            {isOption && parentId === item.id ? (
              <div className="mr-2 text-xs text-gray-700">
                <div className="flex items-center">
                  <div className="text-base font-bold text-blue-500">
                    현재 옵션
                  </div>
                </div>
              </div>
            ) : null}

            <DeliveryBadge deliveryType={item.deliveryType} />
          </div>

          <div className="text-sm text-gray-700">
            <div className="space-y-1">
              <CardTitle className="line-clamp-2 text-sm leading-snug font-normal text-gray-600">
                {item.title}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span>{item.price.toLocaleString()}원</span>
                <ComparePriceDetail
                  price={item.price}
                  highPrice={item.highPrice ?? item.price}
                  lowPrice={item.lowPrice ?? item.price}
                  isVisible={false}
                  isTextFull={false}
                />
              </div>
            </div>
          </div>
        </div>
        {isOption ? (
          <div className="ml-auto flex items-center justify-end">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation(); // 부모로의 이벤트 전파 중단
                try {
                  handleNotify(item);
                } catch (error) {
                  console.log(error);
                } finally {
                }
              }}
            >
              {isAlarmed ? (
                <BellOffIcon style={{ width: 14, height: 14 }} />
              ) : (
                <BellIcon style={{ width: 14, height: 14 }} />
              )}
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  const carouselCardContent = (item: any) => {
    return (
      <Card className="gap-0 overflow-hidden border-none bg-transparent py-0 shadow-none transition">
        <CardHeader className="p-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={100}
            height={100}
            className="aspect-square w-full object-cover"
          />
        </CardHeader>
        <CardContent className="space-y-2 p-1">
          <DeliveryBadge deliveryType={item.deliveryType} />
          <CardTitle className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-normal text-gray-600">
            {item.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <span>{item.price.toLocaleString()}원</span>
            <ComparePriceDetail
              price={item.price}
              highPrice={item.highPrice ?? item.price}
              lowPrice={item.lowPrice ?? item.price}
              isVisible={false}
              isTextFull={false}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    const originalId = location.href.split("/").pop();
    setProductItems(items);
    setParentId(Number(originalId));
  }, [items]);

  return (
    <>
      {type === "grid" ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {Array.isArray(productItems) &&
            productItems.length > 0 &&
            productItems.map((item: any) => (
              <Fragment key={item.id}>
                {isHash ? (
                  <Card
                    className="gap-0 overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md"
                    onClick={() => {
                      if (setId && isHash) {
                        setId(item.id);
                      }
                    }}
                  >
                    {gridCardContent(item)}
                  </Card>
                ) : (
                  <Link href={`/product/${item.id}`}>
                    <Card className="cursor-pointer gap-0 overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md">
                      {gridCardContent(item)}
                    </Card>
                  </Link>
                )}
              </Fragment>
            ))}
        </div>
      ) : type === "list" ? (
        <div className="divide-border-300 flex flex-col divide-y">
          <AlertDialog open={showModal} onOpenChange={setShowModal}>
            {Array.isArray(productItems) &&
              productItems.length > 0 &&
              productItems.map((item: any) => (
                <Fragment key={item.id}>
                  {isHash ? (
                    <Card
                      className="relative flex flex-row items-start gap-0 rounded-none border-0 bg-transparent px-2 py-4 shadow-none ring-0 hover:bg-transparent"
                      onClick={() => {
                        if (setId && isHash) {
                          setId(item.id);
                        }
                      }}
                    >
                      {listCardContent(item)}
                    </Card>
                  ) : (
                    <Link
                      href={`/product/${item.id}`}
                      className="flex w-full"
                      passHref
                    >
                      <Card
                        className="relative flex flex-row items-start gap-0 rounded-none border-0 bg-transparent px-2 py-4 shadow-none ring-0 hover:bg-transparent"
                        onMouseDown={() => handleMouseDown(item)}
                        onMouseUp={handleMouseUp}
                        onTouchStart={() => handleMouseDown(item)}
                        onTouchEnd={handleMouseUp}
                      >
                        {listCardContent(item)}
                      </Card>
                    </Link>
                  )}
                </Fragment>
              ))}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>선택한 알림을 삭제합니다</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>[{item.title}]</strong>
                  <br />
                  삭제 후 복구는 불가능합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 flex flex-row gap-2">
                <AlertDialogCancel className="w-1/2">취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(item.id);
                    setShowModal(false);
                  }}
                  className="w-1/2 bg-red-600 text-white hover:bg-red-700"
                >
                  삭제하기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : type === "carousel" ? (
        <div className="relative w-full">
          <div
            ref={containerRef}
            className="flex !snap-none gap-4 overflow-x-auto scroll-smooth px-1"
          >
            {items.length === 0 ? (
              <div className="flex min-h-[220px] space-x-4 overflow-x-auto">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[200px] w-[140px] animate-pulse bg-gray-200"
                  />
                ))}
              </div>
            ) : (
              items.map((item: any) => (
                <div
                  key={item.id}
                  className="max-w-[calc(100%/3)] min-w-[calc(100%/3)] flex-shrink-0"
                >
                  {item?.productUrl ? (
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {carouselCardContent(item)}
                    </a>
                  ) : (
                    <Link href={`/product/${item.id}`}>
                      {carouselCardContent(item)}
                    </Link>
                  )}
                </div>
              ))
            )}

            {isDesktopBrowser() ? (
              <>
                <Button
                  onClick={() => scrollByCards("left")}
                  className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white p-2 text-gray-700 shadow hover:!bg-white hover:!text-gray-700"
                  size="icon"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  onClick={() => scrollByCards("right")}
                  className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white p-2 text-gray-700 shadow hover:!bg-white hover:!text-gray-700"
                  size="icon"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
