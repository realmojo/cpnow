"use client";
import { use, useState, useEffect, useMemo } from "react";
import ProductList from "@/src/components/ProductList";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Category = {
  categoryId: number;
  parentId: number | null;
  name: string;
  depth: number;
};

interface RandomCategoryButtonsProps {
  categories: Category[];
}

const RandomCategoryButtons = ({ categories }: RandomCategoryButtonsProps) => {
  const randomCategories = useMemo(() => {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [categories]);

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {randomCategories.map((cat) => (
        <Button
          asChild
          key={cat.categoryId}
          variant="outline"
          className="rounded-full px-4 py-2 text-sm"
        >
          <Link href={`/categories/${cat.categoryId}`}>{cat.name}</Link>
        </Button>
      ))}
    </div>
  );
};

// ✅ 상품 카테고리 랜덤호출 함수
async function getProductListByCategoryId(
  categoryId: number,
): Promise<any | null> {
  const res = await fetch(
    `/api/category?categoryId=${categoryId}&withCategory=true`,
    {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    },
  );

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
  const [items, setItems] = useState<any[]>([]);
  const [categoriesItems, setCategoriesItems] = useState<any[]>([]);

  const initData = async (categoryId: number) => {
    const { categories, items } = await getProductListByCategoryId(categoryId);
    setCategoriesItems(categories);
    setItems(items);
  };

  useEffect(() => {
    initData(Number(id));
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-10">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
          {/* {category} */}
          {Array.isArray(items) && items.length > 0 && items[0].category}
        </h1>

        {Array.isArray(categoriesItems) && categoriesItems.length > 0 ? (
          <RandomCategoryButtons categories={categoriesItems} />
        ) : null}
      </section>

      {/* 상품 리스트 섹션 */}
      <article>
        <section className="flex justify-center">
          <div className="w-full max-w-[800px]">
            {/* <h2 className="scroll-m-20 text-2xl font-bold tracking-tight"></h2> */}
            <ProductList items={items} />
          </div>
        </section>
      </article>
    </main>
  );
}
