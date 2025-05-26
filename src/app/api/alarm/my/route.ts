import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 내 알람
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    let query = "";
    let items = [];
    query =
      "SELECT p.* FROM products p INNER JOIN user_alarms ua ON p.id = ua.pId WHERE ua.userId = ? ORDER BY ua.regdated DESC;";
    items = await queryList<any>(query, [userId]);

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
