import type { ProfileSnapshot } from "../../profile/schema";
import type { FieldDef } from "../../profile/fields";

/** A short human summary of an answered field, for reused-field chips. */
export function summarizeField(field: FieldDef, s: ProfileSnapshot): string {
  const app = s.app;
  switch (field.type) {
    case "quiz-link":
      return "Completed";
    case "sat":
      return app.sat.total ? `Total ${app.sat.total}` : "Added";
    case "act":
      return app.act.composite ? `Composite ${app.act.composite}` : "Added";
    case "exams": {
      const n = app.apSubjects.length + app.ibSubjects.length + app.aLevels.length;
      return `${n} course${n === 1 ? "" : "s"}`;
    }
    case "awards":
      return `${app.awards.length} award${app.awards.length === 1 ? "" : "s"}`;
    case "activities":
      return `${app.activities.length} activit${app.activities.length === 1 ? "y" : "ies"}`;
    case "multiselect": {
      const arr = (field.get?.(app) as string[]) ?? [];
      if (arr.length <= 2) return arr.join(", ");
      return `${arr.length} selected`;
    }
    default: {
      const v = (field.get?.(app) as string) ?? "";
      return v.length > 40 ? `${v.slice(0, 40)}…` : v;
    }
  }
}
