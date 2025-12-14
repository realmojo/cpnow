import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata = {
  title: "서비스 이용약관 - CPNOW",
  description: "CPNOW 서비스 이용약관",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">서비스 이용약관</h1>
          <p className="text-lg text-muted-foreground">
            시행일: 2025년 1월 1일
          </p>
        </div>
        
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">제1조 (목적)</h2>
            <p className="leading-relaxed">
               본 약관은 CPNOW(이하 "회사")가 제공하는 인터넷 관련 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">제2조 (서비스의 제공)</h2>
            <p className="leading-relaxed">
               1. 회사는 다음과 같은 업무를 수행합니다.
               <br />&nbsp;- 상품 가격 정보 제공 및 추적
               <br />&nbsp;- 가격 변동 내역의 시각화 서비스
               <br />&nbsp;- 기타 회사가 정하는 업무
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">제3조 (면책 조항)</h2>
            <p className="leading-relaxed text-destructive/80 font-medium">
               회사가 제공하는 가격 정보 및 데이터는 각 쇼핑몰의 사정에 따라 실시간으로 변동될 수 있으며, 수집 시점과 조회 시점의 차이로 인해 
               실제 가격과 다를 수 있습니다. 회사는 제공되는 정보의 정확성이나 완전성을 보장하지 않으며, 이를 활용한 구매 결정에 따른 결과에 대해 
               어떠한 책임도 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">제4조 (지적재산권)</h2>
            <p className="leading-relaxed">
               1. 회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
               <br />
               2. 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
