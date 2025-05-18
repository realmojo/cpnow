import { NextRequest, NextResponse } from "next/server";
import { queryList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    const query = `SELECT * FROM user_alarms ua LEFT JOIN users u ON ua.userId = u.userId WHERE ua.pId = ?`;
    const product = await queryList(query, [id]);

    // ✅ 결과 반환
    return NextResponse.json(product);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
