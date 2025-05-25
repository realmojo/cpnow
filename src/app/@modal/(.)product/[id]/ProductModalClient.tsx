"use client";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
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
import SimilarProductSection from "@/src/components/product/SimilarProductSection";
import StickyActionBar from "@/src/components/product/StickyActionBar";
import ProductOptions from "@/src/components/product/ProductOptions";
import { ComparePriceDetail } from "@/src/components/product/ComparePriceDetail";

export default function ProductModalClient({
  productItem,
}: {
  productItem: any;
}) {
  const router = useRouter();

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

  return (
    <Drawer open={true} onOpenChange={() => router.back()}>
      <DrawerContent className="!fixed !inset-0 !m-0 !h-screen !max-h-screen !w-screen !rounded-none !border-none">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <article>
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
            <section className="flex justify-center pt-8">
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

            <SimilarProductSection categoryId={productItem.categoryId} />
          </article>
          <StickyActionBar
            productItem={productItem}
            getShortUrl={getShortUrl(productItem)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
