import * as React from "react";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { Button } from "@/src/components/ui/button";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { CheckCircle2 } from "lucide-react";

export function FinalCta() {
  const finalCta = siteContent.finalCta;
  const whatsappUrl = buildWhatsAppLink();

  return (
    <Section id="final-cta" variant="highlight" spacing="spacious" className="text-center">
      <Container size="narrow">
        {/* Section Heading */}
        <h2 className="text-display-lg sm:text-display-xl font-bold tracking-tight text-highlight-ink mb-4">
          {finalCta.heading}
        </h2>

        {/* Paragraph */}
        <p className="text-body-xl text-highlight-ink/85 max-w-2xl mx-auto leading-relaxed mb-8">
          {finalCta.paragraph}
        </p>

        {/* Two CTAs: DemoButton (primary black pill) + Chat on WhatsApp (secondary card pill) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <DemoButton
            variant="primary"
            size="lg"
            label={finalCta.primaryButton}
          />
          <Button href={whatsappUrl} external variant="secondary" size="lg">
            <img
              src="/icons/whatsappIcon.png"
              alt="WhatsApp"
              className="h-5 w-5 object-contain shrink-0"
            />
            <span>{finalCta.secondaryButton}</span>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
