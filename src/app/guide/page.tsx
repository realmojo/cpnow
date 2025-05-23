"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-2xl font-bold">사용법 안내</h1>

      <Tabs defaultValue="pc" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pc">PC 사용법</TabsTrigger>
          <TabsTrigger value="mobile">모바일 사용법</TabsTrigger>
        </TabsList>

        <TabsContent value="pc">
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🖥️ PC에서 시피나우를 사용하려면 알림 허용이 필수입니다
            </h2>

            {/* STEP 1 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
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
              <img
                src="/guide/cpnow-guide-1.png"
                alt="브라우저 알림 허용 팝업 예시"
                className="w-full max-w-lg rounded-md border shadow-md"
              />
            </section>

            {/* STEP 2 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                2. 팝업을 못 봤다면, 수동 설정도 가능합니다
              </h3>
              <ul className="list-inside list-disc leading-relaxed text-gray-700">
                <li>
                  주소창 왼쪽의 자물쇠 아이콘 클릭 →{" "}
                  <strong>사이트 설정</strong> →
                  <strong>🔔 알림 항목을 허용</strong>으로 변경
                </li>
                <li>
                  또는{" "}
                  <code className="rounded bg-gray-100 px-1">
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
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                3. 팝업 차단 기능이 알림 표시를 방해할 수 있습니다
              </h3>
              <p className="leading-relaxed text-gray-700">
                일부 브라우저 확장 프로그램이나 백신 프로그램에서{" "}
                <strong>팝업 차단</strong>이 활성화되어 있을 경우, 알림 요청이
                제대로 표시되지 않을 수 있습니다.
                <br />
                이럴 땐 해당 기능을 일시적으로 꺼주거나,{" "}
                <strong>예외 목록에 cpnow.kr을 추가</strong>해 주세요.
              </p>
            </section>

            {/* STEP 4 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                4. 크롬 확장 프로그램을 설치하면 더 편리합니다
              </h3>
              <p className="leading-relaxed text-gray-700">
                시피나우를 더 편리하게 이용하려면 공식 크롬 확장 프로그램을
                설치하세요. <br />
                확장 프로그램을 설치하면{" "}
                <strong>쿠팡 최저가 상품 알림 버튼</strong>이 각 상품 페이지에
                자동으로 표시되며,
                <strong>원클릭으로 관심 상품을 등록</strong>할 수 있습니다.
              </p>
              <ul className="list-inside list-disc text-gray-700">
                <li>설치 후 로그인 없이 바로 사용 가능</li>
                <li>모든 쿠팡 상품 페이지에서 실시간 최저가 추적 버튼 노출</li>
                <li>배경 실행으로 웹서핑 중 자동 추적 가능</li>
              </ul>

              <div className="mt-4">
                <a
                  href="https://chromewebstore.google.com/detail/pbmbahoojpmbpjcppobdcabgoigpcgce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  🚀 크롬 확장 프로그램 설치하기
                </a>
              </div>

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
                <br />
                지금 바로{" "}
                <a href="https://cpnow.kr" className="text-blue-600 underline">
                  https://cpnow.kr
                </a>
                에 접속해 설정을 확인하세요.
              </p>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="mobile">
          <div className="mt-4 space-y-3">
            <h2 className="text-xl font-semibold">모바일에서의 사용 방법</h2>
            <p>
              여기에 모바일 사용자를 위한 설명을 작성하세요. 예: 사파리
              브라우저에서 [공유 버튼] → [홈 화면에 추가]를 선택하면 앱처럼
              사용하실 수 있습니다.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
