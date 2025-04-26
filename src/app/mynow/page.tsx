"use client";

import React, { useEffect, useState } from "react";
import ProductList from "@/src/components/ProductList";

// ✅ 상품 호출 함수
async function getProductByUserId(userId: string): Promise<any | null> {
  const res = await fetch(`/api/alarm/my?userId=${userId}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function LocalAuthViewer() {
  const [myProductsItems, setMyProductsItems] = useState<any[]>(null);

  const initData = async () => {
    const stored = localStorage.getItem("cpnow-auth");
    if (!stored) {
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed?.userId) {
      const data = await getProductByUserId(parsed.userId);
      setMyProductsItems(data);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <article>
      <section className="mt-8 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
            내 알람 리스트
          </h2>

          {myProductsItems === null ? (
            // ✅ 데이터 불러오는 중
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 animate-spin text-4xl">🔄</div>
              <p className="text-lg font-semibold text-gray-700">
                데이터를 불러오는 중입니다...
              </p>
            </div>
          ) : myProductsItems.length > 0 ? (
            // ✅ 데이터 있음
            <ProductList items={myProductsItems} />
          ) : (
            // ✅ 데이터 없음
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 text-4xl">🔔</div>
              <p className="text-lg font-semibold text-gray-700">
                아직 등록된 알람이 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                상품을 등록하고 가격 변동 알림을 받아보세요!
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
