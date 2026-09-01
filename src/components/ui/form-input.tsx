/* eslint-disable security/detect-object-injection */
// components/ui/form/form-input.tsx
"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefix?: string;
  /**
   * Suggested values shown as a custom theme-aware popover dropdown menu.
   * Unlike a rigid <select>, the user can still type any custom text.
   */
  suggestions?: string[];
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      prefix,
      suggestions,
      className = "",
      id,
      onChange,
      onFocus,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? props.name;
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const currentValue = String(props.value ?? "");

    // Filter suggestions based on current input text
    const filteredSuggestions = suggestions
      ? suggestions.filter((item) =>
          item.toLowerCase().includes(currentValue.toLowerCase().trim())
        )
      : [];

    // Click outside listener to close custom dropdown
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

    const handleSelectSuggestion = (suggestion: string) => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: suggestion, name: props.name },
          currentTarget: { value: suggestion, name: props.name },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions || filteredSuggestions.length === 0) {
        if (props.onKeyDown) props.onKeyDown(e);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
      } else if (e.key === "Enter" && isOpen && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    return (
      <div ref={containerRef} className="relative space-y-1.5 font-sans">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-tight text-ink-muted"
        >
          {label}
        </label>

        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-subtle pointer-events-none select-none">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            autoComplete="off"
            className={[
              "w-full rounded-lg border bg-inset px-4 py-3 text-sm text-ink outline-none transition-all duration-200 font-medium placeholder:text-ink-subtle/70",
              "focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light",
              error
                ? "border-danger focus:border-danger focus:ring-danger-light"
                : "border-line",
              prefix ? "pl-12" : "",
              suggestions ? "pr-10" : "",
              className,
            ].join(" ")}
            onChange={(e) => {
              if (onChange) onChange(e);
              setIsOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={(e) => {
              if (onFocus) onFocus(e);
              if (suggestions && suggestions.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            {...props}
          />

          {suggestions && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsOpen((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors p-1 rounded cursor-pointer"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Custom Theme-Aware Dropdown Popover */}
        {suggestions && isOpen && (
          <div
            role="listbox"
            className="absolute left-0 top-full mt-1.5 z-50 w-full max-h-60 overflow-y-auto rounded-xl border border-line bg-card p-1.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 space-y-0.5"
          >
            {filteredSuggestions.length === 0 ? (
              <div className="px-3.5 py-2.5 text-xs text-ink-subtle italic">
                No matching options. Type custom text.
              </div>
            ) : (
              filteredSuggestions.map((item, index) => {
                const isSelected =
                  currentValue.toLowerCase().trim() ===
                  item.toLowerCase().trim();
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(item);
                    }}
                    className={[
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer",
                      isSelected
                        ? "bg-accent/10 text-accent font-extrabold"
                        : isHighlighted
                        ? "bg-inset text-ink"
                        : "text-ink hover:bg-inset hover:text-ink",
                    ].join(" ")}
                  >
                    <span>{item}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent stroke-[2.5px]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}

        {error && (
          <p className="text-xs font-medium text-danger animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
