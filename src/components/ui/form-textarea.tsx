// components/ui/form/form-textarea.tsx
import { forwardRef } from "react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="space-y-1.5 font-sans">
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold tracking-tight text-ink-muted"
        >
          {label}
        </label>

        <textarea
          id={textareaId}
          ref={ref}
          rows={3}
          aria-invalid={!!error}
          className={[
            "w-full resize-none rounded-xl border bg-inset px-4 py-3 text-sm text-ink outline-none transition-all duration-200 font-medium placeholder:text-ink-subtle/70",
            "focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light",
            error
              ? "border-danger focus:border-danger focus:ring-danger-light"
              : "border-line",
            className,
          ].join(" ")}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-danger animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
