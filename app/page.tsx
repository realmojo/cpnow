import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowUpRight, ShoppingBag } from "lucide-react";
import { AddProductBar } from "@/components/add-product-bar";
import { ModeToggle } from "@/components/mode-toggle";

// Supabase Client Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const metadata = {
  title: "CPNOW - 쿠팡 최저가 알리미 & 가격 추적",
  description:
    "쿠팡 상품의 가격 변동 이력을 추적하여 가장 스마트한 쇼핑 타이밍을 알려드립니다. 와우 멤버십 할인 정보와 역대 최저가를 한눈에 확인하세요.",
  openGraph: {
    title: "CPNOW - Premium Coupang Price Tracker",
    description:
      "스마트한 소비를 위한 필수 도구. 실시간 가격 추적 및 할인 분석.",
    type: "website",
  },
};

// Force dynamic rendering
export const revalidate = 0;

export default async function Home() {
  const { data: products, error } = await supabase
    .from("cpnow_products")
    .select(
      `
      *,
      cpnow_price_history (
        price,
        wow_price,
        collected_at
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive font-mono">
        Failed to load products. Check Supabase connection.
      </div>
    );
  }

  const processedProducts = products?.map((p) => {
    const history =
      p.cpnow_price_history?.sort(
        (a: any, b: any) =>
          new Date(b.collected_at).getTime() -
          new Date(a.collected_at).getTime()
      ) || [];
    const latest = history[0];

    const currentPrice = latest?.price || 0;
    const currentWowPrice = latest?.wow_price || 0;
    // Normalized logic: if wow price is 0, assumes equal to regular (no discount)
    const displayedWowPrice =
      currentWowPrice > 0 ? currentWowPrice : currentPrice;

    const discountRate =
      currentWowPrice > 0 && currentWowPrice < currentPrice
        ? Math.round(((currentPrice - currentWowPrice) / currentPrice) * 100)
        : 0;

    return {
      ...p,
      currentPrice,
      currentWowPrice: displayedWowPrice,
      hasWowDiscount: currentWowPrice > 0 && currentWowPrice < currentPrice,
      discountRate,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 text-foreground selection:bg-primary/20">
      <div className="container max-w-7xl mx-auto px-6 py-12 lg:py-20 min-h-screen flex flex-col">
        {/* Ambient Background */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-900/10 dark:via-purple-900/10 dark:to-transparent pointer-events-none -z-10 blur-3xl" />

        {/* Header Section */}
        <div className="flex flex-col gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-400 dark:to-gray-200 font-sans">
                CPNOW
              </h1>
              <p className="text-muted-foreground font-light text-lg tracking-tight">
                Premium Price Tracker for Coupang
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>{processedProducts?.length || 0} Items</span>
              </div>
              <ModeToggle />
            </div>
          </div>

          {/* Search/Add Bar */}
          <AddProductBar />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {processedProducts?.map((product, idx) => (
            <Link
              key={product.product_id}
              href={`/product/${product.product_id}/${product.vendor_item_id}`}
              className="group flex flex-col gap-4 animate-in fade-in fill-mode-both relative"
              style={{
                animationDelay: `${idx * 100}ms`,
                animationDuration: "1000ms",
              }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-gray-200/40 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl dark:group-hover:shadow-black/60 z-10">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Main Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Sold Out */}
                {product.is_sold_out && (
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <span className="text-white font-black text-xl tracking-[0.2em] uppercase border-2 border-white/80 px-6 py-3">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                  {product.hasWowDiscount && (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-2.5 py-1 text-xs shadow-lg shadow-blue-900/20 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                      <Crown className="w-3 h-3 mr-1" />
                      {product.discountRate}% OFF
                    </Badge>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-5 right-5 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 dark:bg-black/90 backdrop-blur text-black dark:text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 px-2">
                <h3 className="font-bold text-lg leading-snug line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>

                <div className="flex items-end justify-between pb-2 border-b border-dashed border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-70 mb-0.5">
                      Price
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-mono tracking-tight">
                        {product.hasWowDiscount
                          ? product.currentWowPrice.toLocaleString()
                          : product.currentPrice > 0
                          ? product.currentPrice.toLocaleString()
                          : "-"}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        KRW
                      </span>
                    </div>
                  </div>

                  {product.hasWowDiscount && (
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground line-through decoration-red-400/50">
                        {product.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center mt-0.5 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                        Wow Price
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {processedProducts?.length === 0 && (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-60">
              <ShoppingBag className="w-20 h-20 mb-6 stroke-[0.5] text-muted-foreground" />
              <p className="text-2xl font-light mb-2">Collection is Empty</p>
              <p className="text-muted-foreground font-light">
                Start by adding a product URL above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
