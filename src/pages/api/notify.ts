import type { NextApiRequest, NextApiResponse } from "next";
import { messaging } from "@/lib/firebase-admin";
export const runtime = "nodejs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { token, title, body, link } = req.body;

  try {
    const params = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          title,
          body,
          icon: "/icons/android-icon-192x192.png",
          click_action: link, // 클릭 시 이동
        },
        fcm_options: {
          link: link, // PWA 앱에서 중요
        },
      },
    };
    const response = await messaging.send(params);
    return res.status(200).json({ success: true, messageId: response });
  } catch (e: unknown) {
    return res
      .status(500)
      .json({ success: false, error: e instanceof Error ? e.message : e });
  }
}
