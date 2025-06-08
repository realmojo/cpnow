"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductList from "@/src/components/ProductList";
import { getProductsByKeyword } from "@/utils/api";

export default function SearchKeywordPage() {
  const [sortOption, setSortOption] = useState<"recommend" | "low" | "high">(
    "recommend",
  );

  const params = useParams();
  const { keyword } = params;

  const [items, setItems] = useState<any[]>([]);
  const initData = async (keyword: string) => {
    const items = await getProductsByKeyword(decodeURIComponent(keyword));
    setItems(items);
  };

  const sortedItems =
    sortOption === "recommend"
      ? items
      : [...items].sort((a, b) => {
          if (sortOption === "low") {
            return a.lowPrice - b.lowPrice;
          } else {
            return b.lowPrice - a.lowPrice;
          }
        });

  useEffect(() => {
    if (typeof keyword === "string" && keyword.trim() !== "") {
      initData(keyword);
    }
  }, [keyword]);

  return (
    <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
      {/* 정렬 셀렉트 박스 */}
      <div className="mb-0 flex justify-end">
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as "recommend" | "low" | "high")
          }
        >
          <option value="recommend">추천순</option>
          <option value="low">최저가순</option>
          <option value="high">최고가순</option>
        </select>
      </div>

      {/* 상품 리스트 섹션 */}
      <article>
        <section className="flex justify-center">
          <div className="w-full max-w-[800px]">
            <ProductList items={sortedItems ?? items} type="list" />
          </div>
        </section>
      </article>
    </main>
  );
}
