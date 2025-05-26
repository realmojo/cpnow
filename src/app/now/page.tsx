"use client";
import React from "react";
import RecentlyDiscountedProducts from "@/src/components/home/RecentlyDiscountedProducts";
export default function NowPage() {
  return (
    <article>
      <section className="mt-4 mb-24 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
            지금 가격이 바뀐 상품
          </h2>
          <RecentlyDiscountedProducts />
        </div>
      </section>
    </article>
  );
}
// ✅ 기본 카테고리 ID 하나로 예시 구성
// export default async function Home() {
//   return (
//     <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
//       {/* <RecentlyDiscountedProducts />
//       <CategoryProductSection fisrtCategories={fisrtCategories} /> */}
//     </main>
//   );
// }
