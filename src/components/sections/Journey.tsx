import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { JourneyReveal } from "@/src/components/sections/JourneyReveal";

export function Journey() {
  const journey = siteContent.journey;

  return (
    <Section id="journey" variant="default" spacing="spacious">
      <Container size="default">
        {/* Section Heading & Copy */}
        <SectionHeading
          heading={journey.heading}
          description={journey.paragraph}
          align="center"
        />

        {/* 9 Stages as ONE Continuous Line */}
        <JourneyReveal>
          <div className="relative pt-6 pb-4">
            {/* =========================================================================
               Desktop Horizontal Line Layout (≥ 1024px)
               All 9 stages fit without horizontal scrolling at 1024px.
               ========================================================================= */}
            <div className="hidden lg:block relative">
              {/* Continuous Decorative Background Line */}
              <div
                aria-hidden="true"
                className="absolute top-5 left-[calc(100%/18)] right-[calc(100%/18)] h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20 z-0 origin-left transition-transform duration-700 ease-out [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:scale-x-0"
              />

              {/* 9 Stages Grid */}
              <ol className="relative z-10 grid grid-cols-9 gap-2 list-none p-0 m-0">
                {journey.stages.map((stage, idx) => {
                  const stageNum = String(idx + 1).padStart(2, "0");
                  const isFinalStage = idx === journey.stages.length - 1;

                  return (
                    <li
                      key={idx}
                      style={{ transitionDelay: `${idx * 65}ms` }}
                      className="flex flex-col items-center text-center group transition-all duration-500 ease-out [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:opacity-0 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:translate-y-4"
                    >
                      {/* Node Circle */}
                      <div
                        className={`h-10 w-10 rounded-full border bg-card flex items-center justify-center font-mono font-bold text-xs shadow-bento group-hover:scale-110 transition-all ${
                          isFinalStage
                            ? "border-highlight/60 text-highlight bg-highlight-light group-hover:border-highlight"
                            : "border-line text-accent group-hover:border-accent"
                        }`}
                      >
                        {stageNum}
                      </div>

                      {/* Stage Label */}
                      <span
                        className={`mt-3 font-heading font-semibold text-xs leading-tight tracking-tight break-words max-w-[100px] ${
                          isFinalStage ? "text-highlight font-bold" : "text-ink"
                        }`}
                      >
                        {stage}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* =========================================================================
               Mobile / Tablet Vertical Line Layout (< 1024px)
               ========================================================================= */}
            <div className="lg:hidden relative pl-8">
              {/* Continuous Decorative Background Line */}
              <div
                aria-hidden="true"
                className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent/20 via-accent to-accent/20 z-0 origin-top transition-transform duration-700 ease-out [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:scale-y-0"
              />

              {/* 9 Stages Vertical List */}
              <ol className="relative z-10 space-y-4 list-none p-0 m-0">
                {journey.stages.map((stage, idx) => {
                  const stageNum = String(idx + 1).padStart(2, "0");
                  const isFinalStage = idx === journey.stages.length - 1;

                  return (
                    <li
                      key={idx}
                      style={{ transitionDelay: `${idx * 65}ms` }}
                      className="relative flex items-center gap-4 transition-all duration-500 ease-out [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:opacity-0 [.journey-reveal-wrapper[data-mounted='true'][data-revealed='false']_&]:translate-x-3"
                    >
                      {/* Node Circle */}
                      <div
                        className={`absolute -left-8 flex h-8 w-8 items-center justify-center rounded-full border bg-card font-mono font-bold text-xs shadow-sm shrink-0 ${
                          isFinalStage
                            ? "border-highlight/60 text-highlight bg-highlight-light"
                            : "border-line text-accent"
                        }`}
                      >
                        {stageNum}
                      </div>

                      {/* Stage Card / Label */}
                      <div
                        className={`flex-1 p-3 rounded-xl border bg-card shadow-sm flex items-center justify-between ${
                          isFinalStage ? "border-highlight/40" : "border-line"
                        }`}
                      >
                        <span
                          className={`font-heading font-bold text-sm ${
                            isFinalStage ? "text-highlight" : "text-ink"
                          }`}
                        >
                          {stage}
                        </span>
                        <span className="text-xs font-mono text-ink-subtle">
                          Stage {idx + 1}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </JourneyReveal>
      </Container>
    </Section>
  );
}
