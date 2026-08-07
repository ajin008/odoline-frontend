// features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLogin } from "../hooks/use-login";
import { BackgroundPattern } from "./background-pattern";

export function LoginForm() {
  const { register, errors, onSubmit, isSubmitting } = useLogin();
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="relative h-dvh md:h-auto min-h-screen w-full font-sans antialiased text-ink selection:bg-accent-light selection:text-accent overflow-hidden md:overflow-visible">
      {/* Absolute global grid pattern */}
      <BackgroundPattern />

      {/* Responsive Shell: Mobile = native app window with bottom-snapped card; Desktop = editorial split layout */}
      <div className="relative z-10 h-full md:min-h-screen max-w-300 mx-auto w-full px-5 md:px-12 lg:px-16 pt-6 pb-5 md:py-12 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
        {/* Editorial Branding Section */}
        <div className="flex flex-col justify-between space-y-4 md:space-y-6 md:max-w-md pt-2 md:pt-0">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/icon-192.png"
                alt="Cars4 Logo"
                width={32}
                height={32}
                className="rounded-xl object-contain"
                priority
              />
              <span className="font-heading text-lg md:text-base font-semibold tracking-tight text-accent md:text-ink">
                Cars4
              </span>
            </div>
          </div>

          <div className="space-y-2 md:space-y-5">
            {/* Mobile Branding Heading */}
            <div className="md:hidden space-y-1">
              <h1 className="font-heading text-4xl sm:text-[2.6rem] font-semibold tracking-tight text-ink leading-[1.12]">
                Your showroom, <br />
                your data.
              </h1>
              <p className="text-xs sm:text-sm font-medium text-ink-muted">
                Sign in to continue.
              </p>
            </div>

            {/* Desktop Branding Heading */}
            <div className="hidden md:block space-y-5">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-mono bg-accent-light/50 border border-accent/10 px-2.5 py-1 rounded-md inline-block">
                Proprietary Internal Tool
              </span>
              <h1 className="font-heading text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-ink">
                Every car, customer, and rupee — in one place.
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
                Welcome back. Authorized Cars4 team members sign in to manage terminal operations.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono font-bold tracking-wider text-ink-subtle uppercase">
            <span>Branch Terminal v2.6</span>
            <span>Network Status: Secure</span>
          </div>
        </div>

        {/* Login Box (Snaps to bottom on mobile app style, floats on right on desktop) */}
        <div className="w-full md:w-105 bg-card border border-line rounded-2xl md:rounded-xl shadow-bento px-6 py-6 md:p-8 space-y-4 md:space-y-6 mb-1 md:mb-0">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
              Sign in to system
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Provide credentials associated with your active terminal.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-3.5 md:space-y-4">
            {/* Phone Number Field */}
            <div className="space-y-1 md:space-y-1.5">
              <label className="block text-xs md:text-[10px] font-semibold md:font-bold md:uppercase tracking-wider text-ink-muted pl-1 md:pl-0">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-subtle">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter registered number"
                  aria-invalid={!!errors.phone}
                  className="w-full rounded-xl md:rounded-lg border border-line bg-inset px-4 py-3 pl-14 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs font-semibold text-danger pl-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Security PIN Field */}
            <div className="space-y-1 md:space-y-1.5">
              <label className="block text-xs md:text-[10px] font-semibold md:font-bold md:uppercase tracking-wider text-ink-muted pl-1 md:pl-0">
                Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  aria-invalid={!!errors.pin}
                  className="w-full rounded-xl md:rounded-lg border border-line bg-inset px-4 py-3 pr-14 md:pr-12 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                  {...register("pin")}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                >
                  {showPin ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.pin && (
                <p className="mt-1 text-xs font-semibold text-danger pl-1">
                  {errors.pin.message}
                </p>
              )}
            </div>

            {/* Submit Control Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl md:rounded-lg bg-accent py-3.5 text-sm font-semibold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1 md:mt-2 cursor-pointer shadow-sm"
            >
              {isSubmitting ? "Verifying..." : "Login to Terminal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
