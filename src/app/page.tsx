import { Suspense } from "react";
import HomePage from "@/src/components/HomePage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HomePage />
    </Suspense>
  );
}
