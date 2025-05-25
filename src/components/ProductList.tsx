import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
export default function ProductList({ items = [], type = "grid" }: any) {
  const [productItems, setProductItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState<any>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = (item: any) => {
    setItem(item);
    timerRef.current = setTimeout(() => {
      setShowModal(true);
    }, 1000); // 2초간 누르면 모달 표시
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onDelete = async (id: string | number) => {
    const authStr = localStorage.getItem("cpnow-auth");
    if (!authStr) return;

    const { userId } = JSON.parse(authStr);

    if (userId && id) {
      const res = await fetch(`/api/alarm/delete?userId=${userId}&pId=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const filteredItems = productItems.filter(
          (item: any) => item.id !== id,
        );
        setProductItems(filteredItems);
      }
    }
  };

  useEffect(() => {
    setProductItems(items);
  }, [items]);

  return (
    <>
      {type === "grid" ? (
        <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
          {Array.isArray(productItems) &&
            productItems.length > 0 &&
            productItems.map((item: any) => (
              <div key={item.id}>
                <Card className="overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md">
                  <Link href={`/product/${item.id}`}>
                    <CardHeader className="p-0">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={400}
                        height={400}
                        className="aspect-square w-full object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                      />
                    </CardHeader>

                    <CardContent className="space-y-2 p-4">
                      <CardTitle className="line-clamp-2 min-h-[3.5rem] text-sm leading-snug font-medium text-gray-800">
                        {item.title}
                      </CardTitle>

                      <div className="text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-black">
                            {item.price.toLocaleString()}원
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        <ComparePriceDetail
                          price={item.price}
                          highPrice={item.highPrice ?? item.price}
                          lowPrice={item.lowPrice ?? item.price}
                          isVisible={false}
                        />
                        {item.deliveryType && (
                          <DeliveryBadge deliveryType={item.deliveryType} />
                        )}
                      </div>

                      <div className="flex items-center text-sm">
                        {item.rating ? (
                          <div className="flex space-x-[1px]">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const fill =
                                i + 1 <= Math.floor(item.rating ?? 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : i < (item.rating ?? 0)
                                    ? "fill-yellow-400 text-gray-300"
                                    : "fill-gray-300 text-gray-300";

                              return (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className={`h-4 w-4 ${fill}`}
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              );
                            })}
                          </div>
                        ) : null}

                        {item.reviewCount ? (
                          <span className="ml-1 text-xs text-gray-600">
                            ({item.reviewCount.toLocaleString()})
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            ))}
        </div>
      ) : (
        <div className="divide-border-300 flex flex-col divide-y">
          <AlertDialog open={showModal} onOpenChange={setShowModal}>
            {Array.isArray(productItems) &&
              productItems.length > 0 &&
              productItems.map((item: any) => (
                <div key={item.id}>
                  <Card
                    className="relative flex flex-col items-start gap-4 rounded-none border-0 bg-transparent px-2 py-4 shadow-none ring-0 hover:bg-transparent sm:flex-row"
                    onMouseDown={() => handleMouseDown(item)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={() => handleMouseDown(item)}
                    onTouchEnd={handleMouseUp}
                  >
                    <Link href={`/product/${item.id}`} className="flex w-full">
                      <div className="w-28 shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={112}
                          height={112}
                          className="aspect-square h-28 w-28 rounded-lg object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between px-4 py-1">
                        <CardTitle className="mb-2 line-clamp-2 text-sm leading-snug font-medium text-gray-800">
                          {item.title}
                        </CardTitle>

                        <div className="text-sm text-gray-700">
                          <div className="mb-1 flex items-center gap-2">
                            <div className="text-base font-bold text-black">
                              {item.price.toLocaleString()}원
                            </div>
                            <div>
                              <ComparePriceDetail
                                price={item.price}
                                highPrice={item.highPrice ?? item.price}
                                lowPrice={item.lowPrice ?? item.price}
                                isVisible={false}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                            {item.deliveryType && (
                              <DeliveryBadge deliveryType={item.deliveryType} />
                            )}
                          </div>

                          <div className="mt-1 flex items-center text-sm">
                            {item.rating ? (
                              <div className="flex space-x-[1px]">
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const fill =
                                    i + 1 <= Math.floor(item.rating ?? 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : i < (item.rating ?? 0)
                                        ? "fill-yellow-400 text-gray-300"
                                        : "fill-gray-300 text-gray-300";

                                  return (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className={`h-4 w-4 ${fill}`}
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  );
                                })}
                              </div>
                            ) : null}

                            {item.reviewCount ? (
                              <span className="ml-1 text-xs text-gray-600">
                                ({item.reviewCount.toLocaleString()})
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
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
      )}
    </>
  );
}
