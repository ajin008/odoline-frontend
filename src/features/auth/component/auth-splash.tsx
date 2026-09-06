"use client";

import Image from "next/image";
import { BRAND } from "@/src/config/brand";
import { BackgroundPattern } from "./background-pattern";

export function AuthSplash() {
  return (
    <div className="relative min-h-dvh h-dvh w-full bg-canvas font-sans antialiased text-ink flex flex-col items-center justify-center overflow-hidden">
      {/* Absolute global grid pattern */}
      <BackgroundPattern />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center">
          <Image
            src={BRAND.logoPath}
            alt={`${BRAND.companyName} Logo`}
            width={52}
            height={52}
            className="rounded-2xl object-contain shadow-xs"
            priority
          />
        </div>

        <div className="space-y-1">
          <h1 className="font-heading text-lg font-bold tracking-tight text-ink">
            {BRAND.companyName}
          </h1>
          {BRAND.tagline && (
            <p className="text-xs font-mono font-medium text-ink-subtle">
              {BRAND.tagline}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-ink-subtle">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
          <span>Starting app...</span>
        </div>
      </div>
    </div>
  );
}
