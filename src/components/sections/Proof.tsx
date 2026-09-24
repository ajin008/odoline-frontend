import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { Quote } from "lucide-react";

export function Proof() {
  const proof = siteContent.proof;
  const flags = siteContent.flags;

  // Use named sentence variant if showroomName is present, otherwise neutral variant
  const paragraph = proof.showroomName
    ? proof.paragraphNamed
    : proof.paragraphNeutral;

  return (
    <Section id="proof" variant="inset" spacing="default">
      <Container size="narrow">
        {/* Section Heading & Intro Paragraph */}
        <SectionHeading
          heading={proof.heading}
          description={paragraph}
          align="center"
          className={flags.proofPublished ? "mb-10 md:mb-12" : "mb-0 md:mb-0"}
        />

        {/* Testimonial Block — Renders ONLY when proofPublished flag is true */}
        {flags.proofPublished && (
          <figure className="p-8 sm:p-10 rounded-2xl bg-card border border-line shadow-bento text-center max-w-3xl mx-auto">
            <Quote className="h-8 w-8 text-accent/40 mx-auto mb-4" />
            <blockquote className="font-heading text-display-md text-ink font-semibold italic leading-relaxed">
              &ldquo;{proof.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 pt-4 border-t border-line/60 text-body-lg font-medium text-ink-muted">
              <span className="font-bold text-ink">{proof.testimonial.name}</span>
              {" · "}
              <span>{proof.testimonial.role}</span>
              {", "}
              <span>{proof.testimonial.showroom}</span>
            </figcaption>
          </figure>
        )}
      </Container>
    </Section>
  );
}
