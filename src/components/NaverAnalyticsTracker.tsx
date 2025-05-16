// components/NaverAnalyticsTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NaverAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).wcs) {
      (window as any).wcs_do();
    }
  }, [pathname]);

  return null;
}
