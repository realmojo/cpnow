"use client";
import React, { useState, Suspense, useEffect } from "react";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductList from "@/src/components/ProductList";

interface Category {
  categoryId: number;
  name: string;
}

interface Props {
  fisrtCategories: Category[];
}

// ✅ 서버사이드 상품 불러오기 함수
const getRandomProductsByCategoryId = async (
  categoryId: number,
): Promise<any[] | null> => {
  try {
    const res = await fetch(
      `/api/category?categoryId=${categoryId}&isRandom=true`,
    );
    if (!res.ok) return null;
    const { items } = await res.json();

    return items.map((item: any) => {
      const price = item.price || 0;
      const prevPrice = item.lowPrice ?? price;
      const discountRate = prevPrice
        ? Math.round(((prevPrice - price) / prevPrice) * 100)
        : 0;

      return {
        ...item,
        isDiscounted: discountRate > 0,
        isIncreased: discountRate < 0,
        discountRate,
      };
    });
  } catch (e) {
    console.error("[ERROR] fetching products:", e);
    return null;
  }
};

export default function CategoryProductSection({ fisrtCategories }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [randomProducts, setRandomProducts] = useState<any>([]);
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

      localStorage.setItem("preferred-category", categoryId.toString());

      const items: any = await getRandomProductsByCategoryId(categoryId);
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
      setRandomProducts(reItems);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCategoryId = localStorage.getItem("preferred-category");
    const found = fisrtCategories.find(
      (cat) => cat.categoryId === Number(storedCategoryId),
    );

    let defaultCategory = fisrtCategories[0];
    if (found) {
      defaultCategory = found;
    }

    setSelected(defaultCategory.categoryId);
    getSubCategoryProdutItems(defaultCategory);
  }, [fisrtCategories]);

  return (
    <article className="mt-6">
      {/* 카테고리 버튼 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {fisrtCategories.map((cat) => (
          <Button
            key={cat.categoryId}
            variant={selected === cat.categoryId ? "default" : "outline"}
            className="rounded-2xl px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
            onClick={() => getSubCategoryProdutItems(cat)}
            title={cat.name}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <section className="flex justify-center">
        <div className="w-full max-w-[800px]">
          <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
            {category ? category : ""}
          </h2>
          <Suspense fallback={<div>로딩 중...</div>}>
            <ProductList items={randomProducts ?? []} />
          </Suspense>
        </div>
      </section>
      {/* 전체화면 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </article>
  );
}
