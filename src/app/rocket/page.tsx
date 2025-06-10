"use client";
import React, { useCallback, useEffect } from "react";
import ProductList from "@/src/components/ProductList";
import { rocketStore } from "@/src/store/rocketStore";

export default function RocketPage() {
  const {
    goldItems,
    rocketFreshItems,
    rocketItems,
    setGoldItems,
    setRocketFreshItems,
    setRocketItems,
  } = rocketStore();

  const initData = useCallback(async () => {
    if (goldItems.length === 0) {
      setGoldItems();
    }
    if (rocketFreshItems.length === 0) {
      setRocketFreshItems();
    }
    if (rocketItems.length === 0) {
      setRocketItems();
    }
  }, [
    goldItems,
    rocketFreshItems,
    rocketItems,
    setGoldItems,
    setRocketFreshItems,
    setRocketItems,
  ]);

  useEffect(() => {
    initData();
  }, [initData]);
  return (
    <article>
      <section className="mt-4 mb-8 flex justify-center">
        <div className="w-full max-w-[800px] px-4">
          <h2 className="font-heading text-md mb-4 scroll-m-20 border-none font-bold tracking-tight first:mt-0 sm:border-b">
            🔥 골드박스 특가
          </h2>
          <div className="min-h-[232px]">
            <ProductList items={goldItems} type="carousel" />
          </div>
        </div>
      </section>
      <section className="mt-4 mb-8 flex justify-center">
        <div className="w-full max-w-[800px] px-4">
          <h2 className="font-heading text-md mb-4 scroll-m-20 border-none font-bold tracking-tight first:mt-0 sm:border-b">
            🥬 로켓프레시
          </h2>
          <div className="min-h-[232px]">
            <ProductList items={rocketFreshItems} type="carousel" />
          </div>
        </div>
      </section>
      <section className="mt-4 mb-24 flex justify-center">
        <div className="w-full max-w-[800px] px-4">
          <h2 className="font-heading text-md mb-4 scroll-m-20 border-none font-bold tracking-tight first:mt-0 sm:border-b">
            🚀 로켓배송
          </h2>
          <div className="min-h-[232px]">
            <ProductList items={rocketItems} type="carousel" />
          </div>
        </div>
      </section>
    </article>
  );
}
