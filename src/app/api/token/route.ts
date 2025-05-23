import { NextRequest, NextResponse } from "next/server";
import { insertOne, updateOne } from "@/lib/db";

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
// ✅ PATCH 토큰 갱신 요청 처리
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      throw new Error("no parameter");
    }

    const { fcmToken, userId, joinType } = params;

    const query =
      "INSERT INTO users (userId, fcmToken, joinType, regdated) VALUES (?, ?, ?, NOW())";
    await insertOne(query, [userId, fcmToken, joinType]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// ✅ PATCH 토큰 갱신 요청 처리
export async function PATCH(req: NextRequest) {
  try {
    const params = await req.json();

    if (!params.fcmToken || !params.userId) {
      throw new Error("no parameter");
    }

    const { fcmToken, userId } = params;

    const query =
      "UPDATE users SET fcmToken= ?, lastUpdated= NOW() WHERE userId= ?";
    await updateOne(query, [fcmToken, userId]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
