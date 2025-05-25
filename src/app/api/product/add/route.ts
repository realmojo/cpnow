import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList } from "@/lib/db";

const getRandomLambdaUrl = (productId, vendorItemId) => {
  const queryString = `?productId=${productId}&vendorItemId=${vendorItemId}`;

  const baseUrls = [
    "https://kymbvjil7a.execute-api.ap-northeast-2.amazonaws.com/default/fa",
    "https://9rf01x7ya2.execute-api.ap-northeast-2.amazonaws.com/default/fb",
    "https://eru6y1197d.execute-api.ap-northeast-2.amazonaws.com/default/fc",
    "https://slp00155k2.execute-api.ap-northeast-2.amazonaws.com/default/fd",
    "https://ngznwws569.execute-api.ap-northeast-2.amazonaws.com/default/fe",
  ];

  const randomIndex = Math.floor(Math.random() * baseUrls.length);
  return baseUrls[randomIndex] + queryString;
};

// ✅ P, I, V 로 상품추가
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { productId, itemId, vendorItemId } = reqItems;

    if (!productId || !itemId || !vendorItemId) {
      throw new Error("no parameter");
    }

    const url = getRandomLambdaUrl(productId, vendorItemId);
    console.log(`➡️  ${url}`);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const body = await response.json();
    const product = body.result[0];
    // Handlebar 모듈에서 기본 정보 추출
    const baseInfoModule = product.moduleData.find(
      (m: any) => m.viewType === "PRODUCT_DETAIL_HANDLEBAR_BASE_INFO",
    );

    // 가격 모듈에서 가격 정보 추출
    const priceModule = product.moduleData.find(
      (m: any) => m.viewType === "PRODUCT_DETAIL_PRICE_INFO",
    );

    const params = {
      title: baseInfoModule?.itemInfo?.itemName || null,
      finalPrice: priceModule?.detailPriceBundle?.finalPrice?.price || null,
      rating: 0, // 현재 JSON엔 없음
      reviewCount: 0, // 현재 JSON엔 없음
      deliveryType: product.delivery?.type || null,
      productId: baseInfoModule?.itemInfo?.productId || null,
      itemId: baseInfoModule?.itemInfo?.itemId || null,
      vendorItemId: baseInfoModule?.itemInfo?.vendorItemId || null,
      thumbnail: baseInfoModule?.itemInfo?.thumbnailImage?.url || null,
    };

    // const query = "UPDATE crawl_wait SET lastUpdated = NOW() WHERE pId = ?";

    // await insertOne(query, [pId]);

    // ✅ 결과 반환
    return NextResponse.json({ success: true, data: params });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pId = searchParams.get("pId");
    if (!pId) {
      throw new Error("no parameter");
    }

    const query = "DELETE FROM crawl_wait WHERE pId= ?";
    await insertOne(query, [pId]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
