import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { Warehouse, Building2, Gem } from "lucide-react";

const AUDIENCE_META = [
  {
    icon: Warehouse,
    statDescriptor: "150+ CARS IN STOCK",
    pastelClass: "bg-pastel-lavender text-pastel-ink border-pastel-lavender/40",
    widget: (
      <div className="mt-6 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Multi-State Intake</span>
          <span className="text-accent font-bold">150+ Yard Cars</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Interstate Papers</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-semibold">
            Organized ✓
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: Building2,
    statDescriptor: "2–4 LOCATIONS",
    pastelClass: "bg-pastel-periwinkle text-pastel-ink border-pastel-periwinkle/40",
    widget: (
      <div className="mt-6 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">Owner Multi-Yard View</span>
          <span className="text-highlight-ink bg-highlight-light px-2 py-0.5 rounded border border-highlight/30 font-bold">
            2–4 Branches
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Stock &amp; Staff Live</span>
          <span className="text-accent font-semibold">Unified View</span>
        </div>
      </div>
    ),
  },
  {
    icon: Gem,
    statDescriptor: "₹10L – ₹2CR PER CAR",
    pastelClass: "bg-pastel-butter text-pastel-ink border-pastel-butter/40",
    widget: (
      <div className="mt-6 pt-4 border-t border-line/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono bg-inset p-2.5 rounded-xl border border-line/50">
          <span className="font-semibold text-ink">High-Value Deal Dossier</span>
          <span className="text-accent font-bold">₹10L – ₹2Cr / Car</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
          <span>Branded Documents</span>
          <span className="text-lime-ink bg-lime-light px-2 py-0.5 rounded border border-lime/30 font-semibold">
            Zero Errors ✓
          </span>
        </div>
      </div>
    ),
  },
];

export function Audiences() {
  const audiences = siteContent.audiences;

  return (
    <Section id="who-its-for" variant="default" spacing="spacious">
      <Container size="default">
        {/* Section Heading */}
        <SectionHeading
          heading={audiences.heading}
          align="center"
        />

        {/* Three Distinct Audience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {audiences.items.map((item, idx) => {
            const meta = AUDIENCE_META[idx] || AUDIENCE_META[0];
            const IconComponent = meta.icon;

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-bento transition-all hover:border-line-focus hover:shadow-float"
              >
                <div>
                  {/* Header Row: Stat Callout & Optional Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-md border border-accent/20">
                      {meta.statDescriptor}
                    </span>

                    {item.badge && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-highlight-light border border-highlight/30 text-highlight-ink">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon & Title Row */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.pastelClass}`}>
                      <IconComponent className="h-5 w-5 stroke-[2]" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-ink">
                      {item.title}
                    </h3>
                  </div>

                  {/* Panel Description */}
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
      </Container>
    </Section>
  );
}
