import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import AlarmButton from "@/src/components/product/AlarmButton";
import SimilarProductSection from "@/src/components/product/SimilarProductSection";

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

  const title = `${product.title} | 쿠팡 가격 알리미 - CPNOW`;
  const description = `${product.title}의 현재 최저가는 ${product.lowPrice ? product.lowPrice?.toLocaleString() : product.price.toLocaleString()}원입니다. 쿠팡 가격 추이를 한눈에 확인하세요.`;

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
      siteName: "CPNOW",
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

export default async function ProductPage({ params }: any) {
  const { id } = await params;
  const productItem = await getProductById(id);
  if (!productItem) return notFound();

  const formatNumber = (num: number | string): string => {
    return num ? Number(num).toLocaleString("ko-KR") : "0";
  };

  const comparePriceDetail = (crawlPrice: number, productPrice: number) => {
    if (productPrice === 0) {
      return <span style={{ color: "#888" }}>기준 가격 오류</span>;
    }

    const priceDifference = Math.abs(productPrice - crawlPrice);
    const formattedPrice = priceDifference.toLocaleString();

    if (crawlPrice < productPrice) {
      const discountPercent = (
        ((productPrice - crawlPrice) / productPrice) *
        100
      ).toFixed(0);

      return (
        <span style={{ color: "green", fontWeight: "bold", fontSize: "0.9em" }}>
          🚀 {formattedPrice}원 할인됨 ({discountPercent}% ↓)
        </span>
      );
    } else if (crawlPrice > productPrice) {
      const increasePercent = (
        ((crawlPrice - productPrice) / productPrice) *
        100
      ).toFixed(0);

      return (
        <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9em" }}>
          ⬆ {formattedPrice}원 인상됨 (+{increasePercent}%)
        </span>
      );
    } else {
      return (
        <span style={{ color: "#666", fontSize: "0.9em" }}>
          가격 변동 없음 (0%)
        </span>
      );
    }
  };

  const getShortUrl = (item: any) => {
    const { shortUrl, link } = item;
    if (shortUrl && shortUrl.startsWith("https")) {
      return shortUrl;
    } else {
      return link;
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productItem.title,
    image: [productItem.thumbnail],
    description: `${productItem.title}의 실시간 최저가는 ${productItem.lowPrice?.toLocaleString()}원입니다.`,
    brand: {
      "@type": "Brand",
      name: "쿠팡",
    },
    offers: {
      "@type": "Offer",
      url: productItem.shortUrl || productItem.link,
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
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: productItem.rating
        ? Number(productItem.rating).toFixed(1)
        : "0",
      reviewCount: productItem.reviewCount ?? 0,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <article>
        <section className="flex justify-center py-10">
          <div className="mx-auto w-full max-w-[800px] px-4">
            <h2 className="font-heading flex scroll-m-20 justify-between pb-4 text-2xl font-bold tracking-tight first:mt-0">
              상품정보
              <div className="mt-3">
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
              </div>
            </h2>
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
                        {comparePriceDetail(
                          productItem.price,
                          productItem.highPrice ?? productItem.price,
                        ) || 0}
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
                        {formatNumber(productItem.price)}원
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
                                  i + 1 <= Math.floor(productItem.rating ?? 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : i < (productItem.rating ?? 0)
                                      ? "fill-yellow-400 text-gray-300"
                                      : "fill-gray-300 text-gray-300";

                                return (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
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
                    <tr>
                      <td colSpan={2} className="text-lg text-gray-800">
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="secondary"
                            className="h-14 flex-1 px-0"
                            size="lg"
                          >
                            <a
                              href={getShortUrl(productItem)}
                              target="_blank"
                              className="flex h-full w-full items-center justify-center rounded-lg bg-blue-600 text-center font-bold text-white"
                            >
                              구매하기
                            </a>
                          </Button>
                          {/* <Button className="h-14 w-full rounded-lg bg-blue-600 text-lg font-bold text-white shadow-lg transition duration-200 hover:bg-blue-700">
                            <a
                              href={getShortUrl(productItem)}
                              target="_blank"
                              className="text-centerblock flex h-full w-full items-center justify-center"
                            >
                              구매하기
                            </a>
                          </Button> */}
                          <AlarmButton pId={productItem.id} />
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
        {/* <section className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
            최근 최저가 변경 상품
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 8 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Link
                      href={`/product/3`}
                      className="block transition hover:shadow-xl"
                    >
                      <Card className="border-none bg-transparent shadow-none">
                        <CardHeader className="p-0">
                          <Image
                            src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/vendor_inventory/d21e/7a9b3ba07a64bf5fcd699da80ae058a5b6ccc192253b634b46d0a87edb6f.jpg"
                            alt="샘플 이미지"
                            width={200}
                            height={200}
                            className="aspect-square w-full rounded-t-md object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                            priority
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="mb-1 text-base font-bold">
                            상품명 또는 제목
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            간단한 상품 설명 또는 소개 문구가 여기에 표시됩니다.
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section> */}

        <SimilarProductSection categoryId={productItem.categoryId} />
      </article>
    </>
  );
}
