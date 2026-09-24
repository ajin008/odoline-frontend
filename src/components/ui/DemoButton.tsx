"use client";

import * as React from "react";
import { siteContent } from "@/src/content/site";
import { Button, ButtonProps } from "@/src/components/ui/button";
import { BookDemoModal } from "@/src/components/ui/book-demo-modal";

export interface DemoButtonProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  label?: string;
  className?: string;
  onClick?: () => void;
}

export function DemoButton({
  variant = "primary",
  size = "md",
  label,
  className = "",
  onClick,
}: DemoButtonProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const buttonText = label || siteContent.hero.primaryButton;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {buttonText}
      </Button>

      <BookDemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
