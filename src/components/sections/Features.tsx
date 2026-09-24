import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import {
  Car,
  FileCheck,
  Users,
  Receipt,
  MapPin,
  BarChart3,
  Check,
} from "lucide-react";

// Map icon names from site.ts to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  "file-check": FileCheck,
  users: Users,
  receipt: Receipt,
  "map-pin": MapPin,
  "bar-chart-3": BarChart3,
};

const PASTEL_TILES = [
  "bg-pastel-lavender text-pastel-ink border-pastel-lavender/40",
  "bg-pastel-periwinkle text-pastel-ink border-pastel-periwinkle/40",
  "bg-pastel-blush text-pastel-ink border-pastel-blush/40",
  "bg-pastel-butter text-pastel-ink border-pastel-butter/40",
  "bg-pastel-mint text-pastel-ink border-pastel-mint/40",
  "bg-pastel-lime text-pastel-ink border-pastel-lime/40",
];

const MODULE_META = [
  {
    moduleTag: "MODULE 01 · INVENTORY",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Creta SX (2021)</span>
          <span className="text-accent font-bold">₹12.4 Lakhs</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Refurb: ₹18,000</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-semibold">
            In Yard
          </span>
        </div>
      </div>
    ),
  },
  {
    moduleTag: "MODULE 02 · PAPERWORK",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-semibold bg-lime-light text-lime-ink px-2 py-0.5 rounded border border-lime/30">
            RC ✓
          </span>
          <span className="text-[11px] font-mono font-semibold bg-lime-light text-lime-ink px-2 py-0.5 rounded border border-lime/30">
            NOC ✓
          </span>
          <span className="text-[11px] font-mono font-semibold bg-lime-light text-lime-ink px-2 py-0.5 rounded border border-lime/30">
            Insurance ✓
          </span>
          <span className="text-[11px] font-mono font-semibold bg-lime-light text-lime-ink px-2 py-0.5 rounded border border-lime/30">
            Pollution ✓
          </span>
        </div>
        <div className="text-[11px] font-mono text-ink-muted flex items-center justify-between px-1 pt-1">
          <span>Verification: 100%</span>
          <span className="text-accent font-bold">Ready to Deliver</span>
        </div>
      </div>
    ),
  },
  {
    moduleTag: "MODULE 03 · LEADS & CRM",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Enquiry: Thar 4x4</span>
          <span className="text-highlight-ink bg-highlight-light px-2 py-0.5 rounded border border-highlight/30 font-bold">
            Today 4 PM
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Assigned: Sales Exec</span>
          <span className="text-accent font-semibold">Active Deal</span>
        </div>
      </div>
    ),
  },
  {
    moduleTag: "MODULE 04 · DEALS & BOOKING",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Booking Receipt</span>
          <span className="text-accent font-bold">₹50,000 Token</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Amount: ₹14,50,000</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-semibold">
            Prebooked
          </span>
        </div>
      </div>
    ),
  },
  {
    moduleTag: "MODULE 05 · STAFF & GPS",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">GPS Geofence Clock-in</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-bold">
            Verified ✓
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Showroom Yard Location</span>
          <span className="text-accent font-semibold">8 Present</span>
        </div>
      </div>
    ),
  },
  {
    moduleTag: "MODULE 06 · DASHBOARDS",
    widget: (
      <div className="mt-5 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Monthly Overview</span>
          <span className="text-accent font-bold">14 Cars Sold</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Total Revenue: ₹1.42 Cr</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-semibold">
            Profit Live
          </span>
        </div>
      </div>
    ),
  },
];

export function Features() {
  const features = siteContent.features;

  return (
    <Section id="features" variant="default" spacing="spacious">
      <Container size="default">
        {/* Section Heading & Intro */}
        <SectionHeading
          heading={features.heading}
          description={features.paragraph}
          align="center"
        />

        {/* Six Feature Cards Grid (1 col <640px, 2 col ≥640px, 3 col ≥1024px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {features.items.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Car;
            const pastelClass = PASTEL_TILES[idx % PASTEL_TILES.length];
            const meta = MODULE_META[idx] || MODULE_META[0];

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-line bg-card p-6 sm:p-7 shadow-bento transition-all hover:border-line-focus hover:shadow-float"
              >
                <div>
                  {/* Module Header Row */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-ink-subtle uppercase">
                      {meta.moduleTag}
                    </span>
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${pastelClass}`}
                    >
                      <IconComponent className="h-5.5 w-5.5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-heading font-bold text-xl text-ink mb-2.5">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-body-lg text-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Micro-UI Visual Widget */}
                {meta.widget}
              </div>
            );
          })}
        </div>

        {/* Capability Strip */}
        <div className="mt-14 pt-8 border-t border-line">
          <ul
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 list-none p-0 m-0"
            role="list"
          >
            {features.capabilityStrip.map((capability, idx) => (
              <li
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-inset border border-line/60 text-xs sm:text-sm font-medium text-ink shadow-2xs hover:border-line-focus transition-colors"
              >
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
