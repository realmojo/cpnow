import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a href="#" className="font-medium underline underline-offset-4">
              CPNOW Team
            </a>
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            소개
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
}
