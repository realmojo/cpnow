import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata = {
  title: "About - CPNOW",
  description: "CPNOW 서비스 소개",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline-block">홈으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg tracking-tight">CPNOW</span>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="container max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About CPNOW</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            스마트한 쇼핑의 시작, 가격 변동 추적 서비스
          </p>
        </div>
        
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <p className="leading-7">
            CPNOW는 국내 최대 이커머스 쿠팡의 상품 가격을 실시간으로 추적하여, 
            소비자가 가장 합리적인 가격에 상품을 구매할 수 있도록 돕는 데이터 분석 플랫폼입니다.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">우리의 미션</h2>
          <p className="leading-7">
            이커머스 가격은 수시로 변동합니다. 와우 회원가, 카드 할인, 일시적인 특가 등 
            복잡한 가격 정책 속에서 소비자는 언제 사야 할지 고민하게 됩니다. 
            CPNOW는 이러한 정보 비대칭을 해소하고, 데이터에 기반한 투명한 소비 경험을 제공합니다.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">주요 기능</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>실시간 가격 추적:</strong> 상품 URL만 입력하면 즉시 현재 가격과 와우 할인가를 분석합니다.</li>
            <li><strong>가격 히스토리 그래프:</strong> 지난 30일간의 가격 흐름을 시각적으로 제공하여 최적의 구매 타이밍을 제안합니다.</li>
            <li><strong>와우 멤버십 할인 분석:</strong> 일반 판매가와 와우 회원가의 차이를 명확하게 비교해드립니다.</li>
          </ul>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground m-0">
              * CPNOW는 쿠팡과 직접적인 관련이 없으며, 제공되는 정보는 참고용으로만 사용해주시기 바랍니다.
              구매 결정에 대한 책임은 사용자에게 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
