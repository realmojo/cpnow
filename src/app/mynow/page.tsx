"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuthInfo {
  userId: string;
  fcmToken: string;
}

export default function LocalAuthViewer() {
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cpnow-auth");
      if (!stored) {
        setError("❌ cpnow-auth 값이 존재하지 않습니다.");
        return;
      }

      const parsed = JSON.parse(stored);
      if (parsed.userId && parsed.fcmToken) {
        setAuth({
          userId: parsed.userId,
          fcmToken: parsed.fcmToken,
        });
      } else {
        setError("❗ userId 또는 fcmToken이 포함되어 있지 않습니다.");
      }
    } catch (e: unknown) {
      console.log(e);
      setError("❌ JSON 파싱 중 오류가 발생했습니다.");
    }
  }, []);

  return (
    <div className="mx-auto mt-6 max-w-md px-4">
      <Card>
        <CardContent className="space-y-4 py-6">
          <h2 className="text-xl font-semibold text-gray-800">
            🔐 cpnow-auth 정보
          </h2>

          {auth ? (
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">👤 userId: </span>
                <Badge variant="outline" className="ml-2">
                  {auth.userId}
                </Badge>
              </div>
              <div>
                <span className="font-medium">📬 fcmToken:</span>
                <p className="mt-1 rounded bg-gray-100 p-2 text-xs break-words text-gray-800">
                  {auth.fcmToken}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600">{error ?? "로딩 중..."}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
