import * as React from "react";
import { siteContent, formatINR } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { DemoButton } from "@/src/components/ui/DemoButton";
import {
  CheckCircle2,
  Sparkles,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react";

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
    <Section id="pricing" variant="default" spacing="spacious">
      <Container size="default">
        {/* Section Heading */}
        <SectionHeading
          heading={pricing.heading}
          description="One transparent plan for your whole team. No per-user charges or hidden fees."
          align="center"
        />

        {/* Optional Founding Offer Box */}
        {flags.pricingFoundingOffer && foundingOfferText && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-highlight-light border border-highlight/30 text-highlight-ink text-sm sm:text-body-lg font-medium flex items-center gap-3 shadow-sm">
            <Sparkles className="h-5 w-5 text-highlight-ink shrink-0" />
            <span>{foundingOfferText}</span>
          </div>
        )}

        {/* Main Modern SaaS Split Pricing Architecture */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-line bg-card shadow-float overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Plan Inclusions & Value (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-md border border-accent/20">
                    COMPLETE SHOWROOM PLAN
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tight mb-2">
                  Everything included. Zero limits.
                </h3>
                <p className="text-sm sm:text-body-lg text-ink-muted leading-relaxed">
                  Run your stock, documents, leads, bookings, attendance, and owner dashboards under one subscription.
                </p>

                {/* Feature Inclusions Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {pricing.inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-inset border border-line/60"
                    >
                      <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-ink leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparency Footnote */}
              <div className="pt-6 border-t border-line/60 flex items-center gap-2 text-xs font-mono text-ink-subtle">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                <span>Includes onboarding &amp; personal team training</span>
              </div>
            </div>

            {/* Right Column: Investment Summary & Checkout Action (5 cols) */}
            <div className="lg:col-span-5 bg-inset p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-line flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-ink-subtle mb-4">
                  ANNUAL INVESTMENT
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-display-xl sm:text-display-2xl font-extrabold text-ink tracking-tight">
                      {formatINR(pricing.plan.amount)}
                    </span>
                    <span className="text-body-lg font-medium text-ink-muted">
                      {pricing.plan.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-ink-muted">
                    <span>{pricing.plan.taxNote}</span>
                    <span>·</span>
                    <span className="text-accent font-semibold">~₹82 / day</span>
                  </div>
                </div>

                {/* Optional Monthly Line */}
                {flags.pricingMonthly && (
                  <div className="mt-3 p-2.5 rounded-xl bg-card border border-line text-xs font-mono text-accent font-semibold">
                    or {formatINR(flags.pricingMonthly.amount)} / month
                  </div>
                )}

                {/* Key Benefits List */}
                <div className="mt-6 space-y-2.5 text-xs font-medium text-ink-muted">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>Instant setup for your showroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>No credit card required for demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>Isolated private database</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 space-y-3">
                <DemoButton
                  variant="primary"
                  size="lg"
                  label={pricing.buttonText}
                  className="w-full justify-center shadow-md"
                />
                <p className="text-[11px] text-center font-mono text-ink-subtle">
                  30-minute live demo on your showroom structure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Branch Extension Card */}
        <div className="mt-8 max-w-2xl mx-auto rounded-2xl border border-line bg-card p-5 sm:p-6 shadow-bento flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-base text-ink">
                  Need Multi-Branch Support?
                </h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-highlight-light border border-highlight/30 text-highlight-ink">
                  {pricing.extraBranch.badgeText}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                Add extra branches for {formatINR(pricing.extraBranch.amount)}{pricing.extraBranch.period} with {pricing.extraBranch.staffIncluded} more staff included.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
