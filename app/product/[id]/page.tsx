"use client";

import * as React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ProductData {
  title: string;
  image: string;
  currentPrice: number;
  unitPrice: string;
  rating: number; // Placeholder as DB doesn't have it yet
  reviewCount: number; // Placeholder
  delivery: {
    description: string; // Placeholder
    badgeUrl: string;
  };
  history: { date: string; price: number }[];
  lowestPrice: number;
  averagePrice: number;
  isSoldOut: boolean;
  productUrl: string;
}

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const id = params.id as string; // This might be productId
  const vendorItemId = searchParams.get("vendorItemId");

  const [product, setProduct] = React.useState<ProductData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      if (!vendorItemId) {
        setError("Vendor Item ID is missing.");
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
          .single();

        if (productError) throw productError;
        if (!productInfo) throw new Error("Product not found");

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
        const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
        const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const averagePrice =
          prices.length > 0
            ? Math.round(
                prices.reduce((a, b) => a + b, 0) / prices.length
              )
            : 0;

        const chartData =
          historyData?.map((h) => ({
            date: new Date(h.collected_at).toISOString().split("T")[0], // YYYY-MM-DD
            price: h.price,
          })) || [];

        setProduct({
          title: productInfo.name,
          image: productInfo.image_url || "",
          currentPrice: currentPrice,
          unitPrice:  historyData?.[historyData.length-1]?.unit_price || "",
          rating: 4.5, // Mock default
          reviewCount: 100, // Mock default
          delivery: {
            description: "배송 정보 확인 필요",
            badgeUrl: productInfo.delivery_badge || "NONE",
          },
          history: chartData,
          lowestPrice: lowestPrice,
          averagePrice: averagePrice,
          isSoldOut: productInfo.is_sold_out || false,
          productUrl: `https://www.coupang.com/vp/products/${productInfo.product_id}?vendorItemId=${productInfo.vendor_item_id}`,
        });
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [vendorItemId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const isGoodPrice = product.currentPrice <= product.averagePrice;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Back to Search</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image Section */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted/50 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.title}
                className="object-contain w-full h-full hover:scale-105 transition-transform duration-500"
              />
              {product.isSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                   <span className="text-white font-bold text-2xl border-2 border-white px-4 py-2 rounded">SOLD OUT</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={isGoodPrice ? "default" : "secondary"}
                  className="text-sm"
                >
                  {isGoodPrice ? "Great Price" : "Average Price"}
                </Badge>
                {/* Simulated Discount Badge */}
                {product.averagePrice > product.currentPrice && (
                  <Badge variant="destructive" className="text-sm">
                    {Math.round(
                      ((product.averagePrice - product.currentPrice) /
                        product.averagePrice) *
                        100
                    )}
                    % Lower vs Avg
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-balance mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TrendingUp
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill={i < product.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span>({product.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {product.currentPrice.toLocaleString()}원
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.unitPrice})
                </span>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 flex items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                {product.delivery.badgeUrl && product.delivery.badgeUrl !== "NONE" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                    src={product.delivery.badgeUrl}
                    alt="Delivery Badge"
                    className="h-4"
                    />
                )}
                <span className="text-sm font-medium text-green-700 dark:text-green-500">
                  {product.delivery.description}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Lowest Price</CardDescription>
                  <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                    {product.lowestPrice.toLocaleString()}원
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Price</CardDescription>
                  <CardTitle className="text-xl">
                    {product.averagePrice.toLocaleString()}원
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>
                  Tracking price changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={product.history}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(5)} // Show MM-DD
                    />
                    <YAxis
                      hide
                      domain={["dataMin - 100", "dataMax + 100"]}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="price"
                      type="monotone"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-auto">
              <Button asChild className="w-full flex-1" size="lg">
                <Link href={product.productUrl} target="_blank" rel="noopener noreferrer">
                    View on Coupang
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
