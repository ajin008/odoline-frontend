import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";

export function Audiences() {
  const audiences = siteContent.audiences;

  return (
    <Section id="who-its-for" variant="default" spacing="spacious">
      <Container size="default">
        <SectionHeading
          index="05"
          eyebrow={siteContent.sectionLabels.audiences}
          heading={audiences.heading}
        />

        <ul className="grid gap-px overflow-hidden border-y border-line bg-line lg:grid-cols-3">
          {audiences.items.map((item, idx) => (
            <li key={item.title} className="flex flex-col bg-canvas py-10 lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <div className="mb-10 flex h-7 items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-ink-subtle">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {item.badge && (
                  <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink md:text-[1.75rem]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
