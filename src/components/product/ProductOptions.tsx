"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { ComparePriceDetail } from "@/src/components/product/ComparePriceDetail";

export default function ProductList({ items = [] }: any) {
  const [parentId, setParentId] = useState<number | null>(0);
  const [productItems, setProductItems] = useState<any[]>([]);

  useEffect(() => {
    const originalId = location.href.split("/").pop();
    setProductItems(items);
    setParentId(Number(originalId));
  }, [items]);

  return (
    <>
      <div className="divide-border-300 flex flex-col divide-y">
        {Array.isArray(productItems) &&
          productItems.length > 0 &&
          productItems.map((item: any) => (
            <div key={item.id}>
              <Card className="relative flex flex-col gap-4 rounded-none border-0 bg-transparent px-2 py-4 shadow-none ring-0 hover:bg-transparent sm:flex-row">
                <Link href={`/product/${item.id}`} className="flex w-full">
                  <div className="w-28 shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={112}
                      height={112}
                      className="aspect-square h-28 w-28 rounded-lg object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-4 py-1">
                    <CardTitle className="mb-2 line-clamp-2 text-sm leading-snug font-medium text-gray-800">
                      {item.title}
                    </CardTitle>

                    <div className="text-sm text-gray-700">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="text-base font-bold text-black">
                          {item.price.toLocaleString()}원
                        </div>
                        {item.isDiscounted || item.isIncreased ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              item.isDiscounted
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.isDiscounted ? "▲" : "▼"}{" "}
                            {Math.abs(item.discountRate ?? 0)}%
                          </span>
                        ) : null}
                      </div>

                      {parentId === item.id ? (
                        <div className="text-sm text-gray-700">
                          <div className="mb-1 flex items-center gap-2">
                            <div className="text-base font-bold text-blue-500">
                              현재 옵션
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <ComparePriceDetail
                        price={item.price}
                        productPrice={item.highPrice ?? item.price}
                      />
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          ))}
      </div>
    </>
  );
}
