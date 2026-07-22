import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ApplicationProfile } from "../../context/StudentProfileContext";
import type { FieldDef } from "../../profile/fields";
import { Label, TextInput, TextArea, Select, CheckboxGroup, FieldError } from "./inputs";
import { SatEditor, ActEditor, ExamsEditor, AwardsEditor, ActivitiesEditor } from "./composite";
import { validateScalar } from "./validation";
import { ReasonNote } from "../ui/Card";

type Props = {
  field: FieldDef;
  app: ApplicationProfile;
  quizTaken: boolean;
  /** answerField — scalar/multiselect fields. */
  onAnswer: (fieldId: string, value: string | string[]) => void;
  /** updateApplicationProfile — composite fields. */
  onPatch: (patch: Partial<ApplicationProfile>) => void;
  autoFocus?: boolean;
  /** Show the reason-for-asking note (collectors show it; the hub may not). */
  showReason?: boolean;
};

/**
 * Registry-driven control. One component renders every field type, so no page
 * writes its own inputs. Composite types delegate to bespoke editors.
 */
export default function FieldControl({
  field,
  app,
  quizTaken,
  onAnswer,
  onPatch,
  autoFocus,
  showReason = true,
}: Props) {
  const [touched, setTouched] = useState(false);
  const errId = `${field.id}-error`;
  const descId = `${field.id}-reason`;

  const header = (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field.id} optional={field.optional}>
        {field.label}
      </Label>
      {showReason ? <ReasonNote id={descId}>{field.reason}</ReasonNote> : null}
    </div>
  );

  // Composite editors ---------------------------------------------------------
  if (field.type === "sat")
    return <div className="flex flex-col gap-2.5">{header}<SatEditor app={app} onPatch={onPatch} /></div>;
  if (field.type === "act")
    return <div className="flex flex-col gap-2.5">{header}<ActEditor app={app} onPatch={onPatch} /></div>;
  if (field.type === "exams")
    return <div className="flex flex-col gap-2.5">{header}<ExamsEditor app={app} onPatch={onPatch} /></div>;
  if (field.type === "awards")
    return <div className="flex flex-col gap-2.5">{header}<AwardsEditor app={app} onPatch={onPatch} /></div>;
  if (field.type === "activities")
    return <div className="flex flex-col gap-2.5">{header}<ActivitiesEditor app={app} onPatch={onPatch} /></div>;

  // Quiz link -----------------------------------------------------------------
  if (field.type === "quiz-link") {
    return (
      <div className="flex flex-col gap-2.5">
        {header}
        {quizTaken ? (
          <span className="inline-flex items-center gap-2 font-body text-sm text-sage">
            <CheckCircle2 size={16} /> You've completed the quiz.
          </span>
        ) : (
          <Link
            to="/career-planning/career-discovery-quiz"
            className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-xl bg-marigold-700 px-4 py-2.5 font-body text-sm font-semibold text-white outline-none hover:bg-marigold-800 focus-visible:ring-2 focus-visible:ring-marigold-700 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Take the 5-question quiz <ArrowRight size={16} />
          </Link>
        )}
      </div>
    );
  }

  // Scalar / select / multiselect --------------------------------------------
  const value = field.get ? field.get(app) : "";

  if (field.type === "multiselect" && Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-2.5">
        {header}
        <CheckboxGroup
          legend={field.label}
          options={field.options ?? []}
          values={value}
          onToggle={(opt) => {
            const next = value.includes(opt)
              ? value.filter((v) => v !== opt)
              : [...value, opt];
            onAnswer(field.id, next);
          }}
        />
      </div>
    );
  }

  const strValue = typeof value === "string" ? value : "";
  const error = touched ? validateScalar(field, strValue) : null;

  return (
    <div className="flex flex-col gap-2.5">
      {header}
      {field.type === "textarea" ? (
        <TextArea
          id={field.id}
          value={strValue}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          describedBy={showReason ? descId : undefined}
          onChange={(v) => onAnswer(field.id, v)}
        />
      ) : field.type === "select" ? (
        <Select
          id={field.id}
          value={strValue}
          options={field.options ?? []}
          autoFocus={autoFocus}
          invalid={Boolean(error)}
          describedBy={error ? errId : undefined}
          onChange={(v) => onAnswer(field.id, v)}
          onBlur={() => setTouched(true)}
        />
      ) : (
        <TextInput
          id={field.id}
          value={strValue}
          type="text"
          inputMode={field.type === "number" ? "numeric" : "text"}
          placeholder={field.placeholder}
          suffix={field.suffix}
          autoFocus={autoFocus}
          invalid={Boolean(error)}
          describedBy={error ? errId : showReason ? descId : undefined}
          onChange={(v) => onAnswer(field.id, v)}
          onBlur={() => setTouched(true)}
        />
      )}
      <FieldError id={errId} message={error} />
    </div>
  );
}
