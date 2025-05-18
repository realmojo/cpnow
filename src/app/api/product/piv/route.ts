import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const itemId = searchParams.get("itemId");
    const vendorItemId = searchParams.get("vendorItemId");

    if (!productId || !itemId || !vendorItemId) {
      return NextResponse.json({ error: "Missing parameter" }, { status: 400 });
    }

    const query =
      "SELECT * FROM products p where productId = ? AND itemId = ? AND vendorItemId = ?";
    const product = await queryList(query, [productId, itemId, vendorItemId]);

    // ✅ 결과 반환
    return NextResponse.json(product);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
