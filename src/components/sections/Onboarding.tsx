import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { Sparkles } from "lucide-react";

export function Onboarding() {
  const onboarding = siteContent.onboarding;

  return (
    <Section id="onboarding" variant="inset" spacing="spacious">
      <Container size="default">
        {/* Section Heading */}
        <SectionHeading
          heading={onboarding.heading}
          align="center"
        />

        {/* Four Numbered Onboarding Steps (<ol>) */}
        <div className="relative pt-4 pb-2">
          {/* =========================================================================
             Desktop Horizontal Steps (≥ 1024px)
             ========================================================================= */}
          <div className="hidden lg:block relative">
            {/* Continuous Thin Connecting Line (Echoing Journey Motif) */}
            <div
              aria-hidden="true"
              className="absolute top-5 left-[calc(100%/8)] right-[calc(100%/8)] h-0.5 bg-line z-0"
            />

            <ol className="relative z-10 grid grid-cols-4 gap-6 list-none p-0 m-0">
              {onboarding.steps.map((step, idx) => {
                const stepNum = String(idx + 1).padStart(2, "0");
                return (
                  <li key={idx} className="flex flex-col items-center text-center group">
                    {/* Number Badge */}
                    <div className="h-10 w-10 rounded-full border border-line bg-card flex items-center justify-center font-mono font-bold text-xs text-accent shadow-bento group-hover:border-accent transition-colors">
                      {stepNum}
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="mt-4 font-heading font-bold text-lg text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                      {step.description}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* =========================================================================
             Mobile / Tablet Vertical Steps (< 1024px)
             ========================================================================= */}
          <div className="lg:hidden relative pl-8">
            {/* Thin Connecting Vertical Line */}
            <div
              aria-hidden="true"
              className="absolute left-4 top-4 bottom-4 w-0.5 bg-line z-0"
            />

            <ol className="relative z-10 space-y-5 list-none p-0 m-0">
              {onboarding.steps.map((step, idx) => {
                const stepNum = String(idx + 1).padStart(2, "0");
                return (
                  <li key={idx} className="relative flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="absolute -left-8 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-card font-mono font-bold text-xs text-accent shadow-sm shrink-0">
                      {stepNum}
                    </div>

                    {/* Step Card Content */}
                    <div className="flex-1 p-4 rounded-xl border border-line bg-card shadow-sm">
                      <h3 className="font-heading font-bold text-base text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Emphasized Selling Point Closing Line */}
        <div className="mt-12 p-4 sm:p-5 rounded-xl bg-card border border-line text-center max-w-xl mx-auto shadow-sm flex items-center justify-center gap-3">
          <Sparkles className="h-4 w-4 text-accent shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-ink-muted leading-relaxed">
            {onboarding.closingLine}
          </p>
        </div>
      </Container>
    </Section>
  );
}
