import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-6 w-full border-t bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <div className="mb-2 flex justify-center">
          <Image
            src="/icons/apple-icon-60x60.png"
            alt="CPNOW 로고"
            width={30}
            height={30}
            priority
            unoptimized
          />
        </div>
        <p className="mt-1 leading-relaxed text-gray-600">
          <strong>CPNOW</strong>는 쿠팡 상품의 가격 변동을 실시간으로
          모니터링하고
          <br />
          소비자에게 가장 유리한 시점을 안내하는 스마트 쇼핑 알림 서비스입니다.{" "}
          <br />
          일부 링크에는 쿠팡 파트너스 활동을 통한 일정액의 수수료를
          제공받습니다.
        </p>
        <p className="mt-2 text-gray-400">
          © 2024 CPNOW. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
