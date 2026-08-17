"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption<T extends string | number = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface CustomSelectProps<T extends string | number = string> {
  options: CustomSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: React.ReactNode;
  labelPrefix?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect<T extends string | number = string>({
  options,
  value,
  onChange,
  icon,
  labelPrefix,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left font-sans select-none ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          "group flex items-center justify-between gap-2.5 rounded-lg border bg-inset px-3 py-1.5 text-xs font-bold transition-all duration-200 outline-none cursor-pointer",
          isOpen
            ? "border-accent bg-card ring-2 ring-accent/20 text-ink shadow-xs"
            : "border-line/60 hover:border-line hover:bg-card text-ink",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <span className="shrink-0 text-accent">{icon}</span>}
          {labelPrefix && (
            <span className="text-ink-subtle font-semibold shrink-0">
              {labelPrefix}
            </span>
          )}
          <span className="truncate text-ink">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={[
            "h-3.5 w-3.5 shrink-0 text-ink-subtle transition-transform duration-200 ease-out",
            isOpen ? "rotate-180 text-accent" : "group-hover:text-ink",
          ].join(" ")}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1.5 z-50 min-w-[180px] max-h-60 overflow-y-auto rounded-xl border border-line bg-card p-1 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150 space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;

            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={[
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 text-left cursor-pointer",
                  isSelected
                    ? "bg-accent/10 text-accent font-bold"
                    : "text-ink hover:bg-inset hover:text-ink",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {opt.icon && (
                    <span
                      className={
                        isSelected ? "text-accent" : "text-ink-subtle"
                      }
                    >
                      {opt.icon}
                    </span>
                  )}
                  <div>
                    <span className="block truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="block text-[10px] font-normal text-ink-subtle truncate">
                        {opt.description}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-accent shrink-0 stroke-[2.5px]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
