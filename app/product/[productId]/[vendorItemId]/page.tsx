import { Metadata } from "next";
import ProductDetailView from "@/components/product-detail-view";
import { createClient } from "@supabase/supabase-js";

// Supabase (Server Side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: Promise<{ productId: string; vendorItemId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vendorItemId } = await params;

  // Default Title if info missing
  if (!vendorItemId) {
    return {
      title: "상품 상세 정보 - CPNOW",
      description: "쿠팡 상품의 가격 변동 내역을 확인하세요.",
    };
  }

  // Fetch product info
  const { data: product } = await supabase
    .from("cpnow_products")
    .select("name, image_url, updated_at")
    .eq("vendor_item_id", vendorItemId)
    .single();

  // Fetch latest price for rich snippet
  const { data: history } = await supabase
    .from("cpnow_price_history")
    .select("price, wow_price")
    .eq("vendor_item_id", vendorItemId)
    .order("collected_at", { ascending: false })
    .limit(1)
    .single();

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 - CPNOW",
      description: "요청하신 상품 정보를 찾을 수 없습니다.",
    };
  }

  const currentPrice = history?.price || 0;
  const wowPrice = history?.wow_price || 0;

  // Format price string
  const displayPrice =
    currentPrice > 0 ? `${currentPrice.toLocaleString()}원` : "가격 확인 중";
  // Only show wow price if it is actually cheaper
  const displayWowPrice =
    wowPrice > 0 && wowPrice < currentPrice
      ? ` (와우회원가 ${wowPrice.toLocaleString()}원)`
      : "";

  const title = `${product.name} 최저가 & 가격 변동 | CPNOW`;
  const description = `현재가격: ${displayPrice}${displayWowPrice}. ${product.name}의 실시간 가격 흐름과 역대 최저가를 확인하고 스마트하게 쇼핑하세요.`;

  return {
    title: title,
    description: description,
    keywords: [
      "쿠팡",
      "가격추적",
      "최저가",
      "와우할인",
      "가격변동",
      "쇼핑",
      "역대최저가",
      product.name,
    ],
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
      title: title,
      description: description,
      type: "website",
      siteName: "CPNOW",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default function ProductPage() {
  // Render the Client Component which handles params internally
  return <ProductDetailView />;
}
