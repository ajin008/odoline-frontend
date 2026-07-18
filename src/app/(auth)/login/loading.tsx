// app/(auth)/login/loading.tsx
import React from "react";
import { BackgroundPattern } from "@/src/features/auth/component/background-pattern";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-canvas overflow-hidden">
      {/* Absolute global grid pattern to prevent structural flashing */}
      <BackgroundPattern />

      {/* ------------------------------------------------------------- */}
      {/* MOBILE SKELETON                                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex min-h-screen flex-col justify-between px-5 pt-12 pb-6 md:hidden">
        {/* Upper Portion: Branding Skeleton */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-ink/10 rounded-xl animate-pulse" />
            <div className="h-4 w-16 bg-ink/10 rounded-md animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-9 w-48 bg-ink/10 rounded-xl animate-pulse" />
            <div className="h-9 w-36 bg-ink/10 rounded-xl animate-pulse" />
            <div className="h-4 w-32 bg-ink/5 rounded-md animate-pulse pt-1" />
          </div>
        </div>

        {/* Lower Portion: Login Box Container Skeleton snapped down */}
        <div className="mt-auto w-full bg-card border border-line rounded-[2.25rem] shadow-bento px-6 py-8 space-y-6">
          {/* Panel Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-5 w-56 bg-ink/10 rounded-lg animate-pulse" />
            <div className="h-3 w-48 bg-ink/5 rounded-md animate-pulse" />
          </div>

          <div className="space-y-4">
            {/* Phone input container field */}
            <div className="space-y-2 pl-1">
              <div className="h-3 w-20 bg-ink/5 rounded animate-pulse" />
              <div className="w-full h-12 rounded-2xl border border-line bg-inset/50 animate-pulse" />
            </div>

            {/* PIN input container field */}
            <div className="space-y-2 pl-1">
              <div className="h-3 w-16 bg-ink/5 rounded animate-pulse" />
              <div className="w-full h-12 rounded-2xl border border-line bg-inset/50 animate-pulse" />
            </div>

            {/* Submit full-rounded button control */}
            <div className="w-full h-13 rounded-full bg-ink/10 animate-pulse mt-2" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SKELETON                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex min-h-screen items-center justify-between max-w-300 mx-auto w-full px-12 lg:px-16">
        {/* Left Side Editorial Content Area */}
        <div className="max-w-md py-12 flex flex-col justify-between h-130">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-ink/10 rounded-lg animate-pulse" />
              <div className="h-4 w-16 bg-ink/10 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-6 w-36 bg-ink/5 rounded-md animate-pulse" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-ink/10 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-ink/10 rounded-xl animate-pulse" />
              <div className="h-10 w-2/3 bg-ink/10 rounded-xl animate-pulse" />
            </div>
            <div className="h-4 w-64 bg-ink/5 rounded-md animate-pulse pt-2" />
          </div>

          <div className="flex items-center gap-6">
            <div className="h-3 w-24 bg-ink/5 rounded animate-pulse" />
            <div className="h-3 w-28 bg-ink/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Right Side Box Container Box */}
        <div className="w-105 bg-card border border-line rounded-2xl shadow-bento p-8 flex flex-col justify-between min-h-115">
          <div className="my-auto space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-36 bg-ink/10 rounded-lg animate-pulse" />
              <div className="h-3.5 w-64 bg-ink/5 rounded-md animate-pulse" />
            </div>

            <div className="space-y-4">
              {/* Desktop Phone container field */}
              <div className="space-y-2">
                <div className="h-3 w-20 bg-ink/5 rounded animate-pulse" />
                <div className="w-full h-11 rounded-xl border border-line bg-inset/50 animate-pulse" />
              </div>

              {/* Desktop PIN container field */}
              <div className="space-y-2">
                <div className="h-3 w-16 bg-ink/5 rounded animate-pulse" />
                <div className="w-full h-11 rounded-xl border border-line bg-inset/50 animate-pulse" />
              </div>

              {/* Submit trigger component */}
              <div className="w-full h-12 rounded-xl bg-ink/10 animate-pulse mt-2" />
            </div>
          </div>

          <div className="w-24 h-3 bg-ink/5 mx-auto rounded animate-pulse pt-4" />
        </div>
      </div>
    </div>
  );
}
