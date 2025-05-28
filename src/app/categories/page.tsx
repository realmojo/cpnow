"use client";
import React from "react";
import CategoryProductSection from "@/src/components/home/CategoryProductSection";
export default function CategoriesPage() {
  return (
    <article>
      <section className="mx-auto w-full max-w-[800px] space-y-10 px-4 py-6">
        <CategoryProductSection />
      </section>
    </article>
  );
}
