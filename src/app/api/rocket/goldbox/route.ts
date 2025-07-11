// app/api/coupang/goldbox/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import moment from "moment";
import { addNewProduct } from "@/src/app/api/product/add/common";
import { queryList } from "@/lib/db";

// 전역 캐시 (서버 cold start 시 초기화됨)
let lastFetchedTime: Date | null = null;
let cachedData: any = null;

// HMAC 서명 생성
const generateHmac = (
  method: string,
  url: string,
  secretKey: string,
  accessKey: string,
) => {
  const parts = url.split("?");
  const [path, query = ""] = parts;

  const datetime = moment.utc().format("YYMMDD[T]HHmmss[Z]");
  const message = datetime + method + path + query;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
};

// 다음 7:30 AM 반환
const getNext0730 = (ref: Date) => {
  const tomorrow = new Date(ref);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 30, 0, 0);
  return tomorrow;
};

const extractIds = (product: any) => {
  const { productId, productUrl } = product;
  const urlParams = new URLSearchParams(productUrl.split("?")[1]);
  return {
    productId,
    itemId: urlParams.get("itemId"),
    vendorItemId: urlParams.get("vendorItemId"),
  };
};

export async function GET() {
  const now = new Date();

  // 기존 캐시가 있고, 다음 7:30 전이면 캐시 반환
  if (lastFetchedTime && cachedData) {
    const next730 = getNext0730(lastFetchedTime);
    if (now < next730) {
      console.log("cachedData 캐싱 호출");
      return NextResponse.json({ status: "ok", cache: true, data: cachedData }); // ✅ 캐시 반환
    }
  }

  // 쿠팡 API 요청
  const DOMAIN = "https://api-gateway.coupang.com";
  const METHOD = "GET";
  const PATH =
    "/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox";
  const subId = "cpnowcoupang";
  const url = `${PATH}?subId=${subId}`;
  const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY ?? "";
  const SECRET_KEY = process.env.COUPANG_SECRET_KEY ?? "";
  console.log(ACCESS_KEY, SECRET_KEY);
  const authorization = generateHmac(METHOD, url, SECRET_KEY, ACCESS_KEY);

  console.log(authorization);

  try {
    const response = await fetch(`${DOMAIN}${url}`, {
      method: METHOD,
      headers: { Authorization: authorization },
    });

    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `쿠팡 API 오류 (${response.status}): ${response.statusText}\n${errorText}`,
      );
    }

    const res = await response.json();

    console.log(res);

    // ✅ 캐시 갱신
    lastFetchedTime = now;

    // 골드박스에서 아이템 없으면 신규 등록

    const pIds = [];
    for (const item of res.data) {
      const { productId, itemId, vendorItemId } = extractIds(item);

      const query =
        "SELECT * FROM products p where productId = ? AND itemId = ? AND vendorItemId = ?";
      const products = await queryList(query, [
        productId,
        itemId,
        vendorItemId,
      ]);

      const product = products.length > 0 ? products[0] : null;
      let pId = 0;
      if (product === null) {
        const productParams = {
          productId: productId,
          itemId: itemId,
          vendorItemId: vendorItemId,
        };
        pId = await addNewProduct(productParams);
      } else {
        pId = products[0].id;
      }

      if (pId) {
        pIds.push(pId);
      }
    }

    // 쿼리 실행
    const placeholders = pIds.map(() => "?").join(", ");
    const query = `SELECT * FROM products WHERE id IN (${placeholders})`;
    const items = await queryList(query, pIds); // pIds는 [1,2,3,...]

    const mergedItems = items.map((item) => {
      const matched = res.data.find(
        (prod: any) => prod.productId === item.productId,
      );

      return {
        ...item,
        ...(matched ?? {}), // 매칭된 정보가 있으면 병합, 없으면 무시
      };
    });

    cachedData = mergedItems;
    console.log("cachedData 미캐싱 호출");
    return NextResponse.json({
      status: "ok",
      cache: false,
      data: cachedData,
    }); // ✅ 캐시 반환
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
