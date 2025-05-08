import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryBadge from "./DeliveryBadge"; // 배달 타입 배지 컴포넌트

export default function ProductList({ items = [] }: any) {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.isArray(items) &&
        items.length > 0 &&
        items.map((item: any) => (
          <div key={item.id}>
            <Card className="overflow-hidden border-none bg-transparent py-0 pt-4 shadow-none transition hover:shadow-md">
              <Link href={`/product/${item.id}`}>
                <CardHeader className="p-0">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                    unoptimized
                  />
                </CardHeader>

                <CardContent className="space-y-2 p-4">
                  <CardTitle className="line-clamp-2 min-h-[3.5rem] text-sm leading-snug font-medium text-gray-800">
                    {item.title}
                  </CardTitle>

                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-black">
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
                      ) : (
                        <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-400">
                          할인 없음
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    {item.deliveryType && (
                      <DeliveryBadge deliveryType={item.deliveryType} />
                    )}
                  </div>

                  <div className="flex items-center text-sm">
                    {item.rating ? (
                      <div className="flex space-x-[1px]">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const fill =
                            i + 1 <= Math.floor(item.rating ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < (item.rating ?? 0)
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
                    ) : null}

                    {item.reviewCount ? (
                      <span className="ml-1 text-xs text-gray-600">
                        ({item.reviewCount.toLocaleString()})
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
    </div>
  );
}
