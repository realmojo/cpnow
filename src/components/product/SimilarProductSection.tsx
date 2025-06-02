"use client";

import { useEffect, useRef, useState } from "react";
import ProductList from "@/src/components/ProductList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  categoryId: number;
  setId: (id: string) => void;
};

export default function SimilarProductSection({ categoryId, setId }: Props) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [similarProductsItems, setSimilarProductsItems] = useState<any[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!categoryId || isFetched) return;

    const currentTarget = targetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          try {
            setIsLoading(true);
            const res = await fetch(`/api/category?categoryId=${categoryId}`, {
              cache: "no-store",
            });

            if (!res.ok) throw new Error("API 오류");

            const data = await res.json();
            setSimilarProductsItems(data.items || []);
            setIsFetched(true);
          } catch (error) {
            console.error("비슷한 상품 API 호출 실패:", error);
            setHasError(true);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(currentTarget);
    return () => observer.unobserve(currentTarget);
  }, [categoryId, isFetched]);

  return (
    <section className="mt-16 flex justify-center" ref={targetRef}>
      <div className="w-[800px] px-4">
        <h2 className="font-heading scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
          비슷한 상품 추천
        </h2>

        {/* 로딩 중 표시 */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {hasError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>
              비슷한 상품을 불러오는 중 문제가 발생했습니다.
            </AlertDescription>
          </Alert>
        )}

        {/* 데이터 없음 */}
        {!isLoading &&
          isFetched &&
          similarProductsItems.length === 0 &&
          !hasError && (
            <p className="mt-4 text-center text-sm text-gray-500">
              비슷한 상품이 없습니다.
            </p>
          )}

        {/* 데이터 출력 */}
        {!isLoading && !hasError && similarProductsItems.length > 0 && (
          <ProductList
            items={similarProductsItems}
            setId={setId}
            isHash={true}
          />
        )}
      </div>
    </section>
  );
}
