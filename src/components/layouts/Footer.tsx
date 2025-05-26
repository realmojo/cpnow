"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [isVisibleToken, setIsVisibleToken] = useState(false);
  return (
    <footer className="w-full border-t bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <div className="mb-2 flex justify-center">
          <Image
            src="/icons/apple-icon-60x60.png"
            alt="CPNOW 로고"
            width={30}
            height={30}
            priority
            onDoubleClick={() => {
              setIsVisibleToken(true);
            }}
          />
          {isVisibleToken && (
            <div>
              <p>토큰: {localStorage.getItem("cpnow-auth")}</p>
            </div>
          )}
        </div>
        <p className="mt-1 leading-relaxed text-gray-600">
          <strong>시피나우(CPNOW)</strong>는 쿠팡 상품의 가격 변동을 실시간으로
          모니터링하고 소비자에게 가장 유리한 시점을 안내하는 스마트 쇼핑 알림
          서비스입니다. 일부 링크에는 쿠팡 파트너스 활동을 통한 일정액의
          수수료를 제공받습니다.
        </p>
        <p className="mt-2 text-gray-400">
          © 2025 시피나우(CPNOW). All rights reserved.
        </p>

        {/* ✅ 개인정보처리방침 링크 추가 */}
        <div className="mt-3">
          <Link
            href="/privacy"
            className="text-xs text-gray-500 hover:underline"
          >
            개인정보처리방침 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}
