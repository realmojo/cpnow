import { NextRequest } from "next/server";
import { queryList } from "@/lib/db";

// ✅ 내 알람
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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
    let items = [];
    query =
      "SELECT * FROM products WHERE id IN (SELECT pId FROM user_alarms WHERE userId = ? ORDER BY regdated DESC);";
    items = await queryList<any>(query, [userId]);

    // ✅ 결과 반환
    return new Response(JSON.stringify(items), {
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
