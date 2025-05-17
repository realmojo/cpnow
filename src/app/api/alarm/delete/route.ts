import { NextRequest } from "next/server";
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

      query = "UPDATE users SET isDeleted = 1 WHERE userId = ?";
      await queryOne<any>(query, [userId]);
    } else {
      if (!userId || !pId) {
        return new Response(
          JSON.stringify({ error: "Missing userId or pId parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      let query = "";
      query = "DELETE FROM user_alarms WHERE userId = ? AND pId = ?";
      await queryOne<any>(query, [userId, pId]);
    }

    // ✅ 결과 반환
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
