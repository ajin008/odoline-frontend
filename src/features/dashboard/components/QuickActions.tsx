// features/dashboard/components/quick-actions.tsx
import Link from "next/link";
import { Plus } from "lucide-react";

export function QuickActions() {
  return (
    <section className="select-none">
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP VIEW: Clean, Minimalist Inline Layout                 */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex items-center justify-between border-b border-line pb-3 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold tracking-tight text-ink font-sans">
            Quick Actions
          </h2>
          <p className="text-xs text-ink-subtle font-sans">
            Frequent administrative tasks and terminal updates.
          </p>
        </div>

        <Link
          href="/owner/cars/add"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-inverse shadow-sm transition-all duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
          Add Car
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW: Shrunken, Low-Profile Action Row                */}
      {/* ------------------------------------------------------------- */}
      <div className="block md:hidden">
        <h2 className="mb-2 text-[10px] font-mono font-medium uppercase tracking-widest text-ink-muted">
          Quick Actions
        </h2>

        {/* Height reduced drastically to a clean, single-row interactive asset */}
        <Link
          href="/owner/cars/add"
          className="flex items-center justify-between rounded-xl border border-dashed border-ink-subtle/30 bg-card p-4 transition-all duration-200 active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-inverse shadow-sm">
              <Plus className="h-4 w-4 stroke-[2.5px]" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink font-sans">
              Add new stock entry
            </span>
          </div>

          <span className="text-[10px] font-mono font-medium text-ink-subtle bg-canvas border border-line px-2 py-0.5 rounded-md uppercase tracking-wider">
            Intake
          </span>
        </Link>
      </div>
    </section>
  );
}
