import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import type { ApplicationProfile } from "../../context/StudentProfileContext";
import type { ProfileSnapshot } from "../../profile/schema";
import type { FieldDef } from "../../profile/fields";
import { summarizeField } from "./summarize";
import FieldControl from "./FieldControl";

/**
 * Acknowledges a field the student already provided — never re-asked, always
 * correctable. Clicking "Edit" reveals the same registry-driven control inline.
 */
export default function ReusedFieldChip({
  field,
  snapshot,
  onAnswer,
  onPatch,
}: {
  field: FieldDef;
  snapshot: ProfileSnapshot;
  onAnswer: (fieldId: string, value: string | string[]) => void;
  onPatch: (patch: Partial<ApplicationProfile>) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-xl border border-lavender-200 bg-white p-4">
        <FieldControl
          field={field}
          app={snapshot.app}
          quizTaken={snapshot.quiz !== null}
          onAnswer={onAnswer}
          onPatch={onPatch}
          showReason={false}
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-3 font-body text-xs font-semibold text-lavender-800 hover:underline"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-lavender-50 px-3.5 py-2.5">
      <span className="flex min-w-0 items-center gap-2 font-body text-sm text-ink">
        <Check size={15} className="shrink-0 text-lavender-700" strokeWidth={2.5} />
        <span className="truncate">
          <span className="text-ink-muted">{field.label}:</span>{" "}
          {summarizeField(field, snapshot)}
        </span>
      </span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex shrink-0 items-center gap-1 rounded font-body text-xs font-semibold text-lavender-800 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-lavender-500"
      >
        <Pencil size={13} /> Edit
      </button>
    </div>
  );
}
