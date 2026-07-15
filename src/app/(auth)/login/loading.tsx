/* eslint-disable react-hooks/purity */
// app/(auth)/login/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <>
      {/* MOBILE SKELETON */}
      <div className="flex min-h-screen flex-col md:hidden">
        {/* TOP: Brand Section */}
        <div className="relative flex-[1.2] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-ink/95 to-ink/90">
          {/* Decorative orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 text-center px-6">
            {/* Brand skeleton */}
            <div className="flex items-center justify-center gap-1">
              <div className="h-16 w-20 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-16 w-12 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="mt-3 h-4 w-48 bg-white/10 rounded-full mx-auto animate-pulse" />
          </div>
        </div>

        {/* BOTTOM: Form Skeleton */}
        <div className="relative flex-1 bg-canvas px-6 pt-6 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.06)] border-t border-line/50">
          <div className="mx-auto w-full max-w-sm">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-7 w-36 bg-ink/10 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-ink/5 rounded-full animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-ink/5 rounded-full animate-pulse" />
            </div>

            {/* Form fields skeleton */}
            <div className="mt-6 space-y-4">
              {/* Phone field */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-ink/5 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-ink/5 rounded animate-pulse" />
                </div>
                <div className="relative mt-1.5">
                  <div className="w-full rounded-xl border border-line bg-canvas-secondary/60 px-4 py-3.5 pl-12">
                    <div className="h-5 w-32 bg-ink/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* PIN field */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-ink/5 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-ink/5 rounded animate-pulse" />
                </div>
                <div className="relative mt-1.5">
                  <div className="w-full rounded-xl border border-line bg-canvas-secondary/60 px-4 py-3.5">
                    <div className="h-5 w-24 bg-ink/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Button skeleton */}
              <div className="w-full rounded-xl bg-ink/20 px-6 py-3.5 animate-pulse">
                <div className="h-5 w-20 bg-white/20 rounded mx-auto" />
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="h-px flex-1 bg-line/50" />
                <div className="h-3 w-24 bg-ink/5 rounded animate-pulse" />
                <div className="h-px flex-1 bg-line/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Safe area */}
        <div className="h-safe-bottom bg-canvas" />
      </div>

      {/* DESKTOP SKELETON */}
      <div className="hidden md:flex min-h-screen">
        {/* LEFT: Visual Panel */}
        <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-ink via-ink/95 to-ink/90 p-12 overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

          {/* Floating dots */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/5"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              />
            ))}
          </div>

          {/* Brand skeleton */}
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5">
              <div className="h-5 w-5 bg-white/20 rounded animate-pulse" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="relative z-10 max-w-md space-y-6">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="h-px w-12 bg-white/10" />
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-px bg-white/10" />
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Form Skeleton */}
        <div className="flex flex-1 items-center justify-center bg-canvas px-12 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, #272727 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-sm">
            {/* Header skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-ink/5 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-32 bg-ink/10 rounded animate-pulse" />
                <div className="h-4 w-48 bg-ink/5 rounded animate-pulse" />
              </div>
            </div>

            {/* Form skeleton */}
            <div className="mt-8 space-y-5">
              {/* Phone field */}
              <div>
                <div className="h-3 w-24 bg-ink/5 rounded animate-pulse" />
                <div className="relative mt-1.5">
                  <div className="w-full rounded-lg border border-line bg-canvas-secondary/60 px-4 py-3 pl-12">
                    <div className="h-5 w-40 bg-ink/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* PIN field */}
              <div>
                <div className="h-3 w-16 bg-ink/5 rounded animate-pulse" />
                <div className="relative mt-1.5">
                  <div className="w-full rounded-lg border border-line bg-canvas-secondary/60 px-4 py-3">
                    <div className="h-5 w-24 bg-ink/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Button skeleton */}
              <div className="w-full rounded-lg bg-ink/20 px-6 py-3 animate-pulse">
                <div className="h-5 w-16 bg-white/20 rounded mx-auto" />
              </div>

              {/* Divider skeleton */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line/60" />
                </div>
                <div className="relative flex justify-center">
                  <div className="h-4 w-24 bg-ink/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
