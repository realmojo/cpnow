import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { token, title, body, link, icon } = reqItems;

    const message = {
      token,
      data: {
        title,
        body,
        icon: icon || "https://cpnow.kr/icons/android-icon-48x48.png",
        link: link || "https://cpnow.kr",
      },
      webpush: {
        fcm_options: {
          link: link || "https://cpnow.kr",
        },
      },
    };

    const response = await messaging.send(message as any);

    return NextResponse.json({ success: true, messageId: response });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
