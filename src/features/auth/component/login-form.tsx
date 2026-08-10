// features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLogin } from "../hooks/use-login";
import { BackgroundPattern } from "./background-pattern";
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

export function LoginForm() {
  const { register, errors, onSubmit, isSubmitting } = useLogin();
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="relative min-h-dvh h-dvh w-full font-sans antialiased text-ink selection:bg-accent-light selection:text-accent overflow-hidden">
      {/* Absolute global grid pattern */}
      <BackgroundPattern />

      {/* Outer Layout Container */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-stretch md:items-center h-dvh min-h-screen max-w-300 mx-auto w-full p-5 sm:p-6 md:px-12 md:py-12 lg:px-16 gap-6 overflow-hidden">
        {/* Top App Header (Mobile only) */}
        <div className="md:hidden flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <Image
              src="/icons/icon-192.png"
              alt="Cars4 Logo"
              width={36}
              height={36}
              className="rounded-xl object-contain shadow-xs"
              priority
            />
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-ink block leading-none">
                Cars4
              </span>
              <span className="text-[10px] font-mono font-medium text-ink-subtle">
                Showroom OS
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </span>
        </div>

        {/* Left Editorial Branding Section (Desktop only) */}
        <div className="hidden md:flex flex-col justify-between space-y-6 max-w-md">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/icons/icon-192.png"
                alt="Cars4 Logo"
                width={36}
                height={36}
                className="rounded-xl object-contain"
                priority
              />
              <span className="font-heading text-lg font-semibold tracking-tight text-ink">
                Cars4
              </span>
            </div>
          </div>

          <div className="space-y-5">
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

          <div className="flex items-center gap-6 text-[10px] font-mono font-bold tracking-wider text-ink-subtle uppercase">
            <span>Branch Terminal v2.6</span>
            <span>Network Status: Secure</span>
          </div>
        </div>

        {/* Center Main Card & Form (Mobile & Desktop shared form instance) */}
        <div className="my-auto md:my-0 w-full md:w-105 space-y-4 md:space-y-6">
          {/* Mobile Header Text */}
          <div className="md:hidden space-y-1">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink">
              Welcome back
            </h1>
            <p className="text-xs font-medium text-ink-muted">
              Enter your credentials to access the showroom terminal
            </p>
          </div>

          {/* Form Bento Card */}
          <div className="bg-card border border-line rounded-2xl md:rounded-xl p-5 md:p-8 shadow-bento space-y-4 md:space-y-6">
            {/* Desktop Header Text */}
            <div className="hidden md:block">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
                Sign in to system
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Provide credentials associated with your active terminal.
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] md:text-[10px] font-bold text-ink-subtle md:text-ink-muted uppercase tracking-wider pl-0.5 md:pl-0">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-subtle font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter registered number"
                    aria-invalid={!!errors.phone}
                    className="w-full rounded-xl md:rounded-lg border border-line bg-inset py-3.5 md:py-3 pl-12 md:pl-14 pr-4 text-sm font-medium md:font-normal text-ink outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 md:focus:ring-4 focus:ring-accent/20 md:focus:ring-accent-light"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-medium md:font-semibold text-danger pl-0.5 md:pl-0 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Security PIN Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] md:text-[10px] font-bold text-ink-subtle md:text-ink-muted uppercase tracking-wider pl-0.5 md:pl-0">
                  Security PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    aria-invalid={!!errors.pin}
                    className="w-full rounded-xl md:rounded-lg border border-line bg-inset py-3.5 md:py-3 pl-4 pr-12 text-sm font-medium md:font-normal text-ink tracking-widest outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 md:focus:ring-4 focus:ring-accent/20 md:focus:ring-accent-light"
                    {...register("pin")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 p-1 text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                  >
                    {showPin ? (
                      <EyeOff className="h-4 w-4 stroke-[2px]" />
                    ) : (
                      <Eye className="h-4 w-4 stroke-[2px]" />
                    )}
                  </button>
                </div>
                {errors.pin && (
                  <p className="text-xs font-medium md:font-semibold text-danger pl-0.5 md:pl-0 mt-1">
                    {errors.pin.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl md:rounded-lg bg-[#171819] md:bg-accent py-3.5 text-sm font-bold md:font-semibold text-white md:text-inverse transition-all hover:bg-[#222426] md:hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm border-none mt-2"
              >
                <span>
                  {isSubmitting
                    ? "Verifying Credentials..."
                    : "Login to Showroom"}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="h-4 w-4 stroke-[2.5px] md:hidden" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom App Footer (Mobile only) */}
        <div className="md:hidden flex items-center justify-center gap-1.5 pb-2 text-[10px] font-mono text-ink-subtle">
          <Lock className="h-3 w-3 text-accent" />
          <span>Encrypted Terminal Session • v2.6</span>
        </div>
      </div>
    </div>
  );
}
