import { insertOne } from "@/lib/db";
import { getDeliveryType } from "@/utils/utils";

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

export const addNewProduct = async (params: any) => {
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
    deliveryType: getDeliveryType(product.delivery?.badgeUrl ?? "") || 0,
    productId: baseInfoModule?.itemInfo?.productId || productId,
    itemId: baseInfoModule?.itemInfo?.itemId || itemId,
    vendorItemId: baseInfoModule?.itemInfo?.vendorItemId || vendorItemId,
    thumbnail: baseInfoModule?.itemInfo?.thumbnailImage?.url || null,
    categoryId: baseInfoModule?.itemInfo?.categoryId || 1,
    bigCategory: baseInfoModule?.itemInfo?.bigCategory || "카테고리",
    category: baseInfoModule?.itemInfo?.category || "신규",
  };

  const query = `INSERT INTO products (id, bigCategory, category, productId, vendorItemId, itemId, categoryId, title, thumbnail, price, lowPrice, highPrice, rating, reviewCount, deliveryType, lastUpdated) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const pId = await insertOne(query, [
    param.bigCategory,
    param.category,
    param.productId,
    param.vendorItemId,
    param.itemId,
    param.categoryId,
    param.title,
    param.thumbnail,
    param.finalPrice,
    param.finalPrice,
    param.finalPrice,
    param.rating,
    param.reviewCount,
    param.deliveryType,
  ]);

  return pId;
};
