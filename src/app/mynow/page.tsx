import { Suspense } from "react";
import MyNowContainer from "@/src/components/mynow/Container";

export default function MyNowPage() {
  return (
    <Suspense>
      <MyNowContainer />
    </Suspense>
  );
}
