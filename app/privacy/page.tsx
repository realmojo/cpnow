import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata = {
  title: "개인정보 처리방침 - CPNOW",
  description: "CPNOW 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline-block">
              홈으로 돌아가기
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg tracking-tight">CPNOW</span>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="container max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            개인정보 처리방침
          </h1>
          <p className="text-lg text-muted-foreground">
            최종 수정일: 2025년 1월 1일
          </p>
        </div>

        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. 총칙</h2>
            <p className="leading-relaxed">
              CPNOW(이하 "회사")는 이용자의 개인정보를 소중히 다루며,
              "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련 법령을
              준수하고 있습니다. 본 개인정보 처리방침은 귀하가 서비스를 이용함에
              있어 회사가 귀하의 개인정보를 어떻게 수집, 이용, 보관하며, 이에
              대해 귀하가 어떠한 권리를 가지는지 알려드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              2. 수집하는 개인정보 항목
            </h2>
            <p className="leading-relaxed">
              회사는 회원가입 없이 서비스를 제공하므로, 원칙적으로 별도의
              개인정보를 수집하지 않습니다. 다만, 서비스 이용 과정에서 아래와
              같은 정보들이 자동으로 생성되어 수집될 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>IP 주소, 쿠키, 서비스 이용 기록, 기기 정보</li>
              <li>검색한 URL 및 상품 정보 기록 (통계 목적)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              3. 쿠키(Cookie)의 운용 및 거부
            </h2>
            <p className="leading-relaxed">
              회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를
              저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 이용자는 웹
              브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가
              저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할
              수도 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. 개인정보의 보호책임자</h2>
            <p className="leading-relaxed">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-secondary/50 p-4 rounded-md mt-2">
              <p className="text-sm font-medium">관리자: CPNOW 운영팀</p>
              <p className="text-sm">연락처: contact@cpnow.kr (임시)</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
