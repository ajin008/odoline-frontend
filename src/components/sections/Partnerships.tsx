import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import { SectionHeading } from "@/src/components/ui/section-heading";
import { Eye, PenLine } from "lucide-react";

export function Partnerships() {
  const partnerships = siteContent.partnerships;
  const labels = partnerships.visualLabels;

  // One primary owner + three view-only partners (the 4-login limit)
  const seats = [
    { initial: "A", name: labels.primary, access: labels.fullAccess, isPrimary: true },
    { initial: "B", name: `${labels.partner} 2`, access: labels.viewOnly, isPrimary: false },
    { initial: "C", name: `${labels.partner} 3`, access: labels.viewOnly, isPrimary: false },
    { initial: "D", name: `${labels.partner} 4`, access: labels.viewOnly, isPrimary: false },
  ];

  return (
    <Section id="partners" variant="inset" spacing="spacious">
      <Container size="default">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              index="04"
              eyebrow={siteContent.sectionLabels.partnerships}
              heading={partnerships.heading}
              description={partnerships.paragraph}
              align="left"
              className="mb-10 md:mb-12"
            />

            <p className="border-l-2 border-accent pl-5 font-heading text-xl font-bold leading-snug tracking-[-0.015em] text-ink text-pretty md:text-2xl">
              {partnerships.highlight}
            </p>

            <ul className="mt-10 border-t border-line">
              {partnerships.points.map((point, idx) => (
                <li
                  key={point}
                  className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-5 text-[15px] leading-relaxed text-ink-muted"
                >
                  <span className="pt-0.5 font-mono text-[11px] text-ink-subtle">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Access model illustration */}
          <div aria-hidden="true" className="lg:col-span-5 lg:col-start-8 lg:self-center">
            <div className="rounded-[1.75rem] border border-line bg-canvas p-1.5 shadow-float sm:p-2">
              <div className="rounded-[1.35rem] border border-line bg-card">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
                    {labels.title}
                  </span>
                  <span className="font-mono text-[11px] text-ink-subtle">4 / 4</span>
                </div>
                <ul className="divide-y divide-line">
                  {seats.map((seat) => (
                    <li key={seat.initial} className="flex items-center justify-between gap-4 px-6 py-5">
                      <div className="flex min-w-0 items-center gap-4">
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-full font-heading text-sm font-bold ${
                            seat.isPrimary
                              ? "bg-accent text-inverse"
                              : "border border-line bg-inset text-ink-muted"
                          }`}
                        >
                          {seat.initial}
                        </span>
                        <span className="truncate text-[15px] font-semibold text-ink">
                          {seat.name}
                        </span>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          seat.isPrimary
                            ? "bg-accent-light text-accent"
                            : "bg-inset text-ink-muted"
                        }`}
                      >
                        {seat.isPrimary ? (
                          <PenLine className="size-3" />
                        ) : (
                          <Eye className="size-3" />
                        )}
                        {seat.access}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
