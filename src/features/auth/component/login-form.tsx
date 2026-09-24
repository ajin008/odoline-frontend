// features/auth/component/login-form.tsx
"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/src/config/brand";
import { useLogin } from "../hooks/use-login";
import { ArrowLeft, ArrowRight, Loader2, Lock } from "lucide-react";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { JourneyLine } from "@/src/components/ui/journey-line";

const PIN_LENGTH = 6;

const COPY = {
  back: "Back to website",
  panelEyebrow: "Showroom workspace",
  panelTitle: "Every car's journey,",
  panelTitleMuted: "on one line.",
  panelBody:
    "Stock, papers, enquiries and bookings — tracked from the day a car is bought to the day it's delivered.",
  signingInTo: "Signing in to",
  title: "Welcome back",
  subtitle: "Use the mobile number and PIN your showroom registered for you.",
  phoneLabel: "Mobile number",
  phonePlaceholder: "98765 43210",
  pinLabel: "PIN",
  showPin: "Show",
  hidePin: "Hide",
  submit: "Sign in",
  submitting: "Signing in…",
  help: "Forgot your PIN? Ask your showroom owner to reset it.",
  access: "Only team members added by the showroom owner can sign in.",
} as const;

export function LoginForm() {
  const { register, errors, onSubmit, isSubmitting } = useLogin();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");

  const phoneField = register("phone");
  const pinField = register("pin");

  // Keep both fields digits-only so the inputs never hold junk
  const digitsOnly =
    (max: number, onChange: (e: ChangeEvent<HTMLInputElement>) => unknown) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, max);
      return onChange(e);
    };

  const handlePinChange = digitsOnly(PIN_LENGTH, (e) => {
    setPin(e.target.value);
    return pinField.onChange(e);
  });

  const activeSlot = Math.min(pin.length, PIN_LENGTH - 1);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-dvh w-full bg-canvas text-ink font-sans antialiased lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* ───────────── Brand panel (lg+) ───────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-footer-line bg-footer text-footer-ink p-10 xl:p-14">
        {/* Odometer scale along the top edge */}
        <OdometerTicks className="absolute inset-x-0 top-0 h-3 text-footer-muted opacity-30" />

        <div className="relative flex items-center justify-between rise-in">
          <Link
            href="/#top"
            className="inline-flex items-center gap-2.5 rounded-lg font-heading text-lg font-extrabold tracking-tight"
          >
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={30}
              height={30}
              priority
              className="size-7.5 rounded-lg"
            />
            Odoline
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-footer-muted">
            {COPY.panelEyebrow}
          </span>
        </div>

        <div className="relative space-y-10 xl:space-y-14">
          <div className="space-y-5 max-w-lg rise-in [animation-delay:120ms]">
            <p className="font-heading text-4xl xl:text-[3.25rem] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {COPY.panelTitle}
              <br />
              <span className="text-footer-muted">{COPY.panelTitleMuted}</span>
            </p>
            <p className="max-w-md text-[15px] leading-relaxed text-footer-muted">
              {COPY.panelBody}
            </p>
          </div>

          <JourneyLine className="w-full max-w-2xl -ml-2" />
        </div>

        <div className="relative flex items-center justify-between border-t border-footer-line pt-6 text-xs text-footer-muted">
          <span className="font-medium text-footer-ink/90">
            {BRAND.companyName}
          </span>
          <span>© {year} Odoline</span>
        </div>
      </aside>

      {/* ───────────── Form column ───────────── */}
      <main className="relative flex min-h-dvh flex-col px-5 py-5 sm:px-10 sm:py-8 lg:px-14 lg:py-10">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/#top"
            className="inline-flex items-center gap-2.5 rounded-lg font-heading text-lg font-extrabold tracking-tight lg:hidden"
          >
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={30}
              height={30}
              priority
              className="size-7.5 rounded-lg"
            />
            Odoline
          </Link>
          <Link
            href="/#top"
            className="group hidden lg:inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            {COPY.back}
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <div className="w-full max-w-[400px] rise-in [animation-delay:80ms]">
            {/* Compact journey strip keeps the motif on small screens */}
            <JourneyLine
              tone="light"
              showLabels={false}
              className="mb-8 h-12 w-36 lg:hidden"
            />

            {/* Tenant — who you're signing in to */}
            <div className="mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-card py-1.5 pl-1.5 pr-4 shadow-bento">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-inset">
                <span className="size-2 rounded-full bg-success" />
              </span>
              <span className="min-w-0 truncate text-[13px]">
                <span className="text-ink-subtle">{COPY.signingInTo} </span>
                <span className="font-semibold text-ink">
                  {BRAND.companyName}
                </span>
              </span>
            </div>

            <h1 className="font-heading text-[2.5rem] sm:text-5xl font-extrabold leading-none tracking-[-0.035em]">
              {COPY.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {COPY.subtitle}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
              {/* Mobile number */}
              <div className="space-y-2">
                <label
                  htmlFor="login-phone"
                  className="block text-sm font-medium text-ink"
                >
                  {COPY.phoneLabel}
                </label>
                <div
                  className={`flex h-14 items-center rounded-2xl border bg-card transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-light ${
                    errors.phone ? "border-danger" : "border-line"
                  }`}
                >
                  <span className="flex h-full items-center border-r border-line pl-4 pr-3.5 text-[15px] font-medium text-ink-muted">
                    +91
                  </span>
                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder={COPY.phonePlaceholder}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "login-phone-error" : undefined}
                    className="h-full min-w-0 flex-1 rounded-r-2xl bg-transparent px-4 text-base font-medium tracking-wide text-ink outline-none placeholder:text-ink-subtle placeholder:font-normal"
                    {...phoneField}
                    onChange={digitsOnly(10, phoneField.onChange)}
                  />
                </div>
                {errors.phone && (
                  <p id="login-phone-error" className="text-[13px] font-medium text-danger">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* PIN — one real input under six visual slots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-pin"
                    className="block text-sm font-medium text-ink"
                  >
                    {COPY.pinLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPin((v) => !v)}
                    aria-pressed={showPin}
                    aria-controls="login-pin"
                    className="rounded-md px-1 text-[13px] font-medium text-ink-subtle transition-colors hover:text-ink cursor-pointer"
                  >
                    {showPin ? COPY.hidePin : COPY.showPin}
                  </button>
                </div>
                <div className="group relative">
                  <input
                    id="login-pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="current-password"
                    maxLength={PIN_LENGTH}
                    aria-invalid={!!errors.pin}
                    aria-describedby={errors.pin ? "login-pin-error" : undefined}
                    className="absolute inset-0 z-10 h-full w-full cursor-text rounded-2xl text-base opacity-0 [caret-color:transparent]"
                    {...pinField}
                    onChange={handlePinChange}
                  />
                  <div className="grid grid-cols-6 gap-2 sm:gap-2.5" aria-hidden="true">
                    {Array.from({ length: PIN_LENGTH }, (_, i) => {
                      const char = pin.charAt(i);
                      const isActive = i === activeSlot;
                      return (
                        <div
                          key={i}
                          className={`relative grid h-14 place-items-center rounded-2xl border bg-card font-heading text-xl font-bold transition-[border-color,box-shadow] ${
                            errors.pin
                              ? "border-danger"
                              : char
                                ? "border-ink/25"
                                : "border-line"
                          } ${
                            isActive
                              ? "group-focus-within:border-accent group-focus-within:ring-4 group-focus-within:ring-accent-light"
                              : ""
                          }`}
                        >
                          {char ? (
                            showPin ? (
                              char
                            ) : (
                              <span className="size-2.5 rounded-full bg-ink" />
                            )
                          ) : (
                            isActive && (
                              <span className="hidden h-6 w-0.5 rounded-full bg-accent group-focus-within:block motion-safe:animate-pulse" />
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {errors.pin && (
                  <p id="login-pin-error" className="text-[13px] font-medium text-danger">
                    {errors.pin.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-2 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-cta text-[15px] font-semibold text-cta-ink shadow-bento transition-[background-color,transform] hover:bg-cta-hover active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {COPY.submitting}
                  </>
                ) : (
                  <>
                    {COPY.submit}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-ink-subtle">
              {COPY.help}
            </p>
          </div>
        </div>

        <footer className="flex flex-col-reverse items-center gap-3 border-t border-line pt-5 text-xs text-ink-subtle sm:flex-row sm:justify-between">
          <span className="lg:hidden">© {year} Odoline</span>
          <span className="inline-flex items-center gap-1.5 text-center lg:mx-auto">
            <Lock className="size-3.5 shrink-0" />
            {COPY.access}
          </span>
        </footer>
      </main>
    </div>
  );
}

/** Row of odometer-style ticks; every fifth one is taller. */
function OdometerTicks({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="odo-ticks" width="50" height="12" patternUnits="userSpaceOnUse">
          {[0, 10, 20, 30, 40].map((x) => (
            <rect
              key={x}
              x={x}
              y={0}
              width={1}
              height={x === 0 ? 12 : 6}
              fill="currentColor"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#odo-ticks)" />
    </svg>
  );
}
