import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";

export function Proof() {
  const proof = siteContent.proof;
  const flags = siteContent.flags;

  // Use named sentence variant if showroomName is present, otherwise neutral variant
  const paragraph = proof.showroomName
    ? proof.paragraphNamed
    : proof.paragraphNeutral;

  return (
    <Section id="proof" variant="default" spacing="default" className="border-t border-line">
      <Container size="default">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
              <span>06</span>
              <span aria-hidden="true" className="h-px w-8 bg-line" />
              <span>{siteContent.sectionLabels.proof}</span>
            </div>
            <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-[-0.025em] text-ink md:text-3xl">
              {proof.heading}
            </h2>
          </div>

          <div className="lg:col-span-8">
            <p className="font-heading text-2xl font-bold leading-snug tracking-[-0.02em] text-ink text-pretty md:text-[2.25rem] md:leading-[1.2]">
              {paragraph}
            </p>

            {/* Testimonial — renders ONLY when proofPublished flag is true */}
            {flags.proofPublished && (
              <figure className="mt-12 border-t border-line pt-8">
                <blockquote className="text-body-xl leading-relaxed text-ink-muted">
                  &ldquo;{proof.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-ink-subtle">
                  <span className="font-semibold text-ink">{proof.testimonial.name}</span>
                  {" · "}
                  {proof.testimonial.role}, {proof.testimonial.showroom}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
