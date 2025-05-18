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
        className="rounded-md bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
      >
        {priceDifference}원 할인 ({discountPercent}% ↓)
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
        className="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
      >
        {priceDifference}원 인상 (+{increasePercent}%)
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="rounded-md border-gray-300 px-3 py-1 text-sm text-gray-500"
    >
      가격 변동 없음
    </Badge>
  );
};
