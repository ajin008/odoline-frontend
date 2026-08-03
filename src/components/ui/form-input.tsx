// components/ui/form/form-input.tsx
import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefix?: string;
  /**
   * Suggested values shown as a native browser autocomplete dropdown, via
   * <datalist> — unlike a <select>, the user can still type anything else.
   * Use for "pick a common one, or type your own" fields.
   */
  suggestions?: string[];
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, prefix, suggestions, className = "", id, ...props },
    ref
  ) => {
    const inputId = id ?? props.name;
    const datalistId = suggestions ? `${inputId}-suggestions` : undefined;

    return (
      <div className="space-y-1.5 font-sans">
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
            list={datalistId}
            className={[
              "w-full rounded-lg border bg-inset px-4 py-3 text-sm text-ink outline-none transition-all duration-200 font-medium placeholder:text-ink-subtle/70",
              "focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light",
              error
                ? "border-danger focus:border-danger focus:ring-danger-light"
                : "border-line",
              prefix ? "pl-12" : "",
              className,
            ].join(" ")}
            {...props}
          />
          {suggestions && (
            <datalist id={datalistId}>
              {suggestions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          )}
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

FormInput.displayName = "FormInput";
