/* eslint-disable security/detect-object-injection */
import * as React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  variant?: "default" | "band";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "center",
  variant = "default",
  className = "",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left max-w-2xl",
    center: "text-center max-w-3xl mx-auto",
  };

  const isBand = variant === "band";

  return (
    <div className={`space-y-3 mb-12 md:mb-16 ${alignmentClasses[align]} ${className}`.trim()}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-mono font-semibold uppercase tracking-wider ${
            isBand ? "text-accent" : "text-accent"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-display-lg font-bold tracking-tight ${
          isBand ? "text-band-ink" : "text-ink"
        }`}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={`text-body-lg ${
            isBand ? "text-band-muted" : "text-ink-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
