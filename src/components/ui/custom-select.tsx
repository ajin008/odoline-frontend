/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

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
  buttonClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function CustomSelect<T extends string | number = string>({
  options,
  value,
  onChange,
  icon,
  labelPrefix,
  placeholder = "Select an option",
  className = "",
  buttonClassName = "",
  disabled = false,
  searchable,
  searchPlaceholder = "Search...",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const showSearch = searchable !== undefined ? searchable : options.length > 5;

  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const labelMatch = opt.label.toLowerCase().includes(query);
    const descMatch = opt.description?.toLowerCase().includes(query);
    return labelMatch || descMatch;
  });

  // Reset search on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

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
          "group flex items-center justify-between gap-2.5 rounded-xl border bg-surface px-3 h-8.5 text-xs font-semibold transition-all duration-200 outline-none cursor-pointer w-full",
          isOpen
            ? "border-accent bg-card ring-2 ring-accent/20 text-ink shadow-xs"
            : "border-line/60 hover:border-line hover:bg-card text-ink",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          buttonClassName,
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <span className="shrink-0 text-accent">{icon}</span>}
          {labelPrefix && (
            <span className="text-ink-subtle font-semibold shrink-0">
              {labelPrefix}
            </span>
          )}
          <span
            className={`truncate ${
              selectedOption
                ? "text-ink font-bold"
                : "text-ink-subtle font-normal"
            }`}
          >
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
          className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[200px] max-h-60 overflow-y-auto rounded-xl border border-line bg-card p-1 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150 space-y-0.5"
        >
          {showSearch && (
            <div className="p-1 border-b border-line/60 sticky top-0 bg-card z-10">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-ink-subtle" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-inset border border-line/60 rounded-lg text-ink focus:border-accent focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 text-center text-xs text-ink-subtle font-medium">
              No matching options
            </div>
          ) : (
            filteredOptions.map((opt) => {
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
                    <div className="min-w-0">
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
            })
          )}
        </div>
      )}
    </div>
  );
}
