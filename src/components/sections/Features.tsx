import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { Car, FileCheck, Users, Receipt, MapPin, BarChart3 } from "lucide-react";

// Map icon names from site.ts to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  car: Car,
  "file-check": FileCheck,
  users: Users,
  receipt: Receipt,
  "map-pin": MapPin,
  "bar-chart-3": BarChart3,
};

export function Features() {
  const features = siteContent.features;

  return (
    <Section id="features" variant="default" spacing="spacious">
      <Container size="default">
        <SectionHeading
          index="03"
          eyebrow={siteContent.sectionLabels.features}
          heading={features.heading}
          description={features.paragraph}
        />

        {/* Spec-sheet grid: hairlines instead of floating cards */}
        <ul className="grid overflow-hidden rounded-[1.75rem] border border-line bg-line gap-px sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || Car;
            return (
              <li
                key={item.title}
                className="group relative flex flex-col bg-canvas p-7 transition-colors hover:bg-card sm:p-9"
              >
                <div className="mb-12 flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-card text-ink transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-[11px] text-ink-subtle">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Capability strip */}
        <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-12">
          {features.capabilityStrip.map((capability) => (
            <li
              key={capability}
              className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              {capability}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
