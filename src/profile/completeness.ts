/**
 * Central completeness logic. Because every flow reads these helpers, a field
 * answered in *any* collection surface is recognized as answered everywhere —
 * so no tool ever re-asks for information the student already gave.
 */
import type { ProfileSnapshot, Theme } from "./schema";
import { FIELDS, getField, type FieldDef } from "./fields";
import { requirementsForTool, type RequirementLevel } from "./requirements";

export function isFieldAnswered(snapshot: ProfileSnapshot, fieldId: string): boolean {
  const field = getField(fieldId);
  return field ? field.answered(snapshot) : false;
}

export type MissingField = { field: FieldDef; level: RequirementLevel };

/**
 * The smallest set of fields that would materially improve a tool, split by
 * urgency. Already-answered fields are excluded (never re-asked); the caller
 * acknowledges those separately via `reusedFieldsForTool`.
 */
export function missingFieldsForTool(
  slug: string | undefined,
  snapshot: ProfileSnapshot,
): { required: MissingField[]; useful: MissingField[] } {
  const required: MissingField[] = [];
  const useful: MissingField[] = [];
  for (const { fieldId, level } of requirementsForTool(slug)) {
    const field = getField(fieldId);
    if (!field || field.answered(snapshot)) continue;
    (level === "required-now" ? required : useful).push({ field, level });
  }
  return { required, useful };
}

/** Fields this tool relies on that the student has *already* provided. */
export function reusedFieldsForTool(
  slug: string | undefined,
  snapshot: ProfileSnapshot,
): FieldDef[] {
  const reused: FieldDef[] = [];
  for (const { fieldId } of requirementsForTool(slug)) {
    const field = getField(fieldId);
    if (field && field.answered(snapshot)) reused.push(field);
  }
  return reused;
}

/** True when nothing required-now is missing for this tool. */
export function toolReady(slug: string | undefined, snapshot: ProfileSnapshot): boolean {
  return missingFieldsForTool(slug, snapshot).required.length === 0;
}

/** Per-theme completion, for the review hub's section hints. */
export function themeCompletion(
  theme: Theme,
  snapshot: ProfileSnapshot,
): { answered: number; total: number } {
  const fields = FIELDS.filter((f) => f.theme === theme);
  const answered = fields.filter((f) => f.answered(snapshot)).length;
  return { answered, total: fields.length };
}

/** Overall answered/total across the whole registry. */
export function overallCompletion(snapshot: ProfileSnapshot): {
  answered: number;
  total: number;
} {
  const answered = FIELDS.filter((f) => f.answered(snapshot)).length;
  return { answered, total: FIELDS.length };
}
