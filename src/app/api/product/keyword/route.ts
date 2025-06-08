import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { error: "Missing keyword parameter" },
        { status: 400 },
      );
    }

    const query = `SELECT * FROM products WHERE MATCH(title) AGAINST('${keyword}'  IN NATURAL LANGUAGE MODE) LIMIT 100;`;
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
