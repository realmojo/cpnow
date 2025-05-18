import { insertOne, queryList, queryOne } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const getProduct = async (
  productId: string,
  itemId: string,
  vendorItemId: string,
  categoryId: string,
) => {
  const query =
    "SELECT * FROM products WHERE productId = ? AND itemId = ? AND vendorItemId = ? AND categoryId = ?";
  const product = await queryOne(query, [
    productId,
    itemId,
    vendorItemId,
    categoryId,
  ]);

  return product;
};

export async function POST(req: NextRequest) {
  try {
    const bodyItems = await req.json();
    const {
      userId,
      bigCategory,
      category,
      productId,
      vendorItemId,
      itemId,
      categoryId,
      title,
      thumbnail,
      link,
      price,
      lowPrice,
      highPrice,
      deliveryType,
      rating,
      reviewCount,
    } = bodyItems;

    let product = await getProduct(productId, itemId, vendorItemId, categoryId);

    let query = "";
    if (!product) {
      try {
        query =
          "INSERT INTO products (id, bigCategory, category, productId, vendorItemId, itemId, categoryId, title, thumbnail, link, price, lowPrice, highPrice, deliveryType, rating, reviewCount, lastUpdated) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        await insertOne(query, [
          bigCategory,
          category,
          productId,
          vendorItemId,
          itemId,
          categoryId,
          title,
          thumbnail,
          link,
          price,
          lowPrice,
          highPrice,
          deliveryType,
          rating,
          reviewCount,
        ]);

        product = await getProduct(productId, itemId, vendorItemId, categoryId);
      } catch (err) {
        console.log(err);
      }
    }

    const { id: pId } = product;
    query =
      "INSERT IGNORE INTO user_alarms (id, userId, pId, regdated) VALUES (NULL, ?, ?, NOW())";
    await insertOne(query, [userId, pId]);

    // // 대기 알람에도 넣어주기
    query =
      "INSERT INTO crawl_wait (pId, type, regdated) VALUES (?, 'alarm', NOW()) ON DUPLICATE KEY UPDATE type = 'alarm';";
    await insertOne(query, [pId]);

    query =
      "SELECT * FROM products WHERE id IN (SELECT pId FROM user_alarms WHERE userId = ? ORDER BY regdated DESC);";
    const items = await queryList<any>(query, [userId]);

    return NextResponse.json(items);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
