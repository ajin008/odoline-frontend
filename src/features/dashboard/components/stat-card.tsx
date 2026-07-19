// features/dashboard/components/stat-card.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  loading = false,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className={[
        "group flex flex-col justify-between rounded-2xl border border-line bg-card p-6 shadow-bento transition-all duration-300 select-none",
        "hover:bg-accent hover:border-accent hover:-translate-y-0.5 active:scale-[0.98]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between w-full">
        {/* Label - smooth color flip to inverse text layout on hover */}
        <span className="text-xs font-semibold tracking-tight text-ink-muted font-sans group-hover:text-inverse/90 transition-colors duration-200">
          {label}
        </span>

        {/* Icon Frame - shifts seamlessly into high-contrast white glass blocks */}
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-inset text-ink-subtle border border-line transition-all duration-300 group-hover:bg-inverse/15 group-hover:text-inverse group-hover:border-transparent">
          <Icon className="h-4 w-4 stroke-[2px] transition-transform duration-300 group-hover:scale-105" />
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-9 w-16 animate-pulse rounded-lg bg-inset group-hover:bg-inverse/20" />
        ) : (
          <span className="font-heading text-3xl font-bold tracking-tight text-ink block leading-none group-hover:text-inverse transition-colors duration-200">
            {value}
          </span>
        )}
      </div>
    </Link>
  );
}
