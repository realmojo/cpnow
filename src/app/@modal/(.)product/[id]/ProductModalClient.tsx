"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import DeliveryBadge from "@/src/components/DeliveryBadge";
import { getCategoryIdByName } from "@/utils/utils";
import PriceLineChart from "@/src/components/PriceLineChart";
import StickyActionBar from "@/src/components/product/StickyActionBar";
import ProductOptions from "@/src/components/product/ProductOptions";
import { ComparePriceDetail } from "@/src/components/product/ComparePriceDetail";

// ✅ 상품 호출 함수
async function getProductById(id: string): Promise<any | null> {
  const res = await fetch(`/api/product?id=${id}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function ProductModalClient({ id }: { id: string }) {
  const router = useRouter();
  const [productItem, setProductItem] = useState<any>(null);

  const [open, setOpen] = useState(true); // 최초 open

  const formatNumber = (num: number | string): string => {
    return num ? Number(num).toLocaleString("ko-KR") : "0";
  };

  const getShortUrl = (item: any) => {
    const { shortUrl, link } = item;
    if (shortUrl && shortUrl.startsWith("https")) {
      return shortUrl;
    } else {
      return link;
    }
  };

  const initData = async (id: string) => {
    const productItem = await getProductById(id);
    setProductItem(productItem);
  };

  const isValidUrl = (url: string) => /^https?:\/\//.test(url);

  const renderJsonLd = () => {
    if (!productItem) return null;

    const title = `${productItem.title} - 실시간 최저가 비교 | 시피나우`;
    const description = `${productItem.title}의 최저가는 ${productItem.lowPrice?.toLocaleString()}원입니다. 실시간 가격 비교, 리뷰 확인, 빠른 배송까지 한눈에 확인하세요.`;
    const image = productItem.thumbnail;
    const canonicalUrl =
      productItem.shortUrl ||
      productItem.link ||
      `https://cpnow.kr/product/${productItem.id}`;

    const hasValidRating =
      productItem.rating &&
      Number(productItem.rating) >= 1 &&
      Number(productItem.rating) <= 5;

    const hasValidReviewCount =
      productItem.reviewCount && productItem.reviewCount > 0;

    const isValidUrl = (url?: string) => !!url && /^https?:\/\//.test(url);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productItem.title,
      image: [productItem.thumbnail],
      description: description,
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
            : undefined,
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
      <Head>
        {/* ✅ 제목 및 설명 */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* ✅ Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="시피나우" />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* ✅ Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* ✅ JSON-LD */}
        <script
          key="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>
    );
  };

  useEffect(() => {
    initData(id);
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setTimeout(() => router.back(), 300);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      {renderJsonLd()}
      <Drawer
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setTimeout(() => router.back(), 300);
        }}
      >
        <DrawerContent className="!fixed !inset-0 !m-0 !h-screen !max-h-screen !w-screen !rounded-none !border-none transition-all duration-300 ease-in-out [&>div.bg-muted]:hidden">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center justify-between text-base font-semibold">
              <div>상품정보</div>
              {productItem && (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/categories/${getCategoryIdByName(productItem.bigCategory)}`}
                        >
                          {productItem.bigCategory ?? ""}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        <BreadcrumbLink asChild>
                          <Link href={`/categories/${productItem.categoryId}`}>
                            {productItem.category ?? ""}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </DrawerTitle>
          </DrawerHeader>
          {productItem && (
            <div className="flex-1 overflow-y-auto">
              <article className="mb-16">
                <section className="flex justify-center pt-4">
                  <div className="mx-auto w-full max-w-[800px] px-4">
                    <div className="flex flex-col items-stretch overflow-hidden rounded-lg bg-white sm:flex-row">
                      <div className="flex items-center justify-center sm:flex-[3]">
                        <Image
                          src={
                            productItem.thumbnail ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                          }
                          alt={productItem.title ?? ""}
                          width={400}
                          height={400}
                          className="h-auto w-full rounded-md object-contain sm:w-[400px]"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                          priority
                        />
                      </div>

                      <div className="flex flex-col justify-center bg-white sm:flex-[4] sm:pl-8">
                        <table className="w-full border-collapse text-base">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <th className="w-[120px] p-3 text-left font-bold text-gray-700">
                                상품명
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                {productItem.title ?? ""}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                할인율
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                {productItem.price === -1 ? (
                                  "품절"
                                ) : (
                                  <ComparePriceDetail
                                    price={productItem.price}
                                    highPrice={
                                      productItem.highPrice ?? productItem.price
                                    }
                                    lowPrice={
                                      productItem.lowPrice ?? productItem.price
                                    }
                                    isVisible={true}
                                  />
                                )}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                최저가
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                {productItem.lowPrice === -1
                                  ? "품절"
                                  : `${formatNumber(
                                      productItem.lowPrice ?? productItem.price,
                                    )}원`}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                최고가
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                {formatNumber(
                                  productItem.highPrice ?? productItem.price,
                                )}
                                원
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                현재가
                              </th>
                              <td className="p-3 text-lg font-bold text-red-600">
                                {productItem.price === -1
                                  ? "품절"
                                  : `${formatNumber(productItem.price)}원`}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                로켓배송
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                <DeliveryBadge
                                  deliveryType={productItem.deliveryType}
                                />
                              </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <th className="p-3 text-left font-bold text-gray-700">
                                평점(리뷰 수)
                              </th>
                              <td className="p-3 text-lg text-gray-800">
                                <div className="flex space-x-[1px]">
                                  <div className="flex items-center text-sm">
                                    <div className="flex space-x-[1px]">
                                      {Array.from({ length: 5 }).map((_, i) => {
                                        const fill =
                                          i + 1 <=
                                          Math.floor(productItem.rating ?? 0)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : i < (productItem.rating ?? 0)
                                              ? "fill-yellow-400 text-gray-300"
                                              : "fill-gray-300 text-gray-300";

                                        return (
                                          <svg
                                            key={i}
                                            xmlns="http:www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={`h-4 w-4 ${fill}`}
                                          >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                          </svg>
                                        );
                                      })}
                                    </div>

                                    <span className="ml-1 text-xs text-gray-600">
                                      (
                                      {productItem.reviewCount
                                        ? productItem.reviewCount.toLocaleString()
                                        : 0}
                                      )
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-16 flex justify-center">
                  <div className="w-full max-w-[800px] px-4">
                    <h2 className="font-heading mt-16 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
                      가격추이
                    </h2>

                    <PriceLineChart items={productItem.priceHistory} />
                  </div>
                </section>
                {productItem?.options?.length > 1 && (
                  <section className="mt-16 flex justify-center">
                    <div className="w-full max-w-[800px] px-4">
                      <h2 className="font-heading mt-16 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
                        이 상품의 옵션
                      </h2>
                      <ProductOptions items={productItem.options} />
                    </div>
                  </section>
                )}
              </article>
              <StickyActionBar
                productItem={productItem}
                getShortUrl={getShortUrl(productItem)}
              />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
