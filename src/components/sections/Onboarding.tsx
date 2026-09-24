import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";

export function Onboarding() {
  const onboarding = siteContent.onboarding;
  const last = onboarding.steps.length - 1;

  return (
    <Section id="onboarding" variant="inset" spacing="spacious">
      <Container size="default">
        <SectionHeading
          index="08"
          eyebrow={siteContent.sectionLabels.onboarding}
          heading={onboarding.heading}
          description={onboarding.closingLine}
        />

        {/* Steps sit on one continuous line — horizontal on desktop, vertical on mobile */}
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:top-[7px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
          />
          {onboarding.steps.map((step, idx) => (
            <li key={step.number} className="relative pl-10 md:pl-0">
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 size-[15px] rounded-full shadow-[0_0_0_4px_var(--canvas-inset)] md:relative md:block ${
                  idx === last ? "bg-highlight" : "bg-accent"
                }`}
              />
              <div className="font-mono text-[11px] text-ink-subtle md:mt-8">
                {String(step.number).padStart(2, "0")}
              </div>
              <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
