import { insertOne } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const bodyItems = await req.json();
    const { userId, pId } = bodyItems;

    let query =
      "INSERT IGNORE INTO user_alarms (id, userId, pId, regdated) VALUES (NULL, ?, ?, NOW())";
    await insertOne(query, [userId, pId]);

    // 대기 알람에도 넣어주기
    query =
      "INSERT INTO crawl_wait (pId, type, regdated) VALUES (?, 'alarm', NOW()) ON DUPLICATE KEY UPDATE type = 'alarm';";
    await insertOne(query, [pId]);

    return NextResponse.json({ success: true, data: "ok" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
