// features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLogin } from "../hooks/use-login";
import { BackgroundPattern } from "./background-pattern";

export function LoginForm() {
  const mobile = useLogin();
  const desktop = useLogin();
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="relative min-h-screen w-full font-sans antialiased text-ink selection:bg-accent-light selection:text-accent">
      {/* Absolute global grid pattern */}
      <BackgroundPattern />

      {/* ------------------------------------------------------------- */}
      {/* PWA MOBILE SHELL LAYOUT (Native App Window Style)             */}
      {/* ------------------------------------------------------------- */}
      {/* Changed to h-dvh and removed extra paddings to eliminate scrolling entirely */}
      <div className="flex h-dvh flex-col justify-between px-5 pt-8 pb-5 md:hidden overflow-hidden">
        {/* Upper Portion: Clean Content Branding (Matching Clean Weights) */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon-192.png"
              alt="Cars4 Icon"
              width={32}
              height={32}
              className="rounded-xl object-contain"
              priority
            />
            <span className="font-heading text-lg font-semibold tracking-tight text-accent">
              Cars4
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink leading-[1.15]">
              Your showroom, <br />
              your data.
            </h1>
            <p className="text-sm font-medium text-ink-muted">
              Sign in to continue.
            </p>
          </div>
        </div>

        {/* Lower Portion: Login Box snapped directly to the bottom area */}
        <div className="w-full bg-card border border-line rounded-2xl shadow-bento px-6 py-7 space-y-5 mb-1">
          {/* Panel Sub-heading (Clean Semibold Style) */}
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
              Welcome to Cars4 login now!
            </h2>
            <p className="text-xs font-medium text-ink-muted mt-1">
              For Authorized Cars4 team members only
            </p>
          </div>

          <form onSubmit={mobile.onSubmit} noValidate className="space-y-3.5">
            {/* Mobile Phone Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted pl-1">
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
                  aria-invalid={!!mobile.errors.phone}
                  className="w-full rounded-xl border border-line bg-inset px-4 py-3 pl-14 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                  {...mobile.register("phone")}
                />
              </div>
              {mobile.errors.phone && (
                <p className="mt-1 text-xs font-semibold text-danger pl-1">
                  {mobile.errors.phone.message}
                </p>
              )}
            </div>

            {/* Mobile PIN Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted pl-1">
                Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  aria-invalid={!!mobile.errors.pin}
                  className="w-full rounded-xl border border-line bg-inset px-4 py-3 pr-14 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                  {...mobile.register("pin")}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-subtle hover:text-ink transition-colors"
                >
                  {showPin ? "HIDE" : "SHOW"}
                </button>
              </div>
              {mobile.errors.pin && (
                <p className="mt-1 text-xs font-semibold text-danger pl-1">
                  {mobile.errors.pin.message}
                </p>
              )}
            </div>

            {/* Submit Control Button */}
            <button
              type="submit"
              disabled={mobile.isSubmitting}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm mt-1"
            >
              {mobile.isSubmitting ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP CAL.COM EDITORIAL STRUCTURE                           */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex min-h-screen items-center justify-between max-w-300 mx-auto w-full px-12 lg:px-16">
        {/* Left Side Editorial Content Area */}
        <div className="max-w-md py-12 flex flex-col justify-between h-130">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/icons/icon-192.png"
                alt="Cars4 Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain"
                priority
              />
              <span className="font-heading text-base font-semibold tracking-tight text-ink">
                Cars4
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-mono bg-accent-light/50 border border-accent/10 px-2.5 py-1 rounded-md inline-block">
              Proprietary Internal Tool
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-ink">
              Every car, every customer, every rupee — in one place.
            </h1>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
              Welcome back. This system is for authorized Cars4 team members.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono font-bold tracking-wider text-ink-subtle uppercase">
            <span>Branch Terminal v2.6</span>
            <span>Network Status: Secure</span>
          </div>
        </div>

        {/* Right Side: The Substantial Minimalist Box Container */}
        <div className="w-105 bg-card border border-line rounded-xl shadow-bento p-8 flex flex-col justify-between min-h-115">
          <div className="my-auto space-y-6">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
                Sign in to system
              </h2>
              <p className="text-xs text-ink-muted mt-1.5">
                Provide credentials associated with your active terminal device.
              </p>
            </div>

            <form onSubmit={desktop.onSubmit} noValidate className="space-y-4">
              {/* Desktop Phone Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Phone Number
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-subtle">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    aria-invalid={!!desktop.errors.phone}
                    className="w-full rounded-lg border border-line bg-inset px-4 py-3 pl-14 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                    {...desktop.register("phone")}
                  />
                </div>
                {desktop.errors.phone && (
                  <p className="text-xs font-semibold text-danger pl-1">
                    {desktop.errors.phone.message}
                  </p>
                )}
              </div>

              {/* Desktop PIN Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Security PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    aria-invalid={!!desktop.errors.pin}
                    className="w-full rounded-lg border border-line bg-inset px-4 py-3 pr-12 text-sm text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light"
                    {...desktop.register("pin")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-subtle hover:text-ink active:scale-95 transition-colors"
                  >
                    {showPin ? "HIDE" : "SHOW"}
                  </button>
                </div>
                {desktop.errors.pin && (
                  <p className="text-xs font-semibold text-danger pl-1">
                    {desktop.errors.pin.message}
                  </p>
                )}
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={desktop.isSubmitting}
                className="w-full rounded-lg bg-accent px-4 py-3.5 text-sm font-semibold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {desktop.isSubmitting
                  ? "Syncing Terminal Tokens..."
                  : "Log In to Dashboard"}
              </button>
            </form>
          </div>

          <div className="text-[10px] font-mono text-ink-subtle text-center uppercase tracking-widest pt-4 border-t border-line/40">
            Secure Endpoint Connection
          </div>
        </div>
      </div>
    </div>
  );
}
