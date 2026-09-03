/* eslint-disable security/detect-object-injection */
import React from "react";

export type BadgeVariant =
  | "warning"
  | "success"
  | "danger"
  | "neutral"
  | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const BADGE_VARIANT_STYLES: Record<BadgeVariant, string> = {
  warning: "bg-warning-light text-warning border-warning/20",
  success: "bg-success-light text-success border-success/20",
  danger: "bg-danger-light text-danger border-danger/20",
  neutral: "bg-neutral-state-light text-neutral-state border-neutral-state/20",
  info: "bg-accent-light text-accent border-accent/20",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
  title,
  ...props
}: BadgeProps) {
  return (
    <div
      title={title}
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-tight border backdrop-blur-xs select-none shrink-0",
        BADGE_VARIANT_STYLES[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
