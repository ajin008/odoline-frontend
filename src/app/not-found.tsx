"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      {/* Decorative brand mark */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-ink/5 border border-line/50">
          <span className="font-heading text-4xl font-bold text-ink/20">
            404
          </span>
        </div>
      </div>

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>

      <p className="mt-2 max-w-sm text-sm text-ink-secondary/70">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-inverse transition-all hover:bg-ink/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back home
        </Link>

        <Link
          href="/support"
          className="inline-flex items-center justify-center rounded-xl border border-line bg-transparent px-6 py-3 text-sm font-medium text-ink-secondary transition-all hover:border-ink/30 hover:bg-canvas-secondary/50 hover:text-ink active:scale-[0.98]"
        >
          Contact support
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-8 flex items-center gap-4 text-xs text-ink-secondary/40">
        <Link
          href="/"
          className="hover:text-ink-secondary/70 transition-colors"
        >
          Dashboard
        </Link>
        <span className="w-px h-3 bg-line/50" />
        <Link
          href="/cars"
          className="hover:text-ink-secondary/70 transition-colors"
        >
          Cars
        </Link>
        <span className="w-px h-3 bg-line/50" />
        <Link
          href="/customers"
          className="hover:text-ink-secondary/70 transition-colors"
        >
          Customers
        </Link>
      </div>
    </div>
  );
}
