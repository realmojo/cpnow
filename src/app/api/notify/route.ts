import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin"; // firebase-admin 초기화된 인스턴스

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const reqItems = await req.json();
    const { token, title, body, link, icon } = reqItems;
    //      data?: {
    //         [key: string]: string;
    //     };
    //     notification?: Notification;
    //     android?: AndroidConfig;
    //     webpush?: WebpushConfig;
    //     apns?: ApnsConfig;
    //     fcmOptions?: FcmOptions;
    const message = {
      token,
      notification: {
        title,
        body,
        image: icon || "https://cpnow.kr/icons/android-icon-48x48.png",
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
            // "content-available": 1,
            // // 포그라운드에서도 소리와 배지 표시
            alert: {
              // 이 부분이 중요!
              title: title,
              body: body,
            },
            sound: "default",
            badge: 1,
          },
        },
        fcm_options: {
          image: icon || "https://cpnow.kr/icons/android-icon-48x48.png",
        },
      },
      data: {
        link: link || "https://cpnow.kr",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        // Android용 설정 분리
        notification: {
          title,
          body,
          image: icon || "https://cpnow.kr/icons/android-icon-48x48.png",
        },
      },
      webpush: {
        fcm_options: {
          link: link || "https://cpnow.kr",
        },
      },
    };

    console.log(message);

    const response = await messaging.send(message as any);

    return NextResponse.json({ success: true, messageId: response });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
