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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initData = async (keyword: string) => {
    try {
      setIsLoading(true);
      const items = await getProductsByKeyword(decodeURIComponent(keyword));
      setItems(items);
    } finally {
      setIsLoading(false);
    }
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
    <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-4">
      {/* 정렬 셀렉트 박스 */}
      <div className="mb-0 flex justify-end">
        <select
          className="rounded-md border py-2 text-sm"
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <svg
                  className="mb-4 h-12 w-12 animate-spin text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <p className="text-sm">상품을 불러오는 중입니다...</p>
              </div>
            ) : sortedItems?.length ? (
              <ProductList items={sortedItems} type="list" />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 h-16 w-16 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1m0 4v10a2 2 0 002 2h14a2 2 0 002-2V8m0-4V3m-2 1H5m6 4v6m0 0l-2-2m2 2l2-2"
                  />
                </svg>
                <p className="text-lg font-semibold">상품이 없습니다</p>
                <p className="mt-2 text-sm text-gray-400">
                  조건에 맞는 상품을 찾지 못했어요.
                  <br />
                  필터를 변경하거나 다시 시도해 보세요.
                </p>
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
