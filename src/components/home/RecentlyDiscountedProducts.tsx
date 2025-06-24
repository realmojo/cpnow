"use client";
import { useCallback, useEffect } from "react";
import ProductList from "../ProductList";
import { nowStore } from "@/src/store/nowStore";

export default function RecentlyDiscountedProducts({
  sortOption,
}: {
  sortOption: string;
}) {
  const { nowItems, setNowItems } = nowStore();

  const initData = useCallback(async () => {
    if (nowItems.length === 0) {
      setNowItems(sortOption);
    }
  }, [nowItems, setNowItems, sortOption]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    initData();
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setNowItems(sortOption);
  }, [sortOption]);

  return <ProductList items={nowItems} type="grid" />;
}
