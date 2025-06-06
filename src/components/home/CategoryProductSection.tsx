"use client";
import React, { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductList from "@/src/components/ProductList";
import { fisrtCategories } from "@/utils/utils";
import { Soup } from "lucide-react";

interface Category {
  categoryId: number;
  name: string;
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
      const price = item.price ?? 0;
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

export default function CategoryProductSection() {
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [randomProducts, setRandomProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const getSubCategoryProdutItems = async ({ categoryId, name }: Category) => {
    try {
      setLoading(true);
      setSelected(categoryId);
      setCategory(name);

      localStorage.setItem("preferred-category", categoryId.toString());

      const items: any = await getRandomProductsByCategoryId(categoryId);
      const reItems = items.map((item: any) => {
        const price = item.price ?? 0;
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
  }, []);

  return (
    <article>
      <section className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
        {/* 카테고리 버튼 */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex h-[9rem] w-fit min-w-[600px] flex-wrap gap-2 sm:h-[11rem] sm:gap-3">
            {fisrtCategories.map((cat) => {
              const Icon = cat.icon || Soup;
              const isSelected = selected === cat.categoryId;

              return (
                <Button
                  key={cat.categoryId}
                  variant={isSelected ? "default" : "outline"}
                  className="flex h-16 w-20 flex-col items-center justify-center rounded-xl p-1 text-[10px] shadow-sm transition hover:shadow-md sm:h-20 sm:w-20 sm:p-2 sm:text-xs"
                  onClick={() => getSubCategoryProdutItems(cat)}
                  title={cat.name}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm whitespace-nowrap">{cat.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <section className="flex justify-center">
          <div className="w-full max-w-[800px]">
            <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
              {category ?? ""}
            </h2>
            <Suspense fallback={<div>로딩 중...</div>}>
              <ProductList items={randomProducts ?? []} />
            </Suspense>
          </div>
        </section>
        {/* 전체화면 로딩 오버레이 */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
