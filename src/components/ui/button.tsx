/* eslint-disable security/detect-object-injection */
import * as React from "react";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "onDark" | "onDarkSecondary";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer active:scale-[0.98] rounded-full";

    const variantStyles = {
      primary:
        "bg-cta text-cta-ink hover:bg-cta-hover shadow-sm border border-transparent",
      secondary:
        "bg-card text-ink border border-line hover:bg-inset hover:border-line-focus shadow-2xs",
      ghost:
        "bg-transparent text-ink hover:bg-inset border border-transparent",
      onDark:
        "bg-footer-ink text-footer hover:opacity-90 border border-transparent",
      onDarkSecondary:
        "bg-transparent text-footer-ink border border-footer-line hover:bg-footer-line",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5 font-semibold",
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
      disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
    } ${className}`.trim();

    if (href) {
      const isExternal =
        external || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("wa.me");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
            ref={ref as React.Ref<HTMLAnchorElement>}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className={combinedClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        disabled={disabled}
        className={combinedClasses}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
