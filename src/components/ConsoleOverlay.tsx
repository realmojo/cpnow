"use client";

import { useEffect, useState } from "react";

export default function ConsoleOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;

    console.log = (...args: any[]) => {
      originalLog(...args); // 원래 콘솔도 유지
      const logString = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
      setLogs((prev) => [...prev.slice(-30), logString]); // 최근 30개만 표시
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "200px",
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "lime",
        fontSize: "12px",
        overflowY: "auto",
        padding: "8px",
        zIndex: 9999,
      }}
    >
      {logs.map((log, idx) => (
        <div key={idx}>{log}</div>
      ))}
    </div>
  );
}
