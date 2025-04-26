"use client";

import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import ProductList from "@/src/components/ProductList";

// interface AuthInfo {
//   userId: string;
//   fcmToken: string;
// }

// ✅ 상품 호출 함수
async function getProductByUserId(userId: string): Promise<any | null> {
  const res = await fetch(`/api/alarm/my?userId=${userId}`, {
    cache: "no-store", // ← SSR 시 실시간 데이터 원할 경우
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export default function LocalAuthViewer() {
  // const [auth, setAuth] = useState<AuthInfo | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [myProductsItems, setMyProductsItems] = useState<any[]>([]);

  const initData = async () => {
    const stored = localStorage.getItem("cpnow-auth");
    if (!stored) {
      // setError("❌ cpnow-auth 값이 존재하지 않습니다.");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed?.userId) {
      const data = await getProductByUserId(parsed.userId);
      setMyProductsItems(data);
    }
  };

  useEffect(() => {
    initData();
    //   const stored = localStorage.getItem("cpnow-auth");
    //   if (!stored) {
    //     setError("❌ cpnow-auth 값이 존재하지 않습니다.");
    //     return;
    //   }

    //   const parsed = JSON.parse(stored);
    //   if (parsed.userId && parsed.fcmToken) {
    //     setAuth({
    //       userId: parsed.userId,
    //       fcmToken: parsed.fcmToken,
    //     });
    //     initData(parsed.userId);
    //   } else {
    //     setError("❗ userId 또는 fcmToken이 포함되어 있지 않습니다.");
    //   }
    // } catch (e: unknown) {
    //   console.log(e);
    //   setError("❌ JSON 파싱 중 오류가 발생했습니다.");
    // }
  }, []);

  return (
    <article>
      {/* <div className="mx-auto mt-6 max-w-md px-4">
        <Card>
          <CardContent className="space-y-4 py-6">
            <h2 className="text-xl font-semibold text-gray-800">
              🔐 내 정보
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
      </div> */}

      <section className="mt-8 flex justify-center">
        <div className="w-[800px] px-4">
          <h2 className="font-heading scroll-m-20 border-none text-2xl font-bold tracking-tight first:mt-0 sm:border-b">
            내 알람 리스트
          </h2>

          {myProductsItems && myProductsItems.length > 0 ? (
            <ProductList items={myProductsItems} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 text-4xl">🔔</div>
              <p className="text-lg font-semibold text-gray-700">
                아직 등록된 알람이 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                상품을 등록하고 가격 변동 알림을 받아보세요!
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
