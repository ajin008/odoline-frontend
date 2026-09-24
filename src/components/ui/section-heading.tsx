/* eslint-disable security/detect-object-injection */
import * as React from "react";

export interface SectionHeadingProps {
  /** Two-digit section number shown before the eyebrow, e.g. "02" */
  index?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  /** "split" puts the description beside the heading on large screens */
  align?: "left" | "center" | "split";
  variant?: "default" | "band" | "dark";
  className?: string;
}

const TONES = {
  default: { eyebrow: "text-ink-subtle", rule: "bg-line", heading: "text-ink", body: "text-ink-muted" },
  band: { eyebrow: "text-band-muted", rule: "bg-band-line", heading: "text-band-ink", body: "text-band-muted" },
  dark: { eyebrow: "text-footer-muted", rule: "bg-footer-line", heading: "text-footer-ink", body: "text-footer-muted" },
};

export function SectionHeading({
  index,
  eyebrow,
  heading,
  description,
  align = "split",
  variant = "default",
  className = "",
}: SectionHeadingProps) {
  const tone = TONES[variant];
  const centered = align === "center";
  const split = align === "split";

  return (
    <div
      className={`mb-12 md:mb-20 ${
        split
          ? "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12"
          : centered
            ? "mx-auto max-w-3xl text-center"
            : "max-w-2xl"
      } ${className}`.trim()}
    >
      <div className={split ? "lg:col-span-7" : ""}>
        {(index || eyebrow) && (
          <div
            className={`mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] ${tone.eyebrow} ${
              centered ? "justify-center" : ""
            }`}
          >
            {index && <span>{index}</span>}
            {index && eyebrow && (
              <span aria-hidden="true" className={`h-px w-8 ${tone.rule}`} />
            )}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}
        <h2
          className={`text-display-lg font-extrabold tracking-[-0.03em] text-balance ${tone.heading}`}
        >
          {heading}
        </h2>
      </div>
      {description && (
        <p
          className={`text-body-lg leading-relaxed text-pretty ${tone.body} ${
            split ? "lg:col-span-5 lg:pb-1.5" : "mt-5"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
