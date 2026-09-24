/* eslint-disable security/detect-object-injection */
import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  as: Component = "div",
  children,
  className = "",
  size = "default",
  ...props
}: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-8xl",
  };

  return (
    <Component
      className={`${sizeClasses[size]} mx-auto px-5 sm:px-8 md:px-12 lg:px-12 xl:px-10 ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
