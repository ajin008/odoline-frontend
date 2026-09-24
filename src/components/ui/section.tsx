/* eslint-disable security/detect-object-injection */
import * as React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  variant?: "default" | "inset" | "band" | "card" | "highlight";
  children: React.ReactNode;
  className?: string;
  spacing?: "default" | "compact" | "spacious";
}

export function Section({
  id,
  variant = "default",
  children,
  className = "",
  spacing = "default",
  ...props
}: SectionProps) {
  const variantClasses = {
    default: "bg-canvas text-ink",
    inset: "bg-inset text-ink border-y border-line",
    card: "bg-card text-ink",
    band: "bg-band text-band-ink",
    highlight: "bg-highlight text-highlight-ink",
  };

  const spacingClasses = {
    compact: "py-10 md:py-16",
    default: "py-16 md:py-24",
    spacious: "py-20 md:py-32",
  };

  return (
    <section
      id={id}
      className={`scroll-mt-20 md:scroll-mt-24 ${variantClasses[variant]} ${spacingClasses[spacing]} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}
