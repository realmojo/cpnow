"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

const categories = [
  { id: "464982", name: "전체" },
  { id: "1001", name: "상의" },
  { id: "1002", name: "하의" },
  { id: "1003", name: "신발" },
  { id: "1004", name: "아우터" },
  { id: "1005", name: "모자/악세서리" },
  { id: "1006", name: "모자/악세서리" },
  { id: "1007", name: "모자/악세서리" },
  { id: "1008", name: "모자/악세서리" },
  { id: "1009", name: "모자/악세서리" },
  { id: "1010", name: "모자/악세서리" },
];
// getCategoryByDepth1.php;
type CategoryButtonsProps = {
  categoryId: string;
};

// ✅ 실제 API 호출 함수
async function getCategoryByCategoryId(id: string): Promise<any | null> {
  console.log(id);
  const res = await fetch(`/api/category/sub?categoryId=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function CategoryButtons({ categoryId }: CategoryButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("category") || String(categoryId); // 또는 fallback

  const [categoryButtons, setCategoryButtons] = useState<any>([]);
  const handleClick = (id: string) => {
    router.push(`?category=${id}`);
  };

  const initData = async (selectedId: string) => {
    const data = await getCategoryByCategoryId(selectedId);
    console.log(data);
    setCategoryButtons(data);
  };

  useEffect(() => {
    initData(selectedId);
  }, [selectedId]);

  return (
    <div className="flex flex-wrap gap-2 pb-6">
      {categoryButtons.length &&
        categoryButtons.map((item: any) => (
          <Button
            key={item.categoryId}
            variant="outline"
            onClick={() => handleClick(item.categoryId)}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium transition-all",
              selectedId === item.categoryId
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.depth2}
          </Button>
        ))}
    </div>
  );
}
