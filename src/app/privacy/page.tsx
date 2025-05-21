// app/privacy-policy/page.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <Head>
        <title>
          시피나우(CPnow) 개인정보처리방침 | 쿠팡 최저가 알림 서비스
        </title>
      </Head>

      <h1 className="mb-4 text-center text-3xl font-bold">
        시피나우(CPnow) 개인정보처리방침
      </h1>
      <p className="text-muted-foreground text-center text-sm">
        본 방침은 2025년 5월 21일부터 적용됩니다.
      </p>

      <Card>
        <CardContent className="space-y-6 pt-6 pb-8">
          <p>
            시피나우(CPnow)는 쿠팡 상품의 가격 변동을 실시간으로 감지하고,
            사용자가 원하는 상품의 최저가 알림을 받도록 돕는 서비스입니다. 본
            페이지는 개인정보 보호 관련 사항을 사용자에게 명확히 안내하고자
            합니다.
          </p>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              1. 수집하는 개인정보 항목
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>FCM 푸시 알림용 토큰</li>
              <li>
                사용자가 직접 입력한 관심 상품의 쿠팡 상품 ID 및 가격 정보
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              2. 개인정보 수집 목적
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>상품 최저가 알림 서비스 제공</li>
              <li>사용자 맞춤 상품 추천 및 통계 분석</li>
              <li>시스템 모니터링 및 서비스 품질 개선</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              3. 개인정보 보유 및 이용 기간
            </h2>
            <p className="text-sm">
              수집된 개인정보는 원칙적으로 목적 달성 후 즉시 파기되며, FCM 토큰
              및 관심 상품 정보는 사용자가 직접 삭제하거나 서비스 탈퇴 시
              자동으로 삭제됩니다.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              4. 개인정보 제3자 제공
            </h2>
            <p className="text-sm">
              시피나우는 사용자의 개인정보를 외부에 제공하지 않습니다. 단,
              법령에 근거하여 수사기관의 요청이 있는 경우에 한해 최소한의
              범위에서 제공할 수 있습니다.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              5. 사용자 권리 및 행사 방법
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>개인정보 열람, 정정, 삭제 요청 가능</li>
              <li>언제든지 알림 수신 해지 및 서비스 탈퇴 가능</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              6. 개인정보 보호책임자 안내
            </h2>
            <p className="text-sm">
              개인정보 관련 문의는{" "}
              <a
                className="text-blue-600 underline"
                href="mailto:help@cpnow.kr"
              >
                help@cpnow.kr
              </a>{" "}
              로 문의주시면 신속히 처리해드리겠습니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
