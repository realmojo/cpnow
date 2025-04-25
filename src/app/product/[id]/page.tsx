"use client";
import Image from "next/image";
import { use, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import DeliveryBadge from "@/src/components/DeliveryBadge";
import { getUserAuth } from "@/utils/utils";
import ProductList from "@/src/components/ProductList";
import PriceLineChart from "@/src/components/PriceLineChart";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import NotificationButton from "@/src/components/Notification";

// ✅ 상품 카테고리 랜덤호출 함수
async function getProductListByCategoryId(
  categoryId: number,
): Promise<any | null> {
  const res = await fetch(`/api/category?categoryId=${categoryId}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

// ✅ 상품 호출 함수
async function getProductById(id: string): Promise<any | null> {
  const res = await fetch(`/api/product?id=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

// ✅ 알람등록
async function addAlarm(params: any): Promise<any | null> {
  const response = await fetch("/api/alarm", {
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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ 이렇게 unwrapping 필요
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const [productItem, setProductItem] = useState<any>({});
  const [categoryId, setCategoryId] = useState<number>(0);
  const [similarProductsItems, setSimilarProductsItems] = useState<any[]>([]);

  const handleNotify = async (id: number) => {
    const userInfo = await getUserAuth();
    const params = {
      userId: userInfo.userId,
      productId: id,
    };

    await addAlarm(params);

    toast("최저가 알림받기가 설정되었습니다.", {
      description: "ggg",
    });
  };

  const initData = async (id: string) => {
    const data = await getProductById(id);
    setProductItem(data);
    setCategoryId(data.categoryId);
  };

  const formatNumber = (num: number | string): string => {
    return num ? Number(num).toLocaleString("ko-KR") : "0";
  };
  const calculateDiscountRate = (
    originalPrice: number,
    salePrice: number,
  ): number => {
    if (originalPrice <= 0) return 0; // 0원 이상이어야 나눗셈 가능
    const discount = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(discount); // 정수 반올림
  };

  const getShortUrl = (item: any) => {
    const { shortUrl, link } = item;
    if (shortUrl && shortUrl.startsWith("https")) {
      return shortUrl;
    } else {
      return link;
    }
  };

  useEffect(() => {
    initData(id);
  }, [id]);

  useEffect(() => {
    if (categoryId) {
      const currentTarget = targetRef.current;
      if (!currentTarget) return;

      const observer = new IntersectionObserver(
        async (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !isFetched) {
            try {
              if (categoryId) {
                const data = await getProductListByCategoryId(categoryId);
                setSimilarProductsItems(data);
              }
              setIsFetched(true); // 다시 호출되지 않게 막기
            } catch (error) {
              console.error("API 호출 실패:", error);
            }
          }
        },
        {
          threshold: 0.1, // 10% 정도 보이면 트리거
        },
      );

      observer.observe(currentTarget);

      return () => {
        observer.unobserve(currentTarget);
      };
    }
  }, [isFetched, categoryId]);

  return (
    <article>
      {/* <NotificationButton /> */}
      <section className="flex justify-center py-10">
        <div className="mx-auto w-full max-w-[800px] px-4">
          <h2 className="font-heading flex scroll-m-20 justify-between pb-4 text-2xl font-bold tracking-tight first:mt-0">
            상품정보
            <div className="mt-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      {productItem.bigCategory ?? ""}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <BreadcrumbLink
                        href={`/categories/${productItem.categoryId}`}
                      >
                        {productItem.category ?? ""}
                      </BreadcrumbLink>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </h2>
          <div className="flex flex-col items-stretch overflow-hidden rounded-lg bg-white sm:flex-row">
            <div className="flex items-center justify-center sm:flex-[3]">
              <Image
                src={
                  productItem.thumbnail ||
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                }
                alt={productItem.title ?? ""}
                width={400}
                height={400}
                className="h-auto w-full rounded-md object-contain sm:w-[400px]"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                priority
              />
            </div>

            <div className="flex flex-col justify-center bg-white sm:flex-[4] sm:pl-8">
              <table className="w-full border-collapse text-base">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <th className="w-[120px] p-3 text-left font-bold text-gray-700">
                      상품명
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      {productItem.title ?? ""}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      할인율
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      {calculateDiscountRate(
                        productItem.price,
                        productItem.lowPrice ?? productItem.price,
                      ) || 0}
                      %
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      최저가
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      {productItem.lowPrice === -1
                        ? "품절"
                        : formatNumber(
                            productItem.lowPrice ?? productItem.price,
                          )}
                      원
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      최고가
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      {formatNumber(productItem.highPrice ?? productItem.price)}
                      원
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      현재가
                    </th>
                    <td className="p-3 text-lg font-bold text-red-600">
                      {formatNumber(productItem.price)}원
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      로켓배송
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      <DeliveryBadge deliveryType={productItem.deliveryType} />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-left font-bold text-gray-700">
                      평점(리뷰 수)
                    </th>
                    <td className="p-3 text-lg text-gray-800">
                      <div className="flex space-x-[1px]">
                        <div className="flex items-center text-sm">
                          <div className="flex space-x-[1px]">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const fill =
                                i + 1 <= Math.floor(productItem.rating ?? 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : i < (productItem.rating ?? 0)
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

                          <span className="ml-1 text-xs text-gray-600">
                            (
                            {productItem.reviewCount
                              ? productItem.reviewCount.toLocaleString()
                              : 0}
                            )
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-lg text-gray-800">
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="secondary"
                          className="h-14 flex-1 px-0"
                          size="lg"
                        >
                          <a
                            href={getShortUrl(productItem)}
                            target="_blank"
                            className="flex h-full w-full items-center justify-center text-center"
                          >
                            구매하기
                          </a>
                        </Button>
                        <Button
                          className="h-14 flex-1 px-0"
                          size="lg"
                          onClick={() => handleNotify(productItem.id)}
                        >
                          알람받기
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
            가격추이
          </h2>

          <PriceLineChart />
        </div>
      </section>
      {/* <section className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
            최근 최저가 변경 상품
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 8 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Link
                      href={`/product/3`}
                      className="block transition hover:shadow-xl"
                    >
                      <Card className="border-none bg-transparent shadow-none">
                        <CardHeader className="p-0">
                          <Image
                            src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/vendor_inventory/d21e/7a9b3ba07a64bf5fcd699da80ae058a5b6ccc192253b634b46d0a87edb6f.jpg"
                            alt="샘플 이미지"
                            width={200}
                            height={200}
                            className="aspect-square w-full rounded-t-md object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                            priority
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="mb-1 text-base font-bold">
                            상품명 또는 제목
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            간단한 상품 설명 또는 소개 문구가 여기에 표시됩니다.
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section> */}
      <section className="mt-16 flex justify-center" ref={targetRef}>
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
            비슷한 상품 추천
          </h2>

          <ProductList items={similarProductsItems} />
        </div>
      </section>
    </article>
  );
}
