"use client";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import CategoryTabs from "@/src/components/CategoryButton";

// ✅ 실제 API 호출 함수
async function getCategoryById(id: string): Promise<any | null> {
  const res = await fetch(`/api/category?categoryId=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ 이렇게 unwrapping 필요
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_categoryItem, setCategoryItem] = useState<any>([]);

  const initData = async (id: string) => {
    const data = await getCategoryById(id);
    // console.log(data);
    setCategoryItem(data);
  };

  useEffect(() => {
    initData(id);
  }, [id]);

  return (
    <article className="container mx-auto py-10">
      <section className="flex justify-center py-10">
        <div className="mx-auto w-full max-w-[800px]">
          <h2 className="font-heading mt-16 scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0">
            유아동 패션
          </h2>

          {/* <CategoryTabs categoryId={id} /> */}

          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div key={idx}>
                {/* <Link href={`/product/${idx + 1}`} className="block transition"> */}
                <Card className="overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md">
                  <Link href={`/product/${idx}`}>
                    {/* 이미지 */}
                    <CardHeader className="p-0">
                      <Image
                        src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/retail/images/2024/02/01/18/3/df08e36e-9eec-4c23-9ff7-b210932dff8f.png"
                        alt="디펜드 여성용 스타일 참숯 패드"
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
                      <CardTitle className="line-clamp-2 text-sm font-medium text-gray-800">
                        디펜드 여성용 스타일 참숯 패드, 중형, 24개입, 1개
                      </CardTitle>

                      {/* 가격/할인 */}
                      <div className="text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              15 < 0
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {15 < 0 ? "▼" : "▲"} {Math.abs(15)}%
                          </span>
                          <div className="text-lg font-bold text-black">
                            {"23,333".toLocaleString()}원
                          </div>
                        </div>
                      </div>

                      {/* 배송/도착 정보 */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        <Image
                          src="https://image8.coupangcdn.com/image/badges/falcon/v1/web/rocketwow-bi-16@2x.png"
                          alt="로켓배송"
                          width={70}
                          height={16}
                        />
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
                              i + 1 <= Math.floor(4.5)
                                ? "fill-yellow-400 text-yellow-400"
                                : i < 4.5
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
                          ({"3,333".toLocaleString()})
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
  );
}
