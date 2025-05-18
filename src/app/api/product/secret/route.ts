import { queryOne } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    // ✅ 전체 개수
    const query = "SELECT count(*) as cnt FROM products";
    const count = await queryOne(query);

    // ✅ 결과 반환
    return NextResponse.json(count);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
