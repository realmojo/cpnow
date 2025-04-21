import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/main-logo.png";
import NotiRegisterButton from "../NotiRegisterButton";

export default function Header() {
  return (
    <header className="container mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4">
      <Link href="/">
        <Image
          src={Logo}
          width={140}
          alt="시피나우-로고"
          placeholder="blur"
          priority
        />
      </Link>
      <NotiRegisterButton />
    </header>
  );
}
