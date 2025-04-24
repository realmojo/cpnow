import { NextRequest } from "next/server";
// import { getTodayDate } from "@/utils/utils";
// import { pool } from "@/lib/db";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    console.log(req);
    // ✅ URL에서 id 파라미터 추출
    const d = await axios.get(
      "https://db36-116-38-134-229.ngrok-free.app/api/test",
    );

    // ✅ 결과 반환
    return new Response(JSON.stringify(d), {
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
