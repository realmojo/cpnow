import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/main-logo.png";

export default function Header() {
  // const pathname = usePathname();

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Image
            src={Logo}
            width={140}
            alt="시피나우-로고"
            placeholder="blur"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
