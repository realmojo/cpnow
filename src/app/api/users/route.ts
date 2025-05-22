import { NextResponse } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET() {
  try {
    const query = "SELECT * FROM users ORDER BY regdated DESC LIMIT 100";
    const items = await queryList<any>(query);

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
