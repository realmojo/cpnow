import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList } from "@/lib/db";

export async function GET() {
  try {
    const query = `SELECT p.* FROM product_prices pp INNER JOIN products p ON pp.pId = p.id AND p.price != 0 ORDER BY pp.id DESC LIMIT 50;`;

    const result = await queryList(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching recently discounted products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pId, price } = body;

    if (!pId || !price) {
      return NextResponse.json(
        { success: false, error: "pId 또는 price 누락" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO product_prices (id, pId, price, regdated)
      VALUES (NULL, ?, ?, NOW())
    `;

    await insertOne(query, [pId, price]);

    return NextResponse.json({
      success: true,
      message: "가격 기록 완료",
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("addProductPrice 오류:", errorMessage);

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
