import { insertOne } from "@/lib/db";
import { NextRequest } from "next/server";

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const bodyItems = await req.json();
    const { userId, productId } = bodyItems;

    const query =
      "INSERT INTO user_alarms (id, userId, productId, regdated) VALUES (NULL, ?, ?, CONVERT_TZ(NOW(), 'UTC', '+09:00'))";

    await insertOne(query, [userId, productId]);

    return new Response(JSON.stringify({ success: true, data: "ok" }), {
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
