"use client";
import React from "react";
import AlarmList from "@/src/components/alarm/AlarmList";
export default function AlarmPage() {
  return (
    <article>
      <section className="mx-auto w-full max-w-[800px] space-y-10 py-6">
        <AlarmList />
      </section>
    </article>
  );
}
