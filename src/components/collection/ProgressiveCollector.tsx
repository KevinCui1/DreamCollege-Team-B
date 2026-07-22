import { useState } from "react";
import { ArrowRight, ChevronDown, Sparkle } from "lucide-react";
import {
  useStudentProfile,
  useProfileSnapshot,
} from "../../context/StudentProfileContext";
import {
  missingFieldsForTool,
  reusedFieldsForTool,
} from "../../profile/completeness";
import Button from "../ui/Button";
import SaveIndicator from "../ui/SaveIndicator";
import { cn } from "../ui/cn";
import FieldControl from "./FieldControl";
import ReusedFieldChip from "./ReusedFieldChip";

/**
 * Contextual, purpose-specific collection for a single tool. Shows only the
 * fields that would materially improve this tool and aren't already answered —
 * required ones up front, optional ones deferred behind a disclosure — while
 * acknowledging everything the student has already provided. When nothing
 * required is missing, the tool is "ready" and the student can proceed.
 */
export default function ProgressiveCollector({
  slug,
  toolLabel,
  onReady,
  readyCtaLabel,
}: {
  slug: string;
  toolLabel: string;
  onReady: () => void;
  readyCtaLabel?: string;
}) {
  const { answerField, updateApplicationProfile, saveState, retrySave } =
    useStudentProfile();
  const snapshot = useProfileSnapshot();
  const [showOptional, setShowOptional] = useState(false);

  const { required, useful } = missingFieldsForTool(slug, snapshot);
  const reused = reusedFieldsForTool(slug, snapshot);
  const ready = required.length === 0;

  const controlProps = {
    app: snapshot.app,
    quizTaken: snapshot.quiz !== null,
    onAnswer: answerField,
    onPatch: updateApplicationProfile,
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Already saved — never re-asked, always editable. */}
      {reused.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h3 className="font-body text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
            We'll reuse what you've already saved
          </h3>
          <div className="flex flex-col gap-2">
            {reused.map((field) => (
              <ReusedFieldChip
                key={field.id}
                field={field}
                snapshot={snapshot}
                onAnswer={answerField}
                onPatch={updateApplicationProfile}
              />
            ))}
          </div>
        </section>
      )}

      {/* Required-now fields. */}
      {required.length > 0 && (
        <section className="flex flex-col gap-5">
          <h3 className="font-serif text-lg font-semibold text-ink">
            To tailor {toolLabel}, add:
          </h3>
          {required.map(({ field }, i) => (
            <div key={field.id} className="animate-collect-in">
              <FieldControl {...controlProps} field={field} autoFocus={i === 0} />
            </div>
          ))}
        </section>
      )}

      {/* Optional boosts — deferred by default. */}
      {useful.length > 0 && (
        <section className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            aria-expanded={showOptional}
            className="flex items-center gap-2 self-start font-body text-sm font-semibold text-lavender-800"
          >
            <Sparkle size={15} />
            {showOptional ? "Hide" : "Add"} optional details that sharpen {toolLabel}
            <ChevronDown
              size={16}
              className={cn("transition-transform", showOptional && "rotate-180")}
            />
          </button>
          {showOptional && (
            <div className="flex flex-col gap-5 border-l-2 border-lavender-200 pl-4">
              {useful.map(({ field }) => (
                <FieldControl key={field.id} {...controlProps} field={field} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Footer: save state + proceed. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lavender-200 pt-5">
        <SaveIndicator state={saveState} onRetry={retrySave} />
        <Button
          variant="primary"
          onClick={onReady}
          disabled={!ready}
          title={ready ? undefined : "Add the fields above first"}
        >
          {readyCtaLabel ?? `Continue to ${toolLabel}`}
          <ArrowRight size={16} />
        </Button>
      </div>
      {!ready && (
        <p className="-mt-3 font-body text-xs text-ink-muted">
          Add the {required.length} field{required.length === 1 ? "" : "s"} above to
          continue. Optional details can wait.
        </p>
      )}
    </div>
  );
}
