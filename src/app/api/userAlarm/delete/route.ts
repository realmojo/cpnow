import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

// ✅ 내 알람
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const pId = searchParams.get("pId");
    const all = searchParams.get("all");

    if (all === "true") {
      // 알람초기화 및 계정 삭제
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing userId parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      let query = "";
      query = "DELETE FROM user_alarms WHERE userId = ?";
      await queryOne<any>(query, [userId]);

      // query = "DELETE FROM users WHERE userId = ?";
      // await queryOne<any>(query, [userId]);
    } else {
      if (!userId || !pId) {
        return NextResponse.json(
          { error: "Missing userId or pId parameter" },
          { status: 400 },
        );
      }

      let query = "";
      query = "DELETE FROM user_alarms WHERE userId = ? AND pId = ?";
      await queryOne<any>(query, [userId, pId]);
    }

    // ✅ 결과 반환
    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
