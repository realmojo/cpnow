import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { token, title, body, link } = reqItems;

    const message = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          icon: "https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/rs_quotation_api/viuyklb9/8d26f43fcce84dcdb73bd314fcae2bed.jpg",
        },
        fcm_options: {
          link: link || "https://cpnow.kr",
        },
      },
    };

    const response = await messaging.send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
