"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      {/* Large 404 with custom styling */}
      <div className="relative">
        <span className="font-heading text-[120px] font-bold leading-none tracking-tight text-ink/5 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-px bg-line" />
        </div>
      </div>

      <div className="mt-[-20px] space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="text-sm text-ink-secondary/60 max-w-sm">
          The page you&lsquo;re looking for doesn&lsquo;t exist or has been
          moved.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-transparent px-6 py-2.5 text-sm font-medium text-ink transition-all hover:bg-ink hover:text-inverse hover:border-ink"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back home
      </Link>

      {/* Simple divider with brand */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 text-xs text-ink-secondary/20">
        <span className="tracking-[0.15em] uppercase">Odoline</span>
        <span className="w-px h-3 bg-line/50" />
        <span className="tracking-[0.1em]">Dealership Management</span>
      </div>
    </div>
  );
}
