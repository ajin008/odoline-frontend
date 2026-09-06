import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ClipboardPaste, Check } from "lucide-react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  showPasteButton?: boolean;
  autoResize?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showPasteButton = true,
      autoResize = true,
      className = "",
      id,
      onChange,
      onInput,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? props.name;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const [pastedSuccess, setPastedSuccess] = useState(false);
    const [stats, setStats] = useState({ lines: 0, chars: 0 });

    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const adjustHeight = useCallback(() => {
      if (!autoResize) return;
      const el = internalRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.max(96, el.scrollHeight + 2)}px`;
    }, [autoResize]);

    const updateStats = useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      const val = el.value || "";
      const chars = val.length;
      const lines = val ? val.split("\n").length : 0;
      setStats({ lines, chars });
    }, []);

    useEffect(() => {
      adjustHeight();
      updateStats();
    }, [value, defaultValue, adjustHeight, updateStats]);

    useEffect(() => {
      adjustHeight();
      window.addEventListener("resize", adjustHeight);
      return () => window.removeEventListener("resize", adjustHeight);
    }, [adjustHeight]);

    const handlePasteClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && internalRef.current) {
          const el = internalRef.current;
          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          )?.set;

          if (nativeSetter) {
            nativeSetter.call(el, text);
          } else {
            el.value = text;
          }

          const event = new Event("input", { bubbles: true });
          el.dispatchEvent(event);

          adjustHeight();
          updateStats();
          setPastedSuccess(true);
          setTimeout(() => setPastedSuccess(false), 2000);
        }
      } catch {
        internalRef.current?.focus();
      }
    };

    return (
      <div className="space-y-1.5 font-sans">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold tracking-tight text-ink-muted"
          >
            {label}
          </label>

          <div className="flex items-center gap-2">
            {stats.lines > 1 && (
              <span className="text-[11px] font-medium text-ink-subtle bg-inset px-2 py-0.5 rounded border border-line">
                {stats.lines} lines • {stats.chars} chars
              </span>
            )}

            {showPasteButton && (
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:text-accent-dark hover:bg-accent/10 px-2 py-0.5 rounded transition-colors cursor-pointer"
                title="Paste multi-line text from WhatsApp or clipboard"
              >
                {pastedSuccess ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">Pasted!</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="h-3 w-3" />
                    <span>Paste text</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <textarea
          id={textareaId}
          ref={internalRef}
          rows={3}
          aria-invalid={!!error}
          onInput={(e) => {
            adjustHeight();
            updateStats();
            onInput?.(e);
          }}
          onChange={(e) => {
            adjustHeight();
            updateStats();
            onChange?.(e);
          }}
          className={[
            "w-full min-h-[96px] resize-y rounded-lg border bg-inset px-4 py-3 text-sm text-ink leading-relaxed outline-none transition-all duration-150 font-medium placeholder:text-ink-subtle/70 overflow-hidden focus:overflow-y-auto",
            "focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-light",
            error
              ? "border-danger focus:border-danger focus:ring-danger-light"
              : "border-line",
            className,
          ].join(" ")}
          {...props}
        />

        {helperText && !error && (
          <p className="text-xs text-ink-subtle font-normal">{helperText}</p>
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

FormTextarea.displayName = "FormTextarea";

