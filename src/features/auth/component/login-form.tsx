// features/auth/components/login-form.tsx
"use client";

import { useLogin } from "../hooks/use-login";

// Fixed positions instead of Math.random() during render — avoids SSR/client
// hydration mismatches and keeps the component pure.
const FLOATING_DOTS = [
  { top: "18%", left: "12%", duration: "9s", delay: "0s" },
  { top: "32%", left: "68%", duration: "11s", delay: "1.2s" },
  { top: "55%", left: "22%", duration: "8s", delay: "2.4s" },
  { top: "70%", left: "80%", duration: "13s", delay: "0.6s" },
  { top: "25%", left: "45%", duration: "10s", delay: "3s" },
  { top: "60%", left: "60%", duration: "7s", delay: "1.8s" },
  { top: "40%", left: "85%", duration: "12s", delay: "2.1s" },
  { top: "80%", left: "35%", duration: "9.5s", delay: "0.9s" },
];

export function LoginForm() {
  const { register, errors, onSubmit, isSubmitting } = useLogin();

  return (
    <>
      {/* MOBILE LAYOUT - Clean & Minimal */}
      <div className="relative flex min-h-screen flex-col md:hidden">
        {/* TOP: Brand - Simple & Bold */}
        <div className="relative flex-[1.2] flex items-center justify-center overflow-hidden bg-linear-to-br from-black via-neutral-900 to-black">
          {/* Subtle texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                // eslint-disable-next-line no-secrets/no-secrets -- SVG noise-texture data URI, not a secret
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />
          </div>

          {/* Minimal decorative orb */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

          {/* Simple brand display */}
          <div className="relative z-10 text-center px-6">
            <div className="flex items-center justify-center gap-1">
              <span className="font-heading text-7xl font-bold tracking-tight text-white">
                Cars
              </span>
              <span className="font-heading text-7xl font-bold tracking-tight text-white">
                4
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white/30 tracking-[0.15em] uppercase">
              Dealership Management
            </p>
          </div>
        </div>

        {/* BOTTOM: Form */}
        <div className="relative flex-shrink-0 rounded-t-2xl bg-canvas px-6 pb-8 pt-6 shadow-[0_-8px_40px_rgba(0,0,0,0.06)] border-t border-line/50">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">
                  Welcome back
                </h2>
                <p className="mt-0.5 text-sm text-ink-secondary/60">
                  Enter credentials to continue
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-canvas-secondary/80 flex items-center justify-center border border-line/50">
                <svg
                  className="w-4 h-4 text-ink-secondary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              {/* Phone */}
              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-secondary/50">
                  Phone number
                  <span className="font-normal lowercase tracking-normal text-[10px] text-ink-secondary/30">
                    +91
                  </span>
                </label>
                <div className="relative mt-1.5 group">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ink/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="99953 56243"
                    aria-invalid={!!errors.phone}
                    className="relative w-full rounded-xl border border-line bg-canvas-secondary/60 px-4 py-3.5 pl-12 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/40 focus:border-ink/40 focus:bg-canvas focus:shadow-[0_0_0_4px_rgba(39,39,39,0.04)] aria-invalid:border-danger/50 aria-invalid:shadow-[0_0_0_4px_rgba(196,90,74,0.08)]"
                    {...register("phone")}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-muted/40">
                    +91
                  </span>
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-danger/80 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* PIN */}
              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-secondary/50">
                  PIN
                  <span className="font-normal lowercase tracking-normal text-[10px] text-ink-secondary/30">
                    6 digits
                  </span>
                </label>
                <div className="relative mt-1.5 group">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ink/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="current-password"
                    maxLength={6}
                    placeholder="••••••"
                    aria-invalid={!!errors.pin}
                    className="relative w-full rounded-xl border border-line bg-canvas-secondary/60 px-4 py-3.5 text-base tracking-[0.3em] text-ink outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-ink-muted/40 focus:border-ink/40 focus:bg-canvas focus:shadow-[0_0_0_4px_rgba(39,39,39,0.04)] aria-invalid:border-danger/50 aria-invalid:shadow-[0_0_0_4px_rgba(196,90,74,0.08)]"
                    {...register("pin")}
                  />
                </div>
                {errors.pin && (
                  <p className="mt-1.5 text-xs font-medium text-danger/80 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.pin.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-inverse transition-all duration-200 hover:bg-ink/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-inverse/30 border-t-inverse" />
                    Signing in…
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Log in
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="h-px flex-1 bg-line/50" />
                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-ink-secondary/30">
                  Secure Access
                </span>
                <div className="h-px flex-1 bg-line/50" />
              </div>
            </form>
          </div>
        </div>

        {/* Safe area for PWA */}
        <div className="h-safe-bottom bg-canvas" />
      </div>

      {/* DESKTOP LAYOUT - Enhanced */}
      <div className="hidden md:flex min-h-screen">
        {/* LEFT: Visual Panel with rich gradient */}
        <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-ink via-ink/95 to-ink/90 p-12 overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-[0.06]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 50%, #ffffff 0%, transparent 70%)",
                animation: "pulse 8s ease-in-out infinite",
              }}
            />
          </div>

          {/* Geometric decorations */}
          <div className="absolute top-20 right-20 w-64 h-64 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 left-20 w-96 h-96 border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />

          {/* Colorful accent orbs */}
          <div className="absolute top-40 right-40 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-40 left-40 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />

          {/* Floating dots */}
          <div className="absolute inset-0 pointer-events-none">
            {FLOATING_DOTS.map((dot, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/10"
                style={{
                  top: dot.top,
                  left: dot.left,
                  animation: `float ${dot.duration} ease-in-out infinite`,
                  animationDelay: dot.delay,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="font-heading text-lg font-bold text-white">
                4
              </span>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
              Dealership Management
            </p>
            <h2 className="mt-4 font-heading text-[42px] font-semibold leading-[1.1] tracking-tight text-white">
              Every car, every customer,
              <br />
              every rupee — in one place.
            </h2>
            <div className="mt-8 flex items-center gap-5">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-sm font-medium text-white/40 tracking-wide">
                Built for the forecourt
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-6">
              <p className="text-xs text-white/30">Secure • India • 2026</p>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/20"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Panel */}
        <div className="flex flex-1 items-center justify-center bg-canvas px-12 relative">
          {/* Subtle background pattern */}
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
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-ink/5 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-ink/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                  Welcome back
                </h1>
                <p className="text-sm text-ink-secondary/70">
                  Enter credentials to continue
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-secondary/60">
                  Phone number
                </label>
                <div className="relative mt-1.5 group">
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="99953 56243"
                    aria-invalid={!!errors.phone}
                    className="w-full rounded-lg border border-line bg-canvas-secondary/60 px-4 py-3 pl-12 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 focus:border-ink/30 focus:bg-canvas focus:shadow-[0_0_0_4px_rgba(39,39,39,0.04)] aria-invalid:border-danger/40 aria-invalid:shadow-[0_0_0_4px_rgba(196,90,74,0.06)]"
                    {...register("phone")}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-muted/50">
                    +91
                  </span>
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-danger/80 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* PIN */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-secondary/60">
                  PIN
                </label>
                <div className="relative mt-1.5 group">
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="current-password"
                    maxLength={6}
                    placeholder="••••••"
                    aria-invalid={!!errors.pin}
                    className="w-full rounded-lg border border-line bg-canvas-secondary/60 px-4 py-3 text-base tracking-[0.3em] text-ink outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-ink-muted/50 focus:border-ink/30 focus:bg-canvas focus:shadow-[0_0_0_4px_rgba(39,39,39,0.04)] aria-invalid:border-danger/40 aria-invalid:shadow-[0_0_0_4px_rgba(196,90,74,0.06)]"
                    {...register("pin")}
                  />
                </div>
                {errors.pin && (
                  <p className="mt-1.5 text-xs font-medium text-danger/80 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-danger" />
                    {errors.pin.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-inverse transition-all duration-200 hover:bg-ink/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-inverse/30 border-t-inverse" />
                    Signing in…
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Log in
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-canvas text-ink-secondary/40">
                    Secure access
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.03;
            transform: scale(1);
          }
          50% {
            opacity: 0.06;
            transform: scale(1.1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -15px);
          }
          50% {
            transform: translate(-5px, -25px);
          }
          75% {
            transform: translate(15px, -10px);
          }
        }
      `}</style>
    </>
  );
}
