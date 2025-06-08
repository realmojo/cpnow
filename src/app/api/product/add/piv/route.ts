import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList } from "@/lib/db";
import { addNewProduct } from "@/src/app/api/product/add/common";

export async function POST(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const reqItems = await req.json();
    const { userId, productId, itemId, vendorItemId } = reqItems;

    if (!userId || !productId || !itemId || !vendorItemId) {
      return NextResponse.json({ error: "Missing parameter" }, { status: 400 });
    }

    let query =
      "SELECT * FROM products p where productId = ? AND itemId = ? AND vendorItemId = ?";
    const products = await queryList(query, [productId, itemId, vendorItemId]);

    console.log(query);
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
