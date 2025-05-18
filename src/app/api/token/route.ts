import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const query =
      "INSERT INTO users (userId, fcmToken, joinType, regdated) VALUES (?, ?, ?, NOW())";
    await insertOne(query, [params.userId, params.fcmToken, params.joinType]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
