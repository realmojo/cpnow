import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

// ✅ user 정보 가져오기
export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 id 파라미터 추출
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    const query = "SELECT * FROM users WHERE userId = ?";
    const user = await queryOne(query, [userId]);

    // ✅ 결과 반환
    return NextResponse.json(user);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }
    const {
      isMyAlarm,
      isPriceAlarm,
      isBlockAlarm,
      blockStartTime,
      blockEndTime,
    } = await req.json();
    // 1. UPDATE
    const updateQuery =
      "UPDATE users SET isMyAlarm = ?, isPriceAlarm = ?, isBlockAlarm = ?, blockStartTime = ?, blockEndTime = ? WHERE userId = ?";

    await queryOne(updateQuery, [
      isMyAlarm,
      isPriceAlarm,
      isBlockAlarm,
      blockStartTime,
      blockEndTime,
      userId,
    ]);

    // 2. SELECT로 변경된 값 조회
    const selectQuery =
      "SELECT isMyAlarm, isPriceAlarm, isBlockAlarm, blockStartTime, blockEndTime FROM users WHERE userId = ?";

    const updatedUser = await queryOne(selectQuery, [userId]);
    return NextResponse.json(updatedUser);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
