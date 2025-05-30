"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-2xl font-bold">사용법 안내</h1>

      <Tabs defaultValue="pc" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mobile">모바일 사용법</TabsTrigger>
          <TabsTrigger value="pc">PC 사용법</TabsTrigger>
        </TabsList>

        <TabsContent value="pc">
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🖥️ PC에서 시피나우를 사용하려면 알림 허용이 필수입니다
            </h2>

            {/* STEP 1 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                1. 웹사이트 접속 후, 알림 허용 팝업을 확인하세요
              </h3>
              <p className="leading-relaxed text-gray-700">
                <a
                  href="https://cpnow.kr"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://cpnow.kr
                </a>
                에 처음 접속하면 다음과 같은 브라우저 팝업이 나타납니다.
                <br />
                <strong>“알림을 표시하시겠습니까?”</strong>라는 메시지가 보이며,
                여기서 <strong>“허용”</strong> 버튼을 눌러야 정상적으로 알림을
                받을 수 있습니다.
              </p>
              <div className="mx-auto w-[360px] space-y-5 rounded-xl border border-gray-300 bg-white p-6 text-center font-sans shadow-lg">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-.962.784-1.746 1.746-1.746s1.746.784 1.746 1.746c0 .962-.784 1.746-1.746 1.746S12 11.962 12 11zm0 0V9m0 4v2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13V7a2 2 0 012-2h10a2 2 0 012 2v6a7.997 7.997 0 01-4 6.93A7.997 7.997 0 015 13z"
                    />
                  </svg>
                  <span>https://cpnow.kr</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  알림을 허용하시겠습니까?
                </h2>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    className="h-10 w-24 rounded-md border border-gray-300 bg-white text-gray-800 transition hover:bg-gray-100"
                    type="button"
                  >
                    차단
                  </button>
                  <button
                    className="h-10 w-24 rounded-md bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
                    type="button"
                  >
                    허용
                  </button>
                </div>
              </div>
            </section>

            {/* STEP 2 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                2. 팝업을 못 봤다면, 수동 설정도 가능합니다
              </h3>
              <ul className="list-inside list-disc leading-relaxed text-gray-700">
                <li>
                  주소창 왼쪽의 자물쇠 아이콘 클릭 →{" "}
                  <strong>사이트 설정</strong> →
                  <strong>🔔 알림 항목을 허용</strong>으로 변경
                </li>
                <li>
                  <code
                    className="rounded bg-gray-100 px-1"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "chrome://settings/content/siteDetails?site=https%3A%2F%2Fcpnow.kr%2F",
                      );
                      alert("주소가 복사되었습니다.");
                    }}
                  >
                    <a
                      href="chrome://settings/content/siteDetails?site=https%3A%2F%2Fcpnow.kr%2F"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      chrome://settings/content/siteDetails?site=https://cpnow.kr
                    </a>
                  </code>
                  에 직접 접속하여 🔔 알림을 허용으로 변경
                </li>
              </ul>
              <p className="text-sm text-gray-500">
                💡 알림 설정이 꺼져 있으면 실시간 특가 정보를 놓칠 수 있습니다.
              </p>
            </section>

            {/* STEP 3 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                3. 팝업 차단 기능이 알림 표시를 방해할 수 있습니다
              </h3>

              <ul className="list-inside list-disc leading-relaxed text-gray-700">
                <li>
                  일부 브라우저 확장 프로그램이나 백신 프로그램에서{" "}
                  <strong>팝업 차단</strong>이 활성화되어 있을 경우, 알림 요청이
                  제대로 표시되지 않을 수 있습니다.
                </li>
                <li>
                  이럴 땐 해당 기능을 일시적으로 꺼주거나,{" "}
                  <strong>예외 목록에 cpnow.kr을 추가</strong>해 주세요.
                </li>
              </ul>
            </section>

            {/* STEP 4 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                4. 크롬 확장 프로그램을 설치하면 더 편리합니다
              </h3>

              <div className="mt-2">
                <a
                  href="https://chromewebstore.google.com/detail/pbmbahoojpmbpjcppobdcabgoigpcgce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  🚀 크롬 확장 프로그램 설치하기
                </a>
              </div>
              <p className="leading-relaxed text-gray-700">
                시피나우를 더 편리하게 이용하려면 공식 크롬 확장 프로그램을
                설치하세요.
                <br />
                확장 프로그램을 설치하면{" "}
                <strong>쿠팡 최저가 상품 알림 버튼</strong>이 각 상품 페이지에
                자동으로 표시되며,
                <strong>원클릭으로 관심 상품을 등록</strong>할 수 있습니다.
              </p>
              <ul className="list-inside list-disc text-gray-700">
                <li>설치 후 로그인 없이 바로 사용 가능</li>
                <li>모든 쿠팡 상품 페이지에서 실시간 최저가 추적 버튼 노출</li>
              </ul>

              <p className="text-sm text-gray-500">
                🔐 해당 확장 프로그램은 개인정보를 수집하지 않으며, 사용자의
                알림 수신만을 위해 사용됩니다.
              </p>
            </section>

            {/* SUMMARY */}
            <section className="rounded-md border-l-4 border-blue-400 bg-gray-50 p-4">
              <p className="mb-2 font-semibold text-blue-800">
                ✅ 요약: 시피나우 알림 설정은 꼭 필요합니다
              </p>
              <p className="leading-relaxed text-gray-800">
                시피나우는 특가, 품절, 재입고 정보를{" "}
                <strong>웹 푸시 알림</strong>으로 실시간 제공하고 있습니다.
                <br />
                PC에서 이용하려면 반드시 브라우저 알림을 허용해야 하며, 이를
                통해 더 빠르게 정보를 받아보실 수 있습니다.
              </p>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="mobile">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">앱 다운로드</h2>

            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              {/* Google Play 버튼 */}
              <Button
                asChild
                variant="outline"
                className="flex w-full items-center space-x-3 rounded-xl px-6 py-8 shadow-md sm:w-auto"
              >
                <a
                  href="https://play.google.com/store/apps/details?id=com.f5game.cpnow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/icons/playstore-logo.png"
                      alt="Google Play 로고"
                      className="h-7"
                    />
                    <span className="text-lg font-medium">
                      Play 스토어에서 받기
                    </span>
                  </div>
                </a>
              </Button>

              {/* App Store 버튼 */}
              <Button
                asChild
                variant="outline"
                className="flex w-full items-center space-x-3 rounded-xl px-6 py-8 shadow-md sm:w-auto"
              >
                <a
                  href="https://apps.apple.com/kr/app/your-app-id"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/icons/appstore-logo.png"
                      alt="Apple 로고"
                      className="h-6"
                    />
                    <span className="text-lg font-medium">
                      앱스토어에서 받기
                    </span>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
