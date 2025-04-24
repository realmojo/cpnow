"use client";
// import { useState } from "react";
// import { Search } from "lucide-react";
import { Loader2 } from "lucide-react";

// import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryBadge from "../components/DeliveryBadge";

// ✅ 실제 API 호출 함수
async function getRandomProductsByCategoryId(
  categoryId: number,
): Promise<any | null> {
  const res = await fetch(
    `/api/category?categoryId=${categoryId}&isRandom=true`,
    {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function Home() {
  const categories = [
    {
      categoryId: 564653,
      name: "패션의류/잡화",
    },
    {
      categoryId: 176522,
      name: "뷰티",
    },
    {
      categoryId: 221934,
      name: "출산/유아동",
    },
    {
      categoryId: 194276,
      name: "식품",
    },
    {
      categoryId: 185669,
      name: "주방용품",
    },
    {
      categoryId: 115673,
      name: "생활용품",
    },
    {
      categoryId: 184555,
      name: "홈인테리어",
    },
    {
      categoryId: 178255,
      name: "가전디지털",
    },
    {
      categoryId: 317778,
      name: "스포츠/레저",
    },
    {
      categoryId: 184060,
      name: "자동차용품",
    },
    {
      categoryId: 317777,
      name: "도서/음반/DVD",
    },
    {
      categoryId: 317779,
      name: "완구/취미",
    },
    {
      categoryId: 177295,
      name: "문구/오피스",
    },
    {
      categoryId: 115674,
      name: "반려동물용품",
    },
    {
      categoryId: 305798,
      name: "헬스/건강식품",
    },
  ];
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [randomProducts, setRendomProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getSubCategoryProdutItems = async ({
    categoryId,
    name,
  }: {
    categoryId: number;
    name: string;
  }) => {
    try {
      setLoading(true);
      setSelected(categoryId);
      setCategory(name);

      const items = await getRandomProductsByCategoryId(categoryId);
      const reItems = items.map((item: any) => {
        const price = item.price || 0;
        const prevPrice = item.lowPrice ?? price;

        const discountRate = prevPrice
          ? Math.round(((prevPrice - price) / prevPrice) * 100)
          : 0;

        const isDiscounted = discountRate > 0;
        const isIncreased = discountRate < 0;

        return {
          ...item,
          isDiscounted,
          isIncreased,
          discountRate,
        };
      });
      setRendomProducts(reItems);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[800px] px-4 py-10">
        <h1 className="text-center text-2xl leading-snug font-bold sm:text-3xl">
          지금 이 순간
          <br className="block sm:hidden" />
          가장 똑똑하게 소비하는 방법
        </h1>

        {/* <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
          <Input
            type="text"
            placeholder="찾고 싶은 상품은?"
            className="w-full"
          />
          <Button size="icon" className="w-full sm:w-auto">
            <Search />
          </Button>
        </div> */}

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.categoryId}
              variant={selected === cat.categoryId ? "default" : "outline"}
              onClick={() => getSubCategoryProdutItems(cat)}
              className="rounded-2xl px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <article className="container mx-auto py-10">
          <section className="flex justify-center py-10">
            <div className="mx-auto w-full max-w-[800px]">
              <h2 className="font-heading mt-16 scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0">
                {category}
              </h2>

              {/* <CategoryTabs categoryId={id} /> */}

              <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
                {randomProducts.map((item: any) => (
                  <div key={item.id}>
                    {/* <Link href={`/product/${idx + 1}`} className="block transition"> */}
                    <Card className="overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md">
                      <Link href={`/product/${item.id}`}>
                        {/* 이미지 */}
                        <CardHeader className="p-0">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={400}
                            height={400}
                            className="aspect-square w-full object-cover"
                            placeholder="blur"
                            blurDataURL="/placeholder.png"
                          />
                        </CardHeader>

                        {/* 내용 */}
                        <CardContent className="space-y-2 p-4">
                          {/* 상품명 */}
                          <CardTitle className="line-clamp-2 min-h-[3.5rem] text-sm leading-snug font-medium text-gray-800">
                            {item.title}
                          </CardTitle>

                          {/* 가격/할인 */}
                          <div className="text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              {item.isDiscounted || item.isIncreased ? (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                    item.isDiscounted
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {item.isDiscounted ? "▲" : "▼"}{" "}
                                  {Math.abs(item.discountRate)}%
                                </span>
                              ) : (
                                // 🔥 할인 없음 상태 표시
                                <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-400">
                                  할인 없음
                                </span>
                              )}
                              <div className="text-lg font-bold text-black">
                                {item.price.toLocaleString()}원
                              </div>
                            </div>
                          </div>

                          {/* 배송/도착 정보 */}
                          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                            <DeliveryBadge deliveryType={item.deliveryType} />
                            {/* <span>오늘 도착 보장</span> */}
                          </div>

                          {/* 무료배송 안내 */}
                          {/* <div className="text-sm text-gray-600">
                            무료배송 ∙ 무료반품
                          </div> */}

                          {/* 별점 */}
                          <div className="flex items-center text-sm">
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
                            <span className="ml-1 text-xs text-gray-600">
                              {item.reviewCount
                                ? `(${item.reviewCount.toLocaleString()}`
                                : null}
                            </span>
                          </div>
                          {/* 적립 혜택 */}
                          {/* <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Image
                              src="https://image6.coupangcdn.com/image/badges/cashback/web/list-cash-icon@2x.png"
                              alt="캐시백"
                              width={18}
                              height={18}
                            />
                            <span>최대 58원 적립</span>
                          </div> */}
                        </CardContent>
                      </Link>
                    </Card>
                    {/* </Link> */}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </article>
      </div>
      {/* 전체화면 오버레이 로딩 */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
