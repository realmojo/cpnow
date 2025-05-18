import { fisrtCategories } from "@/utils/utils";
import CategoryProductSection from "@/src/components/home/CategoryProductSection";
import RecentlyDiscountedProducts from "@/src/components/home/RecentlyDiscountedProducts";
// ✅ 기본 카테고리 ID 하나로 예시 구성
export default async function Home() {
  return (
    <main className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
      <section className="text-center">
        <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
          지금 이 순간 <br className="block sm:hidden" />
          가장 똑똑하게 소비하는 방법
        </h1>
      </section>
      <RecentlyDiscountedProducts />
      <CategoryProductSection fisrtCategories={fisrtCategories} />
    </main>
  );
}
