"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ProductOverlay({ productId }: { productId: string }) {
  const router = useRouter();
  const [shouldClose, setShouldClose] = useState(false);
  console.log("productId", productId);

  useEffect(() => {
    if (shouldClose) {
      const timer = setTimeout(() => {
        router.back();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldClose, router]);
  useEffect(() => {
    const content = document.getElementById("modal-content");
    if (content) content.focus();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!shouldClose && (
        <motion.div
          key={productId}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-[100] overflow-auto bg-white"
        >
          <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-lg font-bold">상품 상세보기</h1>
            <Button variant="ghost" onClick={() => setShouldClose(true)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground text-sm">
              상품 ID: {productId}
            </p>
            <h2 className="mt-4 text-xl font-bold">상품 정보 표시</h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
