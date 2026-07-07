import { type ReactNode } from "react";
import { Check } from "lucide-react";

/**
 * Shared, presentational form primitives for the College Profile wizard.
 * Styling matches the wizard screenshots and reuses the app's control tokens
 * (rounded-xl, lavender focus ring). Every input is controlled.
 */

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100";

/** A label with an optional red required asterisk. */
export function FieldLabel({
  children,
  required,
  className = "",
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`mb-2 block text-base font-semibold text-slate-700 ${className}`}>
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  onChange,
  required,
  type = "text",
  suffix,
  className = "",
}: {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  /** Grey text shown inside the field on the right, e.g. "out of 800". */
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClasses} ${suffix ? "pr-24" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
  required,
  rows = 3,
  maxLength,
  className = "",
}: {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {(label || maxLength) && (
        <div className="mb-2 flex items-end justify-between">
          {label ? <FieldLabel required={required}>{label}</FieldLabel> : <span />}
          {maxLength != null && (
            <span className="text-xs text-slate-400">
              {value.length}/{maxLength} chars
            </span>
          )}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) =>
          onChange(
            maxLength != null ? e.target.value.slice(0, maxLength) : e.target.value,
          )
        }
        placeholder={placeholder}
        rows={rows}
        className={`${inputClasses} resize-y`}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  required,
  placeholder = "Select",
  className = "",
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClasses} appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>\")",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/** A single checkbox row used across the Preference step's groups. */
export function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-slate-700">
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-[5px] border transition ${
          checked
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-slate-300 bg-white"
        }`}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-base leading-6">{label}</span>
    </label>
  );
}

/**
 * A checkbox group bound to a string[] in the profile. Toggling an option
 * adds/removes its label from the array.
 */
export function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (label: string, checked: boolean) => {
    onChange(
      checked ? [...selected, label] : selected.filter((v) => v !== label),
    );
  };
  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <CheckboxOption
          key={opt}
          label={opt}
          checked={selected.includes(opt)}
          onChange={(checked) => toggle(opt, checked)}
        />
      ))}
    </div>
  );
}
