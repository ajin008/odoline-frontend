import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-light font-heading text-lg font-bold text-accent">
        404
      </span>

      <h1 className="mt-6 font-heading text-2xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-inverse transition-all hover:-translate-y-px hover:bg-accent-hover active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Back home
      </Link>
    </div>
  );
}
