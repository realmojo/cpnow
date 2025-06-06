"use client";

import { Badge } from "@/components/ui/badge";

export const ComparePriceDetail = ({
  price,
  highPrice,
  lowPrice,
  isVisible = false,
  isTextFull = true,
}: {
  price: number;
  highPrice: number;
  lowPrice: number;
  isVisible: boolean;
  isTextFull: boolean;
}) => {
  if (highPrice === 0) {
    return (
      <Badge variant="secondary" className="text-gray-400">
        기준 가격 오류
      </Badge>
    );
  }

  if (price === -1 || lowPrice === -1 || highPrice === -1) {
    return (
      <Badge variant="secondary" className="text-gray-400">
        품절
      </Badge>
    );
  }

  if (price === lowPrice && price === highPrice) {
    if (isVisible) {
      return (
        <Badge
          variant="outline"
          className="rounded-md border-gray-300 px-2 py-1 text-sm text-gray-500"
        >
          가격 변동 없음
        </Badge>
      );
    }
    return "";
  }

  if (price < highPrice) {
    const priceDifference = Math.abs(highPrice - price).toLocaleString();
    const discountPercent = (((highPrice - price) / highPrice) * 100).toFixed(
      0,
    );
    return (
      <Badge
        variant="default"
        className="rounded-md bg-green-100 px-1 py-0 text-sm font-semibold text-green-700"
      >
        {isTextFull ? `${priceDifference} 원 할인` : null} {discountPercent}% ▼
      </Badge>
    );
  }

  if (price >= highPrice) {
    const priceDifference = Math.abs(lowPrice - price).toLocaleString();
    const increasePercent = (((price - lowPrice) / lowPrice) * 100).toFixed(0);
    return (
      <Badge
        variant="default"
        className="rounded-md bg-red-100 px-1 py-0 text-sm font-semibold text-red-700"
      >
        {isTextFull ? `${priceDifference} 원 인상` : null} {increasePercent}% ▲
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
