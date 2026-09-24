import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";

export function Problem() {
  const problem = siteContent.problem;

  return (
    <Section id="problem" variant="default" spacing="spacious" className="border-t border-line">
      <Container size="default">
        <SectionHeading
          index="01"
          eyebrow={siteContent.sectionLabels.problem}
          heading={problem.heading}
          description={problem.intro}
        />

        <ol className="border-b border-line">
          {problem.painPoints.map((point, idx) => (
            <li
              key={point}
              className="group grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 sm:grid-cols-[4rem_1fr] md:py-9 lg:grid-cols-[4rem_1fr_12rem]"
            >
              <span className="pt-1.5 font-mono text-xs text-ink-subtle transition-colors group-hover:text-accent">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="max-w-3xl font-heading text-xl font-bold leading-snug tracking-[-0.015em] text-ink text-pretty sm:text-2xl md:text-[1.75rem]">
                {point}
              </p>
              <span
                aria-hidden="true"
                className="hidden self-center justify-self-end lg:block"
              >
                <span className="block h-px w-0 bg-accent transition-[width] duration-500 group-hover:w-32" />
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-3xl font-heading text-2xl font-bold leading-snug tracking-[-0.02em] text-ink text-balance md:mt-16 md:text-4xl">
          <span className="text-ink-subtle">{problem.closingLine.split(". ")[0]}.</span>{" "}
          {problem.closingLine.split(". ").slice(1).join(". ")}
        </p>
      </Container>
    </Section>
  );
}
