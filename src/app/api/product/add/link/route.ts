import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList } from "@/lib/db";
import {
  getDeliveryType,
  extractCoupangParams,
  extractRedirectUrlFromHtml,
} from "@/utils/utils";
import axios from "axios";
const getRandomLambdaUrl = (productId: string, vendorItemId: string) => {
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

const addNewProduct = async (params: any) => {
  const { productId, itemId, vendorItemId } = params;
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

  const param = {
    title: baseInfoModule?.itemInfo?.itemName || "",
    finalPrice: priceModule?.detailPriceBundle?.finalPrice?.price || 0,
    rating: 0, // 현재 JSON엔 없음
    reviewCount: 0, // 현재 JSON엔 없음
    deliveryType: getDeliveryType(product.delivery?.badgeUrl) || 0,
    productId: baseInfoModule?.itemInfo?.productId || productId,
    itemId: baseInfoModule?.itemInfo?.itemId || itemId,
    vendorItemId: baseInfoModule?.itemInfo?.vendorItemId || vendorItemId,
    thumbnail: baseInfoModule?.itemInfo?.thumbnailImage?.url || null,
    link: `https://www.coupang.com/vp/products/${productId}?itemId=${itemId}&vendorItemId=${vendorItemId}`,
    categoryId: baseInfoModule?.itemInfo?.categoryId || 1,
    bigCategory: baseInfoModule?.itemInfo?.bigCategory || "카테고리",
    category: baseInfoModule?.itemInfo?.category || "신규",
  };

  const query = `INSERT INTO products (id, bigCategory, category, productId, vendorItemId, itemId, categoryId, title, thumbnail, link, price, lowPrice, highPrice, rating, reviewCount, deliveryType, lastUpdated) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const pId = await insertOne(query, [
    param.bigCategory,
    param.category,
    param.productId,
    param.vendorItemId,
    param.itemId,
    param.categoryId,
    param.title,
    param.thumbnail,
    param.link,
    param.finalPrice,
    param.finalPrice,
    param.finalPrice,
    param.rating,
    param.reviewCount,
    param.deliveryType,
  ]);

  return pId;
};

export async function POST(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const reqItems = await req.json();
    const { userId, link } = reqItems;
    if (!link) {
      return NextResponse.json({ error: "Missing parameter" }, { status: 400 });
    }

    let productId = "";
    let itemId = "";
    let vendorItemId = "";

    if (link.includes("link.coupang.com")) {
      try {
        const response = await axios.get(link, {
          maxRedirects: 0, // 리디렉션 따라가지 않음
          validateStatus: (status) => status >= 200 && status < 400, // 3xx 응답도 허용
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
          },
        });

        if (response.status === 200) {
          const redirectUrl = extractRedirectUrlFromHtml(response.data);
          if (!redirectUrl) {
            throw new Error("no redirect url");
          }
          const params = extractCoupangParams(redirectUrl);
          productId = params.productId || "";
          itemId = params.itemId || "";
          vendorItemId = params.vendorItemId || "";
        }
      } catch (error) {
        throw new Error(error as string);
      }
    } else if (link.includes("https://www.coupang.com/vp/products/")) {
      const params = extractCoupangParams(link);
      productId = params.productId || "";
      itemId = params.itemId || "";
      vendorItemId = params.vendorItemId || "";
    } else {
      throw new Error("올바르지 않은 링크입니다");
    }

    if (!productId || !itemId || !vendorItemId) {
      return NextResponse.json(
        { error: "올바르지 않은 링크입니다" },
        { status: 400 },
      );
    }

    let query =
      "SELECT * FROM products p where productId = ? AND itemId = ? AND vendorItemId = ?";
    const products = await queryList(query, [productId, itemId, vendorItemId]);

    const params = {
      userId: userId,
      pId: 0,
    };

    const product = products.length > 0 ? products[0] : null;
    if (product === null) {
      const productParams = {
        userId: userId,
        productId: productId,
        itemId: itemId,
        vendorItemId: vendorItemId,
      };

      const pId = await addNewProduct(productParams);

      params.pId = pId;
    } else if (product.id && userId) {
      params.pId = product.id;
    } else {
      throw new Error("상품 등록 중 오류가 났습니다");
    }

    if (params.userId && params.pId) {
      query =
        "INSERT IGNORE INTO user_alarms (id, userId, pId, regdated) VALUES (NULL, ?, ?, NOW())";
      await insertOne(query, [userId, params.pId]);

      // 대기 알람에도 넣어주기
      query =
        "INSERT INTO crawl_wait (pId, type, regdated) VALUES (?, 'alarm', NOW()) ON DUPLICATE KEY UPDATE type = 'alarm';";
      await insertOne(query, [params.pId]);
    }

    // ✅ 결과 반환
    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
