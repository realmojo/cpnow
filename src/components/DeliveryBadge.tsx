// components/DeliveryBadge.tsx
"use client";

import Image from "next/image";

type DeliveryType = 0 | 1 | 2 | 3 | 4 | 5;

interface Props {
  deliveryType: DeliveryType;
  width?: number;
  height?: number;
}

const deliveryMap: Record<DeliveryType, { src: string; alt: string } | null> = {
  0: null, // 일반배송은 이미지 없이 텍스트 처리
  1: {
    src: "https://image1.coupangcdn.com/image/badges/rocket/rocket_logo.png",
    alt: "로켓배송",
  },
  2: {
    src: "https://image1.coupangcdn.com/image/coupang/rds/logo/iphone_2x/logoRocketMerchantLargeV3R3@2x.png",
    alt: "판매자직구",
  },
  3: {
    src: "https://image1.coupangcdn.com/image/coupang/rds/logo/iphone_2x/logoRocketMerchantLargeV3R3@2x.png",
    alt: "로켓직구",
  },
  4: {
    src: "https://image6.coupangcdn.com/image/badges/falcon/v1/web/rocket-fresh@2x.png",
    alt: "로켓프레스",
  },
  5: {
    src: "https://image7.coupangcdn.com/image/badges/rocket-install/v3/aos_2/rocket_install_xhdpi.png",
    alt: "로켓설치",
  },
};

export default function DeliveryBadge({
  deliveryType,
  width = 80,
  height = 20,
}: Props) {
  const badge = deliveryMap[deliveryType];

  // 일반배송 텍스트 출력
  if (Number(deliveryType) === 0 || deliveryType === null) {
    return <span className="text-sm text-gray-500">일반배송</span>;
  }

  if (!badge) return null;

  return (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={width}
      height={height}
      style={{ width: "auto", height: 14 }}
    />
  );
}
