import * as React from "react";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Button } from "@/src/components/ui/button";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { Check, Clock, Car } from "lucide-react";

export function Hero() {
  const hero = siteContent.hero;
  const mock = hero.mock;
  const whatsappUrl = buildWhatsAppLink();

  return (
    <Section id="top" variant="default" spacing="spacious" className="pt-8 md:pt-16">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Main Headline (The Page's ONLY h1) */}
            <h1 className="text-display-2xl text-ink font-extrabold tracking-tight">
              {hero.headline.includes("one screen.") ? (
                <>
                  {hero.headline.replace("one screen.", "")}
                  <span className="marker whitespace-nowrap">one screen.</span>
                </>
              ) : (
                hero.headline
              )}
            </h1>

            {/* Subtext */}
            <p className="text-body-xl text-ink-muted leading-relaxed max-w-2xl">
              {hero.subtext}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <DemoButton variant="primary" size="lg" label={hero.primaryButton} />
              <Button href={whatsappUrl} external variant="secondary" size="lg">
                <img
                  src="/icons/whatsappIcon.png"
                  alt="WhatsApp"
                  className="h-5 w-5 object-contain shrink-0"
                />
                <span>{hero.secondaryButton}</span>
              </Button>
            </div>

            {/* Trust Line */}
            <p className="text-xs font-medium text-ink-subtle pt-2">
              {hero.trustLine}
            </p>
          </div>

          {/* Right Column: Stylised Car Timeline Mock Card (HTML/CSS) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {/* Placeholder: replace with a real app screenshot later */}
            <div
              aria-hidden="true"
              className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-bento transition-all hover:border-line-focus"
            >
              {/* Card Header: Car Title & Registration */}
              <div className="flex items-start justify-between gap-3 border-b border-line/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ink font-heading font-bold text-lg">
                    <Car className="h-5 w-5 text-accent shrink-0" />
                    <span>{mock.title}</span>
                  </div>
                  <div className="text-xs font-mono font-medium text-ink-muted bg-inset px-2 py-0.5 rounded border border-line/50 inline-block">
                    {mock.regNumber}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-light border border-lime/30 text-lime-ink text-xs font-semibold shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-ink" />
                  {mock.statusBadge}
                </span>
              </div>

              {/* Vertical Timeline */}
              <div className="pt-5 space-y-4">
                <div className="text-xs font-mono font-semibold text-ink-subtle uppercase tracking-wider mb-3">
                  Vehicle Timeline Status
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
                  {mock.stages.map((stage, idx) => {
                    const isCompleted = stage.status === "completed";
                    const isCurrent = stage.status === "current";

                    return (
                      <div
                        key={idx}
                        className="relative flex items-center justify-between gap-4 text-xs"
                      >
                        {/* Timeline Node */}
                        <div
                          className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                            isCompleted
                              ? "bg-lime text-lime-ink"
                              : isCurrent
                              ? "bg-highlight text-highlight-ink ring-4 ring-highlight/20"
                              : "bg-inset text-ink-subtle border border-line"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-3 w-3 stroke-[3]" />
                          ) : isCurrent ? (
                            <span className="h-2 w-2 rounded-full bg-highlight-ink" />
                          ) : (
                            <Clock className="h-2.5 w-2.5 opacity-60" />
                          )}
                        </div>

                        {/* Stage Label */}
                        <span
                          className={`font-medium ${
                            isCurrent
                              ? "font-bold text-ink text-sm"
                              : isCompleted
                              ? "text-ink font-semibold"
                              : "text-ink-subtle"
                          }`}
                        >
                          {stage.label}
                        </span>

                        {/* Date Tag */}
                        <span
                          className={`font-mono text-[11px] ${
                            isCurrent
                              ? "text-accent font-semibold"
                              : "text-ink-subtle"
                          }`}
                        >
                          {stage.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
