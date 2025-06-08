import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList, queryOne } from "@/lib/db";
import {
  extractCoupangParams,
  extractRedirectUrlFromHtml,
} from "@/utils/utils";
import { addNewProduct } from "@/src/app/api/product/add/common";
import axios from "axios";

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
          productId = params.productId ?? "";
          itemId = params.itemId ?? "";
          vendorItemId = params.vendorItemId ?? "";
        }
      } catch (error) {
        throw new Error(error as string);
      }
    } else if (link.includes("https://www.coupang.com/vp/products/")) {
      const params = extractCoupangParams(link);
      productId = params.productId ?? "";
      itemId = params.itemId ?? "";
      vendorItemId = params.vendorItemId ?? "";
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

    query = "SELECT * FROM products p where id = ?";
    const addProduct = await queryOne(query, [params.pId]);

    // ✅ 결과 반환
    return NextResponse.json({ success: true, product: addProduct });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
