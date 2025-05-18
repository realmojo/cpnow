import { NextRequest, NextResponse } from "next/server";
import { insertOne, queryList } from "@/lib/db";

// ✅ 크롤링 대기
export async function GET() {
  try {
    const query =
      "SELECT * FROM crawl_wait WHERE lastUpdated IS NULL OR DATE(lastUpdated) != CURRENT_DATE() ORDER BY type, lastUpdated ASC LIMIT 100";
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
// ✅ 크롤링 대기
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { pId } = reqItems;

    if (!pId) {
      throw new Error("no parameter");
    }

    const query = "UPDATE crawl_wait SET lastUpdated = NOW() WHERE pId = ?";

    await insertOne(query, [pId]);

    // ✅ 결과 반환
    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pId = searchParams.get("pId");
    if (!pId) {
      throw new Error("no parameter");
    }

    const query = "DELETE FROM crawl_wait WHERE pId= ?";
    await insertOne(query, [pId]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
