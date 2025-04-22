import { NextRequest } from "next/server";
import axios from "axios";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fcmToken = searchParams.get("fcmToken");

    const url = "https://api.mindpang.com/api/cpnow/deleteUserFcmToken.php";
    if (!userId && !fcmToken) {
      throw new Error("no parameter");
    }
    const { data: data } = await axios.post(url, {
      userId,
      fcmToken,
    });

    return new Response(JSON.stringify(data), {
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

// ✅ POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    const url = "https://api.mindpang.com/api/cpnow/addUserFcmToken.php";
    const { data } = await axios.post(url, params);

    return new Response(JSON.stringify({ success: true, data }), {
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
