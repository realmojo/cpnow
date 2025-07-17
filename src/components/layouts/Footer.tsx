"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [isVisibleToken, setIsVisibleToken] = useState(false);
  return (
    <footer className="mb-20 w-full border-t bg-gray-50 py-6 text-sm text-gray-600">
      <div className="container mx-auto px-4 text-center">
        {/* 로고 & 숨겨진 토큰 영역 */}
        <div className="mb-3 flex items-center justify-center gap-2">
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
            <div className="ml-2">
              <p className="text-xs text-gray-500">
                토큰: {localStorage.getItem("cpnow-auth")}
              </p>
            </div>
          )}
        </div>

        {/* 서비스 설명 */}
        <p className="leading-relaxed text-gray-600">
          <strong>시피나우(CPNOW)</strong>는 쿠팡 상품의 가격 변동을 실시간으로
          모니터링하고, 최적의 구매 타이밍을 알려주는 스마트 쇼핑 알림
          서비스입니다.
          <br />
          일부 링크는 쿠팡 파트너스 활동을 통해 일정 수수료를 제공받을 수
          있습니다.
        </p>

        {/* 법적 정보 */}
        <div className="mt-4 space-y-1 text-xs leading-relaxed text-gray-500">
          <p>
            <strong>상호명</strong>: 모조데이(Mojoday)
          </p>
          <p>
            <strong>대표자</strong>: 정만경
          </p>
          <p>
            <strong>사업자등록번호</strong>: 259-13-02051
          </p>
          <p>
            <strong>주소</strong>: 서울시 영등포구 선유로 71
          </p>
        </div>

        {/* 개인정보처리방침 */}
        <div className="mt-3">
          <Link
            href="/privacy"
            className="text-xs text-gray-500 hover:underline"
          >
            개인정보처리방침 보기
          </Link>
        </div>

        {/* 카피라이트 */}
        <p className="mt-4 text-xs text-gray-400">
          © 2025 시피나우(CPNOW). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
