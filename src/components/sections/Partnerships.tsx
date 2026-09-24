import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { ShieldCheck, Eye, Pencil, Sparkles } from "lucide-react";

export function Partnerships() {
  const partnerships = siteContent.partnerships;
  const labels = partnerships.visualLabels;

  // Placeholder partner initials A, B, C, D
  const partnerVisuals = [
    { initial: "A", name: "Primary Owner", role: labels.primary, isPrimary: true },
    { initial: "B", name: "Partner", role: labels.partner, isPrimary: false },
    { initial: "C", name: "Partner", role: labels.partner, isPrimary: false },
    { initial: "D", name: "Partner", role: labels.partner, isPrimary: false },
  ];

  return (
    <Section id="partners" variant="band" spacing="spacious">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Highlight */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              heading={partnerships.heading}
              variant="band"
              align="left"
              className="mb-4 md:mb-4"
            />

            {/* Problem Paragraph */}
            <p className="text-body-lg text-band-muted leading-relaxed max-w-2xl">
              {partnerships.paragraph}
            </p>

            {/* Highlight Line */}
            <div className="p-4 sm:p-5 rounded-xl bg-accent/15 border border-accent/30 text-band-ink font-semibold text-body-lg sm:text-body-xl my-6 flex items-start gap-3.5 shadow-sm">
              <Sparkles className="h-5 w-5 text-accent shrink-0 mt-1" />
              <span>{partnerships.highlight}</span>
            </div>

            {/* Three Differentiator Points */}
            <ul className="space-y-3.5 list-none p-0 m-0" role="list">
              {partnerships.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-band-muted text-body-lg leading-relaxed">
                  <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Visual of 4 Owner Cards (HTML/CSS illustration) */}
          <div
            aria-hidden="true"
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none space-y-3"
          >
            <div className="text-xs font-mono font-semibold text-band-muted uppercase tracking-wider mb-2">
              Showroom Access Model (4 Logins)
            </div>

            {partnerVisuals.map((owner, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 transition-all flex items-center justify-between gap-3 ${
                  owner.isPrimary
                    ? "border-2 border-accent bg-accent/10 text-band-ink shadow-bento"
                    : "border border-band-muted/20 bg-inset/40 text-band-ink"
                }`}
              >
                {/* Avatar & Role Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`h-10 w-10 rounded-full font-mono font-bold text-sm flex items-center justify-center shrink-0 ${
                      owner.isPrimary
                        ? "bg-accent text-inverse shadow-sm"
                        : "bg-band-muted/20 text-band-ink border border-band-muted/30"
                    }`}
                  >
                    {owner.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-band-ink truncate">
                        {owner.name}
                      </span>
                      {owner.isPrimary && (
                        <Pencil className="h-3.5 w-3.5 text-accent shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-mono text-band-muted truncate">
                      {owner.role}
                    </div>
                  </div>
                </div>

                {/* Status / Permission Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold shrink-0 ${
                    owner.isPrimary
                      ? "bg-accent/20 border border-accent/40 text-accent"
                      : "bg-band-muted/10 border border-band-muted/20 text-band-muted"
                  }`}
                >
                  {!owner.isPrimary && <Eye className="h-3 w-3 shrink-0" />}
                  {owner.isPrimary ? "Full access" : "View only"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
