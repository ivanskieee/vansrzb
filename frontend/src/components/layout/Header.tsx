// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Philippine time is UTC+8
      const phTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

      const formattedTime = phTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const formattedDate = phTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      {/* Left: Philippine time */}
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-xl font-semibold tracking-widest tabular-nums">
          {time}
        </span>
        <span className="text-xs text-slate-400 tracking-widest uppercase font-medium">
          {date} &middot; Manila 🇵🇭
        </span>
      </div>

      {/* Right: Theme toggle */}
      <ThemeToggle />
    </header>
  );
}