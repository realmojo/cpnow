import { NextRequest } from "next/server";
import { insertOne } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pId, price } = body;

    if (!pId || !price) {
      return new Response(
        JSON.stringify({ success: false, error: "pId 또는 price 누락" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const query = `
      INSERT INTO product_prices (id, pId, price, regdated)
      VALUES (NULL, ?, ?, NOW())
    `;

    await insertOne(query, [pId, price]);

    return new Response(
      JSON.stringify({ success: true, message: "가격 기록 완료" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("addProductPrice 오류:", errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
