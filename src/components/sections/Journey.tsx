import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { JourneyReveal } from "@/src/components/sections/JourneyReveal";

// Reveal classes below hide items only after JS mounts and before the section
// scrolls into view, so the content stays readable without JavaScript.

export function Journey() {
  const journey = siteContent.journey;
  const stages = journey.stages;
  const last = stages.length - 1;
  const inset = `${50 / stages.length}%`;

  return (
    <Section id="journey" variant="dark" spacing="spacious" className="relative overflow-hidden border-y border-footer-line">
      <Container size="default">
        <SectionHeading
          index="02"
          eyebrow={siteContent.sectionLabels.journey}
          heading={journey.heading}
          description={journey.paragraph}
          variant="dark"
        />

        <JourneyReveal>
          {/* Desktop: one horizontal line through all stages */}
          <div className="relative hidden lg:block">
            <span
              aria-hidden="true"
              className="absolute top-[11px] h-px bg-footer-line"
              style={{ left: inset, right: inset }}
            />
            <span
              aria-hidden="true"
              className={`absolute top-[10px] h-[3px] origin-left rounded-full bg-accent transition-transform duration-[1600ms] ease-[cubic-bezier(0.65,0,0.35,1)] [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:scale-x-0`}
              style={{ left: inset, right: inset }}
            />
            <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
              {stages.map((stage, idx) => {
                const isLast = idx === last;
                return (
                  <li
                    key={stage}
                    style={{ transitionDelay: `${200 + idx * 140}ms` }}
                    className={`flex flex-col items-center text-center transition-[opacity,transform] duration-500 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:translate-y-2 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:opacity-0`}
                  >
                    <span
                      className={`relative z-10 grid size-6 place-items-center rounded-full ring-8 ring-footer ${
                        isLast ? "bg-highlight" : "bg-accent"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-footer" />
                    </span>
                    <span className="mt-6 font-mono text-[11px] text-footer-muted">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`mt-1.5 px-1 font-heading text-[15px] font-bold leading-tight tracking-tight ${
                        isLast ? "text-highlight" : "text-footer-ink"
                      }`}
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Mobile / tablet: the same line, running down */}
          <ol className="relative grid gap-x-8 sm:grid-cols-2 lg:hidden">
            {stages.map((stage, idx) => {
              const isLast = idx === last;
              return (
                <li
                  key={stage}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                  className={`relative flex items-center gap-5 border-b border-footer-line py-4 transition-[opacity,transform] duration-500 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:translate-x-2 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:opacity-0`}
                >
                  <span className="w-6 font-mono text-[11px] text-footer-muted">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${isLast ? "bg-highlight" : "bg-accent"}`}
                  />
                  <span
                    className={`font-heading text-lg font-bold tracking-tight ${
                      isLast ? "text-highlight" : "text-footer-ink"
                    }`}
                  >
                    {stage}
                  </span>
                </li>
              );
            })}
          </ol>
        </JourneyReveal>
      </Container>
    </Section>
  );
}
