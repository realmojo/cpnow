import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(`/api/product?id=${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      title: "상품 정보를 찾을 수 없습니다 | CPNOW",
      description: "유효하지 않은 상품 ID입니다.",
    };
  }

  const product = await res.json();

  return {
    title: `${product.title} 최저가 가격 비교 | CPNOW`,
    description: `${product.title} 실시간 가격 변동과 최저가 정보를 제공합니다.`,
    openGraph: {
      title: `${product.title} | CPNOW`,
      description: `${product.title} 최저가 확인 및 할인 정보`,
      images: [product.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description || `${product.title} 상품 정보`,
      images: [product.thumbnail],
    },
  };
}
