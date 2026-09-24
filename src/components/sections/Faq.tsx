import * as React from "react";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { ArrowUpRight, Plus } from "lucide-react";

export function Faq() {
  const faq = siteContent.faq;
  // Render ONLY items where published === true (0 unpublished items or placeholders in DOM)
  const publishedItems = faq.items.filter((item) => item.published);

  return (
    <Section id="faq" variant="default" spacing="spacious">
      <Container size="default">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              index="09"
              eyebrow={siteContent.sectionLabels.faq}
              heading={faq.heading}
              description={faq.intro}
              align="left"
              className="mb-6 md:mb-8"
            />
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-md text-[15px] font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-accent"
            >
              {siteContent.hero.secondaryButton}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="border-t border-line lg:col-span-8">
            {publishedItems.map((item) => (
              <details key={item.question} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-6 [&::-webkit-details-marker]:hidden md:py-7">
                  <span className="font-heading text-lg font-bold tracking-[-0.01em] text-ink md:text-xl">
                    {item.question}
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-cta group-open:text-cta-ink group-open:border-transparent">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-14 text-[15px] leading-relaxed text-ink-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
