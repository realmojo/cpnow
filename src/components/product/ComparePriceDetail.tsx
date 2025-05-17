"use client";

import { Badge } from "@/components/ui/badge";

export const ComparePriceDetail = ({
  price,
  productPrice,
}: {
  price: number;
  productPrice: number;
}) => {
  if (productPrice === 0) {
    return (
      <Badge variant="secondary" className="text-gray-400">
        기준 가격 오류
      </Badge>
    );
  }

  const priceDifference = Math.abs(productPrice - price).toLocaleString();

  if (price < productPrice) {
    const discountPercent = (
      ((productPrice - price) / productPrice) *
      100
    ).toFixed(0);
    return (
      <Badge
        variant="default"
        className="bg-green-100 font-semibold text-green-700"
      >
        🚀 {priceDifference}원 할인됨 ({discountPercent}% ↓)
      </Badge>
    );
  }

  if (price > productPrice) {
    const increasePercent = (
      ((price - productPrice) / productPrice) *
      100
    ).toFixed(0);
    return (
      <Badge
        variant="default"
        className="bg-red-100 font-semibold text-red-700"
      >
        ⬆ {priceDifference}원 인상됨 (+{increasePercent}%)
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-gray-300 text-gray-500">
      가격 변동 없음
    </Badge>
  );
};
