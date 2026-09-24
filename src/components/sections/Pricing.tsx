import * as React from "react";
import { siteContent, formatINR } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { Check } from "lucide-react";

export function Pricing() {
  const pricing = siteContent.pricing;
  const flags = siteContent.flags;

  // Render founding offer text if flag is set
  const foundingOfferText = flags.pricingFoundingOffer
    ? pricing.foundingOfferTemplate
        .replace("{discountPercent}", String(flags.pricingFoundingOffer.discountPercent))
        .replace("{years}", String(flags.pricingFoundingOffer.years))
        .replace("{placesLeft}", String(flags.pricingFoundingOffer.placesLeft))
    : null;

  return (
    <Section id="pricing" variant="default" spacing="spacious" className="border-t border-line">
      <Container size="default">
        <SectionHeading
          index="07"
          eyebrow={siteContent.sectionLabels.pricing}
          heading={pricing.heading}
          description={pricing.description}
        />

        {foundingOfferText && (
          <p className="mb-6 flex items-center gap-3 rounded-2xl bg-highlight-light px-5 py-4 text-[15px] font-medium text-ink">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
            {foundingOfferText}
          </p>
        )}

        <div className="rounded-[1.75rem] border border-line bg-inset p-1.5 shadow-float sm:p-2">
          <div className="grid overflow-hidden rounded-[1.35rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Price */}
            <div className="relative flex flex-col justify-between gap-12 bg-footer p-8 text-footer-ink sm:p-10 lg:p-12">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-footer-muted">
                  {pricing.planName}
                </div>
                <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-heading text-[clamp(3.25rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.045em]">
                    {formatINR(pricing.plan.amount)}
                  </span>
                  <span className="text-lg text-footer-muted">{pricing.plan.period}</span>
                </div>
                <div className="mt-3 text-sm text-footer-muted">{pricing.plan.taxNote}</div>
                {flags.pricingMonthly && (
                  <div className="mt-2 text-sm text-footer-ink">
                    {pricing.monthlyTemplate.replace("{amount}", formatINR(flags.pricingMonthly.amount))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <DemoButton
                  variant="onDark"
                  size="lg"
                  label={pricing.buttonText}
                  className="w-full"
                />
                <p className="text-center text-xs text-footer-muted">{pricing.footnote}</p>
              </div>
            </div>

            {/* Inclusions */}
            <div className="bg-card p-8 sm:p-10 lg:p-12">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
                {pricing.inclusionsLabel}
              </div>
              <ul className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
                {pricing.inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3.5 border-b border-line py-4 text-[15px] font-medium text-ink"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-light text-accent">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Extra branch */}
              <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-dashed border-line p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-heading text-lg font-bold tracking-tight text-ink">
                    {pricing.extraBranch.title}{" "}
                    <span className="text-ink-muted">
                      +{formatINR(pricing.extraBranch.amount)}
                      {pricing.extraBranch.period}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm text-ink-muted">
                    +{pricing.extraBranch.staffIncluded} {pricing.extraBranch.staffLabel}
                  </div>
                </div>
                <span className="self-start rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted sm:self-auto">
                  {pricing.extraBranch.badgeText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
