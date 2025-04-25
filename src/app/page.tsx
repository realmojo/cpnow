"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductList from "../components/ProductList";

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

      const { items } = await getRandomProductsByCategoryId(categoryId);
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
    <React.Fragment>
      <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-10">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
            지금 이 순간 <br className="block sm:hidden" />
            가장 똑똑하게 소비하는 방법
          </h1>

          {/* 🔍 검색 바: 추후 활성화 */}
          {/* 
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
            <Input
              type="text"
              placeholder="찾고 싶은 상품은?"
              className="w-full"
            />
            <Button size="icon" className="w-full sm:w-auto">
              <Search />
            </Button>
          </div> 
          */}

          {/* 카테고리 버튼 */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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
        </section>

        {/* 상품 리스트 섹션 */}
        <article>
          <section className="flex justify-center">
            <div className="w-full max-w-[800px]">
              <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
                {category}
              </h2>
              <ProductList items={randomProducts} />
            </div>
          </section>
        </article>
      </main>

      {/* 전체화면 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </React.Fragment>
  );
}
