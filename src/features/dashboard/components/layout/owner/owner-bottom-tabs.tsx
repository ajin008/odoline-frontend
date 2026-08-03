import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ownerNavItems } from "./nav-items";
import { useDashboardStats } from "@/src/features/dashboard/hooks/use-dashboard-stats";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Sparkles,
  Layers,
  Receipt,
} from "lucide-react";

export function OwnerBottomTabs() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { data: stats } = useDashboardStats();
  const inStockCount = stats?.total_stock ?? 0;

  // Core mobile navigation items
  const realMobileItems = ownerNavItems.filter((i) => i.mobile);

  // Simulated future scale items
  const dummyOverflowItems = [
    { href: "/owner/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/owner/team", label: "Team Members", icon: Users },
    { href: "/owner/expenses", label: "Expenses", icon: Receipt },
    { href: "/owner/campaigns", label: "Marketing", icon: Sparkles },
    { href: "/owner/categories", label: "Categories", icon: Layers },
  ];

  const allTargetItems = [...realMobileItems, ...dummyOverflowItems];
  const primaryItems = allTargetItems.slice(0, 3);
  const overflowItems = allTargetItems.slice(3);

  const isOverflowActive = overflowItems.some((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* FLOATING DETACHED DOCK NAVIGATION BAR                         */}
      {/* ------------------------------------------------------------- */}
      {/* Lifted using bottom-5, bounded left/right with mx-4, and full pill rounding */}
      <div className="fixed bottom-5 left-4 right-4 z-50 bg-card/85 backdrop-blur-xl border border-line rounded-full shadow-bento md:hidden select-none max-w-md mx-auto pointer-events-auto">
        <nav className="flex h-14 items-center justify-around px-2">
          {primaryItems.map((item) => {
            const active = pathname.startsWith(item.href) && !isMoreOpen;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className={[
                  "relative flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90",
                  active ? "text-accent" : "text-ink-muted",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ease-out",
                    active
                      ? "bg-accent-light/60 text-accent mb-0.5"
                      : "text-ink-subtle bg-transparent",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 ${
                      active ? "stroke-[2.5px]" : "stroke-[2px]"
                    }`}
                  />
                </div>
                <span className="font-sans leading-none">{item.label}</span>

                {item.label === "Inventory" && (
                  <span className="absolute top-1 right-[22%] min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-bold font-mono rounded-full bg-accent text-inverse border border-card shadow-sm">
                    {inStockCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* DOCK EXPANSION TRIGGER */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={[
              "flex flex-1 flex-col items-center justify-center h-full gap-0.5 text-[10px] font-semibold tracking-tight transition-all duration-200 active:scale-90 cursor-pointer",
              isMoreOpen || isOverflowActive ? "text-accent" : "text-ink-muted",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ease-out",
                isMoreOpen || isOverflowActive
                  ? "bg-accent-light/60 text-accent mb-0.5"
                  : "text-ink-subtle bg-transparent",
              ].join(" ")}
            >
              {isMoreOpen ? (
                <X className="h-[18px] w-[18px] stroke-[2.5px]" />
              ) : (
                <Menu
                  className={`h-[18px] w-[18px] ${
                    isOverflowActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  }`}
                />
              )}
            </div>
            <span className="font-sans leading-none">
              {isMoreOpen ? "Close" : "More"}
            </span>
          </button>
        </nav>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING COMPLEMENTARY SHEET CONTAINER                        */}
      {/* ------------------------------------------------------------- */}
      {isMoreOpen && (
        <>
          {/* Backdrop Mask */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 z-40 bg-ink/15 backdrop-blur-sm transition-opacity md:hidden animate-in fade-in duration-200 pointer-events-auto"
          />

          {/* Floating Action Menu Drawer Sheet */}
          {/* Positioned cleanly above the floating dock bar with bottom-24 */}
          <div className="fixed bottom-24 left-4 right-4 z-40 max-h-[55vh] overflow-y-auto bg-card border border-line rounded-[2rem] shadow-bento p-4 space-y-1.5 md:hidden max-w-md mx-auto animate-in slide-in-from-bottom-6 cubic-bezier(0.16, 1, 0.3, 1) duration-300 pointer-events-auto">
            <div className="text-[10px] font-mono font-bold tracking-widest text-ink-subtle uppercase px-3 py-1.5 border-b border-line/40 mb-2">
              System Applications
            </div>

            <div className="grid grid-cols-1 gap-1">
              {overflowItems.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={[
                      "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.99]",
                      active
                        ? "bg-accent text-inverse"
                        : "text-ink-muted hover:bg-canvas/80 hover:text-ink",
                    ].join(" ")}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active
                          ? "text-inverse stroke-[2.5px]"
                          : "text-ink-subtle group-hover:text-ink"
                      }`}
                    />
                    <span className="font-sans tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
