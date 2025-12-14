import Link from "next/link";
import { ArrowLeft, Mail, Info } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Contact Us - CPNOW",
  description: "CPNOW 관리자에게 문의하기",
};

export default function ContactPage() {
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
      <main className="container max-w-3xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            궁금한 점이 있으신가요? <br />
            언제든지 문의해주시면 친절하게 답변해 드리겠습니다.
          </p>
        </div>

        <div className="grid gap-8 w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                E-mail Support
              </CardTitle>
              <CardDescription>
                일반적인 문의사항이나 제휴 관련 문의
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full text-lg h-12" variant="outline" asChild>
                <a href="mailto:support@cpnow.kr">support@cpnow.kr</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <Info className="w-4 h-4" />
                운영 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>평일: 10:00 ~ 18:00 (KST)</p>
              <p>주말 및 공휴일은 휴무입니다.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
