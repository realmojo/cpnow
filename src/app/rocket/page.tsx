"use client";
import React, { useEffect, useState } from "react";
import { getGoldBox, getRocketItems } from "@/utils/api";
import ProductList from "@/src/components/ProductList";

export default function RocketPage() {
  const [goldItems, setGoldItems] = useState([]);
  const [freshItems, setFreshItems] = useState([]);
  const [rocketItems, setRocketItems] = useState([]);

  const initData = async () => {
    const goldList = await getGoldBox();
    setGoldItems(goldList.data);
    const freshList = await getRocketItems("rocket_fresh");
    setFreshItems(freshList);
    const rocketList = await getRocketItems("rocket");
    setRocketItems(rocketList);
  };

  useEffect(() => {
    initData();
  }, []);
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
            <ProductList items={freshItems} type="carousel" />
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
