"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  detectDevice,
  getUserAuth,
  isWebView,
  sendNotificationTest,
  setUserAuth,
} from "@/utils/utils";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NotSupported from "../components/NotSupported";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showPermissionMessage, setShowPermissionMessage] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const auth = getUserAuth();
      if (auth) {
        // 알림 권한 확인
        if ("Notification" in window) {
          const permission = Notification.permission;
          if (permission === "granted") {
            // 알림 허용 + userId 있음 → /mynow로 이동
            router.push("/mynow");
          } else if (permission === "denied" || permission === "default") {
            // 알림 거부/기본값 → 권한 요청 메시지 표시
            setShowPermissionMessage(true);
          }
        } else if (isWebView()) {
          router.push("/mynow");
          // 브라우저가 알림을 지원하지 않는 경우
          // console.log("이 브라우저는 알림을 지원하지 않습니다.");
          // router.push("/mynow");
        } else {
          // console.log("이 브라우저는 알림을 지원하지 않습니다.");
          setIsAvailable(false);
        }
      } else {
        // userId가 없으면 로그인 페이지로 (기존 로직 유지)
        // router.push("/login");
      }
    };
    checkAuthAndRedirect();
  }, [router]);

  const handleRequestPermission = async () => {
    setLoading(true);
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          // 권한 허용시 /mynow로 이동

          if (messaging) {
            // FCM 토큰 받아오기
            const userId = nanoid(12);
            const fcmToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            });

            const cpnowInfo = {
              userId,
              joinType: "web",
              fcmToken,
            };
            const res = await fetch("/api/token", {
              method: "POST",
              body: JSON.stringify(cpnowInfo),
            });
            const r = await res.json();
            if (r.data === "ok") {
              setUserAuth(cpnowInfo);
              console.log("🔔 토큰 저장", cpnowInfo);
            }

            if (detectDevice().isDesktop) {
              sendNotificationTest();
            }
            router.push("/mynow");
          }
        } else {
          // 권한 거부시 메시지 유지
          alert(
            "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.",
          );
        }
      } catch (error) {
        console.error("알림 권한 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkip = () => {
    // 알림 없이 진행
    router.push("/now");
  };

  if (!isAvailable) {
    return <NotSupported />;
  }

  if (showPermissionMessage) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-start justify-center pt-20">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              알림 권한이 필요해요
            </h2>
            <p className="text-gray-600">
              중요한 업데이트와 소식을 놓치지 않도록
              <br />
              알림을 허용해주세요.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              disabled={loading}
              onClick={() => handleRequestPermission()}
              className="text-md text-md w-full rounded-lg bg-blue-600 px-4 py-6 text-white transition-colors hover:bg-blue-700"
            >
              알림 허용하기
              {loading ?? <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>

            <Button
              onClick={handleSkip}
              className="text-md text-md w-full rounded-lg bg-gray-100 px-4 py-6 text-gray-700 transition-colors hover:bg-gray-200"
            >
              나중에 설정하기
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            알림은 언제든 브라우저 설정에서 변경할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 중이거나 권한 확인 중
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-start justify-center pt-40">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}
