// components/ui/form/form-select.tsx
import { forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, error, options, placeholder, className = "", id, ...props },
    ref
  ) => {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-1.5 font-sans">
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold tracking-tight text-ink-muted"
        >
          {label}
        </label>

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            className={[
              "w-full rounded-xl border bg-inset px-4 py-3 text-sm text-ink outline-none appearance-none transition-all duration-200 font-medium dynamic-select cursor-pointer",
              "focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light",
              error
                ? "border-danger focus:border-danger focus:ring-danger-light"
                : "border-line",
              className,
            ].join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-ink-subtle">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="text-ink font-medium"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Elegant Geometric Select Caret */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-subtle">
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
          <p className="text-xs font-medium text-danger animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
