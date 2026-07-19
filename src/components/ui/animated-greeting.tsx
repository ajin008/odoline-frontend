// components/ui/animated-greeting.tsx
"use client";

import { useEffect, useState } from "react";

interface AnimatedGreetingProps {
  firstName?: string;
}

function getGreetingPrefix(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function AnimatedGreeting({ firstName }: AnimatedGreetingProps) {
  const [text, setText] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const prefix = getGreetingPrefix(new Date().getHours());
    const fullMessage = firstName
      ? `Hey, ${firstName} — ${prefix.toLowerCase()} 👋`
      : `${prefix} 👋`;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(fullMessage);

    // Smoothly trigger the curtain reveal right after setting the text
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, [firstName]);

  return (
    <h1 className="font-heading text-lg font-semibold tracking-tight text-ink min-h-7 flex items-center overflow-hidden">
      <span
        className={[
          "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isMounted
            ? "[clip-path:inset(0_0_0_0)]"
            : "[clip-path:inset(0_100%_0_0)]",
        ].join(" ")}
      >
        {text || (firstName ? `Hey, ${firstName} 👋` : "Welcome back")}
      </span>
    </h1>
  );
}
