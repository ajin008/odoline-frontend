"use client";

import { useEffect, useState } from "react";

// Purely cosmetic first-impression splash — a fixed timer, not tied to any
// real loading/auth state. Shows once per full page load (root layout only
// mounts once across client-side navigations).
const HOLD_MS = 1600;
const FADE_MS = 400;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), HOLD_MS);
    const removeTimer = setTimeout(() => setVisible(false), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-[400ms] ease-out ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* The "C" doubles as the loader: a ring with a dot orbiting it. */}
      <div className="flex items-center font-heading text-6xl font-bold tracking-tight text-white">
        <span className="relative mr-[0.08em] inline-block h-[0.66em] w-[0.66em] shrink-0">
          <span className="absolute inset-0 rounded-full border-[0.09em] border-white/25" />
          <span className="absolute inset-0 animate-spin [animation-duration:1.4s]">
            <span className="absolute left-1/2 top-0 h-[0.16em] w-[0.16em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </span>
        </span>
        <span>ars4</span>
      </div>
    </div>
  );
}
