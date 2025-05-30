import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 알람조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      throw new Error("no user Id");
    }

    const query =
      "SELECT a.id as aId, a.userId, a.type, a.comment, a.isReaded, a.regdated, p.id as pId, p.title, p.thumbnail, p.price, p.highPrice, p.lowPrice FROM alarms a INNER JOIN products p ON a.pId = p.id WHERE a.userId = ?;";
    const items = await queryList<any>(query, [userId]);

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
