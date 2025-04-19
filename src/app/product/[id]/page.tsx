"use client";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import NotificationButton from "@/src/components/Notification";
export const runtime = "edge";
const data = [
  { name: "월", uv: 400 },
  { name: "화", uv: 700 },
  { name: "수", uv: 200 },
  { name: "목", uv: 800 },
  { name: "금", uv: 500 },
  { name: "토", uv: 650 },
  { name: "일", uv: 300 },
];

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ 이렇게 unwrapping 필요

  // 예시: 유효하지 않은 ID 처리
  if (!["1", "2", "3"].includes(id)) {
    notFound(); // 404 처리
  }

  const handleNotify = () => {
    toast("최저가 알림받기가 설정되었습니다.", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
    });
  };

  return (
    <div className="container mx-auto py-10">
      {/* <h1 className="text-2xl font-bold">Product ID: {id}</h1> */}
      <NotificationButton />
      <div className="flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 flex scroll-m-20 justify-between border-b pb-4 text-2xl font-bold tracking-tight first:mt-0">
            <div>상품정보</div>
            <div className="mt-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">의류</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">여성패션</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>가디건</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </h2>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-[800px] flex-col items-stretch overflow-hidden rounded-lg bg-white sm:flex-row">
          {/* 왼쪽 이미지 영역 */}
          <div className="flex items-center justify-center p-4 sm:flex-[3]">
            <Image
              src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/vendor_inventory/d21e/7a9b3ba07a64bf5fcd699da80ae058a5b6ccc192253b634b46d0a87edb6f.jpg"
              alt="product"
              width={400}
              height={400}
              className="h-auto w-full rounded-md object-contain sm:w-[400px]"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
              priority
            />
          </div>

          {/* 오른쪽 정보 영역 */}
          <div className="flex flex-col justify-center bg-white p-6 sm:flex-[4]">
            <table className="w-full border-collapse text-base">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="w-[140px] p-3 text-left font-bold text-gray-700">
                    상품명
                  </th>
                  <td className="p-3 text-lg text-gray-800">
                    예시 상품명입니다
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    할인율
                  </th>
                  <td className="p-3 text-lg text-gray-800">15%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    최저가
                  </th>
                  <td className="p-3 text-lg text-gray-800">89,000원</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    최고가
                  </th>
                  <td className="p-3 text-lg text-gray-800">129,000원</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    현재가
                  </th>
                  <td className="p-3 text-lg font-bold text-red-600">
                    99,000원
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    로켓배송
                  </th>
                  <td className="p-3 text-lg text-gray-800">가능</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">
                    평점
                  </th>
                  <td className="p-3 text-lg text-gray-800">4.7 / 5</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-3 text-lg text-gray-800">
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="secondary"
                        className="h-14 flex-1"
                        onClick={handleNotify}
                        size="lg"
                      >
                        구매하기
                      </Button>
                      <Button
                        className="h-14 flex-1"
                        size="lg"
                        onClick={handleNotify}
                      >
                        알람받기
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 border-b pb-4 text-2xl font-bold tracking-tight first:mt-0">
            가격추이
          </h2>
          <ResponsiveContainer className="mt-8" width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#2563eb"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 border-b pb-4 text-2xl font-bold tracking-tight first:mt-0">
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
                            width={400}
                            height={400}
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
      </div>

      <div className="mt-16 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading mt-16 scroll-m-20 border-b pb-4 text-2xl font-bold tracking-tight first:mt-0">
            비슷한 상품 추천
          </h2>
          <Table>
            <TableCaption>할인율 기준입니다.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">이미지</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>최저가</TableHead>
                <TableHead>현재가</TableHead>
                <TableHead className="text-right">할인율</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Image
                    src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/vendor_inventory/d21e/7a9b3ba07a64bf5fcd699da80ae058a5b6ccc192253b634b46d0a87edb6f.jpg"
                    alt="샘플 이미지"
                    width={60}
                    height={60}
                    className="w-full rounded-t-md object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                    priority
                    // className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  삼성 4K UHD TV 55인치
                </TableCell>
                <TableCell>₩699,000</TableCell>
                <TableCell className="font-semibold text-red-500">
                  ₩589,000
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  16%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image
                    src="https://thumbnail8.coupangcdn.com/thumbnails/remote/400x400ex/image/vendor_inventory/d21e/7a9b3ba07a64bf5fcd699da80ae058a5b6ccc192253b634b46d0a87edb6f.jpg"
                    alt="샘플 이미지"
                    width={60}
                    height={60}
                    className="w-full rounded-t-md object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                    priority
                  />
                </TableCell>
                <TableCell className="font-medium">LG OLED 스마트 TV</TableCell>
                <TableCell>₩1,500,000</TableCell>
                <TableCell className="font-semibold text-red-500">
                  ₩1,299,000
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  13%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
