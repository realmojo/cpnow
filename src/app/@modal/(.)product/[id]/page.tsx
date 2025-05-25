import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductModalClient from "./ProductModalClient";

// ✅ 상품 호출 함수
async function getProductById(id: string): Promise<any | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product?id=${id}`,
    {
      cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "상품 정보를 찾을 수 없습니다",
      description: "요청하신 상품 정보를 찾을 수 없습니다.",
    };
  }

  const title = `${product.title} | 쿠팡 가격 알리미 - 시피나우`;
  const description = `${product.title}의 현재 최저가는 ${product.lowPrice ? product.lowPrice : product.price}원입니다. 쿠팡 가격 추이를 한눈에 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.thumbnail || "/og-default.png",
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      siteName: "시피나우",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.thumbnail || "/og-default.png"],
    },
    alternates: {
      canonical: `https://cpnow.kr/product/${id}`,
    },
  };
}

export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productItem = await getProductById(id);

  if (!productItem) return notFound();

  const hasValidRating =
    productItem.rating &&
    Number(productItem.rating) >= 1 &&
    Number(productItem.rating) <= 5;

  const hasValidReviewCount =
    productItem.reviewCount && productItem.reviewCount > 0;

  const isValidUrl = (url: string) => /^https?:\/\//.test(url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productItem.title,
    image: [productItem.thumbnail],
    description: `${productItem.title}의 실시간 최저가는 ${productItem.lowPrice?.toLocaleString()}원입니다.`,
    brand: {
      "@type": "Brand",
      name: "시피나우",
    },
    offers: {
      "@type": "Offer",
      url: isValidUrl(productItem.shortUrl)
        ? productItem.shortUrl
        : isValidUrl(productItem.link)
          ? productItem.link
          : undefined, // 잘못된 URL이면 제외
      priceCurrency: "KRW",
      price: productItem.lowPrice ?? productItem.price,
      priceValidUntil: "2025-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        productItem.lowPrice === -1
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "쿠팡",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "KRW",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "https://schema.org/Monday",
              "https://schema.org/Tuesday",
              "https://schema.org/Wednesday",
              "https://schema.org/Thursday",
              "https://schema.org/Friday",
            ],
          },
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        isReturnable: true,
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
      },
    },
    ...(hasValidRating && hasValidReviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(productItem.rating).toFixed(1),
            reviewCount: productItem.reviewCount,
          },
        }
      : {}),
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <ProductModalClient productItem={productItem} />
    </Suspense>
  );
}
