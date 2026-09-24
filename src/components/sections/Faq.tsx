import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const faq = siteContent.faq;
  // Render ONLY items where published === true (0 unpublished items or placeholders in DOM)
  const publishedItems = faq.items.filter((item) => item.published);

  return (
    <Section id="faq" variant="default" spacing="spacious">
      <Container size="narrow">
        {/* Section Heading */}
        <SectionHeading
          heading={faq.heading}
          align="center"
        />

        {/* Clean, Flat Modern SaaS Accordion Container (Zero Shadow) */}
        <div className="max-w-3xl mx-auto bg-card border border-line rounded-2xl overflow-hidden divide-y divide-line/60">
          {publishedItems.map((item, idx) => (
            <details
              key={idx}
              className="group p-5 sm:p-6 transition-colors hover:bg-inset/40 group-open:bg-inset/20"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-lg">
                <span className="font-heading font-bold text-base sm:text-lg text-ink leading-snug">
                  {item.question}
                </span>
                <ChevronDown className="h-5 w-5 text-accent shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="mt-3 text-body-lg text-ink-muted leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
