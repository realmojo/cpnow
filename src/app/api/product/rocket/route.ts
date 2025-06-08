import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Missing type parameter" },
        { status: 400 },
      );
    }

    let deliveryType = 0;
    if (type === "rocket") {
      deliveryType = 1;
    } else if (type === "rocket_fresh") {
      deliveryType = 4;
    }

    const query = `SELECT *
FROM products p
WHERE id IN (
  SELECT pid
  FROM product_prices
  WHERE regdated >= NOW() - INTERVAL 7 DAY
  GROUP BY pid
  HAVING COUNT(DISTINCT price) > 1
) AND p.deliveryType = ? LIMIT 10`;
    const items = await queryList<any>(query, [deliveryType]);

    // ✅ 결과 반환
    return NextResponse.json(items);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
