import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ownerNavItems } from "./nav-items";
import { ShieldCheck, MapPin } from "lucide-react";
import { useCars } from "@/src/features/cars/hooks/use-cars";

export function OwnerSidebar() {
  const pathname = usePathname();
  const { data: inStockCars = [] } = useCars(["in_stock"]);
  const inStockCount = inStockCars.length;

  return (
    <aside className="flex h-full flex-col bg-[#171819] text-white border border-[#262729] rounded-2xl shadow-bento overflow-hidden select-none">
      {/* Brand Identity Branding Header (Updated with Image & Fixed Typography) */}
      <div className="flex h-18 items-center px-6 border-b border-[#262729]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="Cars4 Logo"
            width={28}
            height={28}
            className="rounded-lg object-contain"
            priority
          />
          <span className="font-heading text-[15px] font-semibold tracking-tight text-white">
            Cars4
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Layout System */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {ownerNavItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ease-out active:scale-[0.98]",
                    active
                      ? "bg-accent text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-all duration-200",
                        active
                          ? "text-white stroke-[2.5px]"
                          : "text-slate-400 group-hover:text-white",
                      ].join(" ")}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.label === "Inventory" && (
                    <span
                      className={[
                        "px-1.5 py-0.5 text-[10px] font-bold rounded-md font-mono transition-colors duration-200",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-slate-300",
                      ].join(" ")}
                    >
                      {inStockCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Internal Showroom Context Block */}
      <div className="p-4 border-t border-[#262729] bg-[#121314]/60 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold tracking-tight text-white">
            Main Showroom
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#1e1f21] border border-[#2e2f33] p-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wide uppercase text-slate-300">
              Terminal Online
            </span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
