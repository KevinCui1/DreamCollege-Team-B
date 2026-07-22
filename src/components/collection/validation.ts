import type { FieldDef } from "../../profile/fields";

/** Lightweight, student-friendly validation. Returns an error string or null. */
export function validateScalar(field: FieldDef, raw: string): string | null {
  const value = raw.trim();
  if (value === "") return null; // emptiness is handled by required/optional logic

  const num = Number(value);
  const isNum = value !== "" && !Number.isNaN(num);

  switch (field.id) {
    case "graduatingClassSize":
      if (!isNum || num <= 0 || !Number.isInteger(num))
        return "Enter a whole number, like 400.";
      return null;
    case "unweightedGpa":
      if (!isNum || num < 0 || num > 100) return "Enter your GPA as a number.";
      return null;
    case "weightedGpa":
      if (!isNum || num < 0 || num > 100) return "Enter your GPA as a number.";
      return null;
    default:
      if (field.type === "number" && !isNum) return "Enter a number.";
      return null;
  }
}

/** Score-field bounds for the SAT/ACT composite editors. */
export function scoreError(value: string, min: number, max: number): string | null {
  const v = value.trim();
  if (v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n) || n < min || n > max) return `${min}–${max}`;
  return null;
}
