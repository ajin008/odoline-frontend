"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card/50 text-ink hover:bg-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-all cursor-pointer"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4 text-warning" />
        ) : (
          <Moon className="h-4 w-4 text-ink-muted" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
