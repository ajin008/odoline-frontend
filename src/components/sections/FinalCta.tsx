import * as React from "react";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Button } from "@/src/components/ui/button";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { JourneyLine } from "@/src/components/ui/journey-line";

export function FinalCta() {
  const finalCta = siteContent.finalCta;
  const whatsappUrl = buildWhatsAppLink();

  return (
    <section id="final-cta" className="scroll-mt-24 bg-canvas pb-6 sm:pb-8">
      <Container size="wide" className="px-3 sm:px-5 md:px-8 lg:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-footer-line bg-footer px-6 py-16 text-footer-ink sm:px-12 md:py-24 lg:px-20 lg:py-28">
          <div className="relative grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-footer-muted">
                {finalCta.eyebrow}
              </div>
              <h2 className="font-heading text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
                {finalCta.heading}
              </h2>
              <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-footer-muted">
                {finalCta.paragraph}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <DemoButton variant="onDark" size="lg" label={finalCta.primaryButton} />
                <Button href={whatsappUrl} external variant="onDarkSecondary" size="lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/whatsappIcon.png"
                    alt=""
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                  <span>{finalCta.secondaryButton}</span>
                </Button>
              </div>
            </div>

            <JourneyLine className="hidden w-full lg:col-span-5 lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
