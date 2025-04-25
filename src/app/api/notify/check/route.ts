import { NextRequest } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { token } = reqItems;
    const message = {
      token,
      data: {
        check: "validity",
        silent: "true",
      },
    };
    const response = await messaging.send(message);
    console.log("✅ 유효한 토큰입니다:", response);

    return new Response(
      JSON.stringify({ success: true, messageId: response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(err);
    if (
      errorMessage ===
      "The registration token is not a valid FCM registration token"
    ) {
    } else if (errorMessage === "Requested entity was not found") {
    }
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
