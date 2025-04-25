// "use client";
// import React, { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ProductList from "../components/ProductList";
// import { fisrtCategories } from "@/utils/utils";

// // ✅ 실제 API 호출 함수
// async function getRandomProductsByCategoryId(
//   categoryId: number,
// ): Promise<any | null> {
//   const res = await fetch(
//     `/api/category?categoryId=${categoryId}&isRandom=true`,
//     {
//       cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
//     },
//   );

//   if (!res.ok) return null;

//   const data = await res.json();
//   return data;
// }

// export default function Home() {
//   const [category, setCategory] = useState<string | null>(null);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [randomProducts, setRendomProducts] = useState<any>([]);
//   const [loading, setLoading] = useState(false);

//   const getSubCategoryProdutItems = async ({
//     categoryId,
//     name,
//   }: {
//     categoryId: number;
//     name: string;
//   }) => {
//     try {
//       setLoading(true);
//       setSelected(categoryId);
//       setCategory(name);

//       const { items } = await getRandomProductsByCategoryId(categoryId);
//       const reItems = items.map((item: any) => {
//         const price = item.price || 0;
//         const prevPrice = item.lowPrice ?? price;

//         const discountRate = prevPrice
//           ? Math.round(((prevPrice - price) / prevPrice) * 100)
//           : 0;

//         const isDiscounted = discountRate > 0;
//         const isIncreased = discountRate < 0;

//         return {
//           ...item,
//           isDiscounted,
//           isIncreased,
//           discountRate,
//         };
//       });
//       setRendomProducts(reItems);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <React.Fragment>
//       <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-10">
//         {/* Hero Section */}
//         <section className="text-center">
//           <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
//             지금 이 순간 <br className="block sm:hidden" />
//             가장 똑똑하게 소비하는 방법
//           </h1>

//           {/* 🔍 검색 바: 추후 활성화 */}
//           {/*
//           <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
//             <Input
//               type="text"
//               placeholder="찾고 싶은 상품은?"
//               className="w-full"
//             />
//             <Button size="icon" className="w-full sm:w-auto">
//               <Search />
//             </Button>
//           </div>
//           */}

//           {/* 카테고리 버튼 */}
//           <div className="mt-6 flex flex-wrap justify-center gap-2">
//             {fisrtCategories.map((cat) => (
//               <Button
//                 key={cat.categoryId}
//                 variant={selected === cat.categoryId ? "default" : "outline"}
//                 onClick={() => getSubCategoryProdutItems(cat)}
//                 className="rounded-2xl px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
//               >
//                 {cat.name}
//               </Button>
//             ))}
//           </div>
//         </section>

//         {/* 상품 리스트 섹션 */}
//         <article>
//           <section className="flex justify-center">
//             <div className="w-full max-w-[800px]">
//               <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
//                 {category}
//               </h2>
//               <ProductList items={randomProducts} />
//             </div>
//           </section>
//         </article>
//       </main>

//       {/* 전체화면 로딩 오버레이 */}
//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <Loader2 className="h-10 w-10 animate-spin text-white" />
//         </div>
//       )}
//     </React.Fragment>
//   );
// }

import { fisrtCategories } from "@/utils/utils";
import CategoryProductSection from "../components/home/CategoryProductSection";

// ✅ 서버사이드 상품 불러오기 함수
async function getRandomProductsByCategoryId(
  categoryId: number,
): Promise<any[] | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/category?categoryId=${categoryId}&isRandom=true`,
      { cache: "no-store" },
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
}

// ✅ 기본 카테고리 ID 하나로 예시 구성
const defaultCategory = fisrtCategories[0];
export default async function Home() {
  const randomProducts = await getRandomProductsByCategoryId(
    defaultCategory.categoryId,
  );

  return (
    <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-10">
      <section className="text-center">
        <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
          지금 이 순간 <br className="block sm:hidden" />
          가장 똑똑하게 소비하는 방법
        </h1>
      </section>

      <CategoryProductSection
        fisrtCategories={fisrtCategories}
        defaultCategory={defaultCategory}
        randomProducts={randomProducts}
      />
    </main>
  );
}
