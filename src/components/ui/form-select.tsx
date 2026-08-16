// components/ui/form-select.tsx
import { forwardRef } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, options, placeholder, icon, className = "", id, ...props },
    ref
  ) => {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-ink-muted"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
              {icon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            className={[
              "w-full rounded-lg border bg-inset px-3.5 py-2.5 text-xs text-ink outline-none appearance-none transition-all duration-200 font-bold cursor-pointer",
              icon ? "pl-9" : "pl-3.5",
              "pr-10 focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20",
              error ? "border-rose-500 text-rose-600" : "border-line",
              className,
            ].join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-ink-subtle">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value}
                className="text-ink font-semibold bg-card"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Caret */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-subtle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-[11px] font-semibold text-rose-500 animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
