import Link from "next/link";

export default function Header() {
  // const pathname = usePathname();

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <span className="text-xl font-bold">CP Now</span>
        </Link>
        {/* <nav className="flex space-x-4">
          <Link
            href="/categories/1"
            // className={cn(
            //   "text-sm font-medium hover:underline",
            //   pathname === "/" && "text-blue-600"
            // )}
          >
            Home
          </Link>
          <Link
            href="/categories/2"
            // className={cn(
            //   "text-sm font-medium hover:underline",
            //   pathname === "/about" && "text-blue-600"
            // )}
          >
            About
          </Link>
        </nav> */}
        {/* <Button variant="outline">랜덤상품 보기</Button> */}
      </div>
    </header>
  );
}
