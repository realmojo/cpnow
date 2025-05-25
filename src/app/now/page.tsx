"use client";
import React from "react";
import RecentlyDiscountedProducts from "@/src/components/home/RecentlyDiscountedProducts";
export default function NowPage() {
  return (
    <article>
      <section className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
        <RecentlyDiscountedProducts />
        {/* <CategoryProductSection fisrtCategories={fisrtCategories} /> */}
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
