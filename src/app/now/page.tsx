"use client";
import React, { useState } from "react";
import RecentlyDiscountedProducts from "@/src/components/home/RecentlyDiscountedProducts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
export default function NowPage() {
  const [sortOption, setSortOption] = useState("recently");
  return (
    <article>
      <section className="mt-4 mb-24 flex justify-center">
        <div className="w-[800px] px-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-md scroll-m-20 border-none font-bold tracking-tight first:mt-0 sm:border-b">
              🚀 지금 가격이 변동 되었어요!
            </h2>
            {/* 정렬 옵션 선택 박스 */}
            <Select
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recently">최신순</SelectItem>
                <SelectItem value="priceLow">가격 낮은순</SelectItem>
                <SelectItem value="priceHigh">가격 높은순</SelectItem>
                <SelectItem value="discount">할인순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 상품 컴포넌트 */}
          <RecentlyDiscountedProducts sortOption={sortOption} />
        </div>
      </section>
    </article>
  );
}
