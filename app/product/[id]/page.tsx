"use client";

import * as React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  TrendingUp,
  Crown,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProductData {
  title: string;
  image: string;
  currentPrice: number;
  wowCurrentPrice: number;
  unitPrice: string; // Not stored in DB well yet, but keeping interface
  rating: number;
  reviewCount: number;
  delivery: {
    badgeUrl: string;
  };
  history: { date: string; price: number; wowPrice: number | null }[];
  lowestPrice: number;
  averagePrice: number;
  wowLowestPrice: number;
  isSoldOut: boolean;
  productUrl: string;
  updatedAt: string;
}

function ProductContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const vendorItemId = searchParams.get("vendorItemId");

  const [product, setProduct] = React.useState<ProductData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      if (!vendorItemId) {
        setError("상품 정보를 찾을 수 없습니다 (Vendor Item ID 누락).");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Product Info
        const { data: productInfo, error: productError } = await supabase
          .from("cpnow_products")
          .select("*")
          .eq("vendor_item_id", vendorItemId)
          .eq("product_id", productId)
          .single();

        if (productError) throw productError;
        if (!productInfo) throw new Error("상품을 찾을 수 없습니다");

        // 2. Fetch Price History
        const { data: historyData, error: historyError } = await supabase
          .from("cpnow_price_history")
          .select("*")
          .eq("vendor_item_id", vendorItemId)
          .order("collected_at", { ascending: true });

        if (historyError) throw historyError;

        // 3. Process Data
        const prices =
          historyData?.map((h) => h.price).filter((p) => p > 0) || [];
        const wowPrices =
          historyData?.map((h) => h.wow_price).filter((p) => p > 0) || [];

        const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
        const currentWowPrice =
          wowPrices.length > 0 ? wowPrices[wowPrices.length - 1] : 0;

        const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const wowLowestPrice =
          wowPrices.length > 0 ? Math.min(...wowPrices) : 0;

        const averagePrice =
          prices.length > 0
            ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
            : 0;

        // Process Chart Data (Last 30 Days)
        const days = 30;
        const chartData = [];
        const today = new Date();
        const firstHistory = historyData?.[0]; // Earliest record (sorted asc)

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString("ko-KR", {
            month: "short",
            day: "numeric",
          });

          // Find the relevant history for this date
          // Logic: Use the latest available record ON or BEFORE this day.
          const targetDateEnd = new Date(d);
          targetDateEnd.setHours(23, 59, 59, 999);

          const relevantRecords = historyData?.filter(
            (h) => new Date(h.collected_at) <= targetDateEnd
          );

          let price = 0;
          let wowPrice: number | null = null;

          if (relevantRecords && relevantRecords.length > 0) {
            // Use the most recent record relative to this date
            const record = relevantRecords[relevantRecords.length - 1];
            price = record.price;
            wowPrice = record.wow_price;
          } else if (firstHistory) {
            // Backfill: If date is before first collection, use the earliest known price
            // This creates a flat line for the past period
            price = firstHistory.price;
            wowPrice = firstHistory.wow_price;
          }

          chartData.push({
            date: dateStr,
            price: price,
            wowPrice: wowPrice && wowPrice > 0 ? wowPrice : price,
          });
        }

        setProduct({
          title: productInfo.name,
          image: productInfo.image_url || "",
          currentPrice: currentPrice,
          wowCurrentPrice: currentWowPrice > 0 ? currentWowPrice : currentPrice,
          unitPrice: "",
          rating: 0,
          reviewCount: 0,
          delivery: {
            badgeUrl: productInfo.delivery_badge || "NONE",
          },
          history: chartData,
          lowestPrice: lowestPrice,
          averagePrice: averagePrice,
          wowLowestPrice: wowLowestPrice > 0 ? wowLowestPrice : lowestPrice,
          isSoldOut: productInfo.is_sold_out || false,
          productUrl: `https://www.coupang.com/vp/products/${productInfo.product_id}?vendorItemId=${productInfo.vendor_item_id}`,
          updatedAt: new Date(productInfo.updated_at).toLocaleString("ko-KR"),
        });
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "상품 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [vendorItemId, productId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            가격 정보 분석 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-destructive">
            오류가 발생했습니다
          </h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/">검색으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const isWowCheaper =
    product.wowCurrentPrice > 0 &&
    product.wowCurrentPrice < product.currentPrice;
  const discountRate = isWowCheaper
    ? Math.round(
        ((product.currentPrice - product.wowCurrentPrice) /
          product.currentPrice) *
          100
      )
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline-block">
              뒤로가기
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground border px-2 py-1 rounded-full">
              최근 업데이트: {product.updatedAt}
            </span>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Image & Status */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white dark:bg-muted/20 shadow-sm flex items-center justify-center p-8 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.title}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {product.isSoldOut && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                  <span className="text-white font-black text-2xl tracking-widest border-4 border-white px-6 py-3">
                    품절
                  </span>
                </div>
              )}
            </div>

            {/* Removed Delivery Card */}
          </div>

          {/* Right Column: Info & Stats */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Title & Badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {product.wowCurrentPrice > 0 &&
                  product.wowCurrentPrice < product.currentPrice && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      와우회원 전용가
                    </Badge>
                  )}
                {isWowCheaper && (
                  <Badge variant="destructive" className="animate-pulse">
                    와우회원 {discountRate}% 추가 할인
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-pretty leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                {product.delivery.badgeUrl !== "NONE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.delivery.badgeUrl}
                    alt="배송 뱃지"
                    className="h-4 object-contain"
                  />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                    일반배송
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Button
                asChild
                size="lg"
                className="w-full text-lg h-16 font-bold bg-[#E60012] hover:bg-[#C4000F] text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.01] transition-all rounded-xl"
              >
                <Link
                  href={`https://link.coupang.com/re/AFFSDP?lptag=AF5242985&pageKey=${productId}&vendorItemId=${vendorItemId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <img
                    src="https://image7.coupangcdn.com/image/coupang/common/logo_coupang_w350.png"
                    alt="쿠팡"
                    className="h-6 brightness-0 invert opacity-90"
                  />
                  <span>쿠팡에서 최저가 보기</span>
                  <ExternalLink className="ml-1 h-5 w-5 opacity-70" />
                </Link>
              </Button>
            </div>

            {/* Price Display */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <TrendingUp className="w-24 h-24" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="font-semibold text-muted-foreground">
                    일반 판매가
                  </CardDescription>
                  <div className="flex items-end gap-2">
                    <CardTitle className="text-3xl font-bold">
                      {product.currentPrice.toLocaleString()}
                      <span className="text-lg font-normal text-muted-foreground ml-1">
                        원
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0 pb-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    역대 최저가: {product.lowestPrice.toLocaleString()}원
                  </div>
                </CardFooter>
              </Card>

              {product.wowCurrentPrice > 0 && (
                <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-600">
                    <Crown className="w-24 h-24" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardDescription className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      와우 회원가
                    </CardDescription>
                    <div className="flex items-end gap-2">
                      <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {product.wowCurrentPrice.toLocaleString()}
                        <span className="text-lg font-normal text-blue-500/80 ml-1">
                          원
                        </span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-4">
                    <div className="text-xs text-blue-600/70 dark:text-blue-400/70 flex items-center gap-1">
                      역대 최저가: {product.wowLowestPrice.toLocaleString()}원
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>

            {/* Price History Chart */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  가격 변동 내역
                </CardTitle>
                <CardDescription>
                  지난 30일간의 가격 변화를 추적합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-0 pr-4 pt-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={product.history}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                      opacity={0.4}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      minTickGap={30}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                      tick={{ fontSize: 12 }}
                      width={60}
                      domain={[
                        (dataMin: number) =>
                          dataMin > 0 ? Math.floor(dataMin * 0.85) : 0,
                        "auto",
                      ]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--popover)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "var(--foreground)" }}
                      formatter={(value: any) => [
                        `${Number(value).toLocaleString()}원`,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="stepAfter"
                      dataKey="price"
                      name="일반 판매가"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    {product.wowCurrentPrice > 0 && (
                      <Line
                        type="stepAfter"
                        dataKey="wowPrice"
                        name="와우 회원가"
                        stroke="#3b82f6" // Blue-500
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Footer Action */}
            <div className="mt-auto pt-6">
              <Button
                asChild
                size="lg"
                className="w-full text-lg h-16 font-bold bg-[#E60012] hover:bg-[#C4000F] text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.01] transition-all rounded-xl"
              >
                <Link
                  href={`https://link.coupang.com/re/AFFSDP?lptag=AF5242985&pageKey=${productId}&vendorItemId=${vendorItemId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <img
                    src="https://image7.coupangcdn.com/image/coupang/common/logo_coupang_w350.png"
                    alt="쿠팡"
                    className="h-6 brightness-0 invert opacity-90"
                  />
                  <span>쿠팡에서 최저가 보기</span>
                  <ExternalLink className="ml-1 h-5 w-5 opacity-70" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <ProductContent />
    </React.Suspense>
  );
}
