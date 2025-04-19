import { NextRequest } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, title, body: content, link } = body;

    const message = {
      token,
      notification: {
        title,
        body: content,
      },
      webpush: {
        notification: {
          title,
          body: content,
          icon: "/icons/android-icon-192x192.png",
          click_action: link || "https://cpnow.kr",
        },
        fcm_options: {
          link: link || "https://cpnow.kr",
        },
      },
    };

    const response = await messaging.send(message);

    return new Response(
      JSON.stringify({ success: true, messageId: response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
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
