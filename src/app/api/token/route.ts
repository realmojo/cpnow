import { NextRequest } from "next/server";
import { insertOne } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fcmToken = searchParams.get("fcmToken");
    if (!userId && !fcmToken) {
      throw new Error("no parameter");
    }

    const query = "DELETE FROM users WHERE userId= ? AND fcmToken= ?";
    await insertOne(query, [userId, fcmToken]);

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

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const query =
      "INSERT INTO users (userId, fcmToken, regdated) VALUES (?, ?, NOW())";
    await insertOne(query, [params.userId, params.fcmToken]);

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
