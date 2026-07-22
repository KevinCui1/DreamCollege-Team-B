import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../ui/cn";

/** Shared setup input shell — white surface, lavender border, vivid-purple focus. */
export const inputClass =
  "w-full rounded-xl border border-lavender-200 bg-white px-3.5 py-2.5 font-body text-[15px] text-ink " +
  "outline-none transition-colors placeholder:text-ink-soft " +
  "focus:border-lavender-600 focus:ring-2 focus:ring-lavender-200 " +
  "aria-[invalid=true]:border-oxblood aria-[invalid=true]:focus:ring-oxblood/20";

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline gap-2 font-body text-sm font-semibold text-ink"
    >
      {children}
      {optional ? (
        <span className="font-normal text-ink-soft">optional</span>
      ) : null}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="font-body text-xs text-oxblood">
      {message}
    </p>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  suffix,
  invalid,
  describedBy,
  autoFocus,
  inputMode,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  suffix?: string;
  invalid?: boolean;
  describedBy?: string;
  autoFocus?: boolean;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(inputClass, "min-h-[44px]")}
      />
      {suffix ? (
        <span className="shrink-0 font-body text-xs text-ink-muted">{suffix}</span>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  describedBy?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={describedBy}
        rows={3}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className={cn(inputClass, "resize-y")}
      />
      {maxLength ? (
        <span className="self-end font-body text-[11px] tabular-nums text-ink-soft">
          {value.length}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select…",
  invalid,
  describedBy,
  autoFocus,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  options: string[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  autoFocus?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={cn(inputClass, "min-h-[44px] appearance-none bg-[right_0.75rem_center] bg-no-repeat pr-9")}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B5E92' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/** Multi-select as an accessible checkbox group storing option labels. */
export function CheckboxGroup({
  legend,
  options,
  values,
  onToggle,
}: {
  legend: string;
  options: string[];
  values: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label
              key={opt}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2",
                "font-body text-sm transition-colors",
                checked
                  ? "border-lavender-600 bg-lavender-100 text-ink"
                  : "border-lavender-200 bg-white text-ink-muted hover:border-lavender-400 hover:bg-lavender-50",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  checked ? "border-lavender-700 bg-lavender-700 text-white" : "border-lavender-300",
                )}
              >
                {checked ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
