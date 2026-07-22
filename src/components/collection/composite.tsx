import { Plus, Trash2 } from "lucide-react";
import type {
  ApplicationProfile,
  AwardEntry,
  ActivityEntry,
  ExamEntry,
} from "../../context/StudentProfileContext";
import {
  EXAM_TYPES,
  AP_SUBJECTS,
  AP_SCORES,
  IB_SUBJECTS,
  IB_SCORES,
  A_LEVEL_SUBJECTS,
  A_LEVEL_SCORES,
  ACTIVITY_TYPES,
  ACTIVITY_DESCRIPTION_MAX,
  GRADE_LEVEL_OPTIONS,
  RECOGNITION_LEVELS,
  type ExamType,
} from "../../data/applicationProfileOptions";
import { Label, TextInput, TextArea, Select, inputClass } from "./inputs";
import { scoreError } from "./validation";
import Button from "../ui/Button";

type Patch = (patch: Partial<ApplicationProfile>) => void;

// ── SAT ───────────────────────────────────────────────────────────────────────
export function SatEditor({ app, onPatch }: { app: ApplicationProfile; onPatch: Patch }) {
  const set = (k: keyof ApplicationProfile["sat"], v: string) =>
    onPatch({ sat: { ...app.sat, [k]: v } });
  const rows: Array<[keyof ApplicationProfile["sat"], string, number, number]> = [
    ["readingWriting", "Reading & Writing", 200, 800],
    ["math", "Math", 200, 800],
    ["total", "Total", 400, 1600],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {rows.map(([k, label, min, max]) => {
        const err = scoreError(app.sat[k], min, max);
        return (
          <div key={k} className="flex flex-col gap-1.5">
            <Label htmlFor={`sat-${k}`}>{label}</Label>
            <TextInput
              id={`sat-${k}`}
              value={app.sat[k]}
              onChange={(v) => set(k, v)}
              inputMode="numeric"
              placeholder={`${min}–${max}`}
              invalid={Boolean(err)}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── ACT ───────────────────────────────────────────────────────────────────────
export function ActEditor({ app, onPatch }: { app: ApplicationProfile; onPatch: Patch }) {
  const set = (k: keyof ApplicationProfile["act"], v: string) =>
    onPatch({ act: { ...app.act, [k]: v } });
  const fields: Array<[keyof ApplicationProfile["act"], string]> = [
    ["english", "English"],
    ["math", "Math"],
    ["reading", "Reading"],
    ["science", "Science"],
    ["composite", "Composite"],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {fields.map(([k, label]) => {
        const err = scoreError(app.act[k], 1, 36);
        return (
          <div key={k} className="flex flex-col gap-1.5">
            <Label htmlFor={`act-${k}`}>{label}</Label>
            <TextInput
              id={`act-${k}`}
              value={app.act[k]}
              onChange={(v) => set(k, v)}
              inputMode="numeric"
              placeholder="1–36"
              invalid={Boolean(err)}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── AP / IB / A-Level ─────────────────────────────────────────────────────────
const EXAM_CONFIG: Record<
  ExamType,
  { key: "apSubjects" | "ibSubjects" | "aLevels"; subjects: string[]; scores: string[] }
> = {
  AP: { key: "apSubjects", subjects: AP_SUBJECTS, scores: AP_SCORES },
  IB: { key: "ibSubjects", subjects: IB_SUBJECTS, scores: IB_SCORES },
  "A-Level": { key: "aLevels", subjects: A_LEVEL_SUBJECTS, scores: A_LEVEL_SCORES },
};

export function ExamsEditor({ app, onPatch }: { app: ApplicationProfile; onPatch: Patch }) {
  const cfg = EXAM_CONFIG[app.examType];
  const rows: ExamEntry[] = app[cfg.key];
  const setRows = (next: ExamEntry[]) => onPatch({ [cfg.key]: next });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Exam type">
        {EXAM_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={app.examType === t}
            onClick={() => onPatch({ examType: t })}
            className={
              "rounded-xl border px-4 py-2 font-body text-sm font-semibold transition-colors " +
              (app.examType === t
                ? "border-lavender-600 bg-lavender-100 text-ink"
                : "border-lavender-200 bg-white text-ink-muted hover:border-lavender-400")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            aria-label="Subject"
            value={row.subject}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...row, subject: e.target.value };
              setRows(next);
            }}
            className={inputClass + " min-h-[44px] flex-1"}
          >
            <option value="">Subject…</option>
            {cfg.subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            aria-label="Score"
            value={row.score}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...row, score: e.target.value };
              setRows(next);
            }}
            className={inputClass + " min-h-[44px] w-24"}
          >
            <option value="">Score</option>
            {cfg.scores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Remove exam"
            onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
            className="rounded-lg p-2 text-ink-soft hover:bg-lavender-100 hover:text-oxblood"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => setRows([...rows, { subject: "", score: "" }])}
      >
        <Plus size={16} /> Add {app.examType}
      </Button>
    </div>
  );
}

// ── Awards ────────────────────────────────────────────────────────────────────
const emptyAward: AwardEntry = { award: "", gradeLevel: "", levelOfRecognition: "" };

export function AwardsEditor({ app, onPatch }: { app: ApplicationProfile; onPatch: Patch }) {
  const rows = app.awards;
  const setRows = (next: AwardEntry[]) => onPatch({ awards: next });
  const update = (i: number, patch: Partial<AwardEntry>) => {
    const next = [...rows];
    next[i] = { ...rows[i], ...patch };
    setRows(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {(rows.length ? rows : [emptyAward]).map((row, i) => (
        <div
          key={i}
          className="grid gap-3 rounded-xl border border-lavender-200 bg-lavender-50/60 p-4 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor={`award-${i}`}>Award name</Label>
            <TextInput
              id={`award-${i}`}
              value={row.award}
              placeholder="e.g. National Merit Finalist"
              onChange={(v) => (rows.length ? update(i, { award: v }) : setRows([{ ...emptyAward, award: v }]))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`award-grade-${i}`}>Grade level</Label>
            <Select
              id={`award-grade-${i}`}
              value={row.gradeLevel}
              options={GRADE_LEVEL_OPTIONS}
              onChange={(v) => update(i, { gradeLevel: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`award-level-${i}`}>Level of recognition</Label>
            <Select
              id={`award-level-${i}`}
              value={row.levelOfRecognition}
              options={RECOGNITION_LEVELS}
              onChange={(v) => update(i, { levelOfRecognition: v })}
            />
          </div>
          {rows.length > 0 ? (
            <button
              type="button"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              className="flex items-center gap-1 justify-self-start font-body text-xs text-ink-soft hover:text-oxblood sm:col-span-2"
            >
              <Trash2 size={14} /> Remove
            </button>
          ) : null}
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => setRows([...rows, emptyAward])}
      >
        <Plus size={16} /> Add another award
      </Button>
    </div>
  );
}

// ── Activities ────────────────────────────────────────────────────────────────
const emptyActivity: ActivityEntry = {
  activityType: "",
  position: "",
  organizationName: "",
  grade: "",
  weeksPerYear: "",
  hoursPerWeek: "",
  description: "",
};

export function ActivitiesEditor({ app, onPatch }: { app: ApplicationProfile; onPatch: Patch }) {
  const rows = app.activities;
  const setRows = (next: ActivityEntry[]) => onPatch({ activities: next });
  const update = (i: number, patch: Partial<ActivityEntry>) => {
    const base = rows.length ? rows : [emptyActivity];
    const next = [...base];
    next[i] = { ...base[i], ...patch };
    setRows(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {(rows.length ? rows : [emptyActivity]).map((row, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-lavender-200 bg-lavender-50/60 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`act-type-${i}`}>Activity type</Label>
            <Select
              id={`act-type-${i}`}
              value={row.activityType}
              options={ACTIVITY_TYPES}
              onChange={(v) => update(i, { activityType: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`act-pos-${i}`}>Position / role</Label>
            <TextInput id={`act-pos-${i}`} value={row.position} placeholder="e.g. President" onChange={(v) => update(i, { position: v })} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor={`act-org-${i}`}>Organization</Label>
            <TextInput id={`act-org-${i}`} value={row.organizationName} placeholder="e.g. Robotics Club" onChange={(v) => update(i, { organizationName: v })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`act-grade-${i}`}>Grade</Label>
            <Select id={`act-grade-${i}`} value={row.grade} options={GRADE_LEVEL_OPTIONS} onChange={(v) => update(i, { grade: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`act-weeks-${i}`}>Weeks/yr</Label>
              <TextInput id={`act-weeks-${i}`} value={row.weeksPerYear} inputMode="numeric" onChange={(v) => update(i, { weeksPerYear: v })} suffix="wks" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`act-hours-${i}`}>Hours/wk</Label>
              <TextInput id={`act-hours-${i}`} value={row.hoursPerWeek} inputMode="numeric" onChange={(v) => update(i, { hoursPerWeek: v })} suffix="hrs" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor={`act-desc-${i}`}>What you did</Label>
            <TextArea
              id={`act-desc-${i}`}
              value={row.description}
              maxLength={ACTIVITY_DESCRIPTION_MAX}
              placeholder="Briefly, what you did and its impact."
              onChange={(v) => update(i, { description: v })}
            />
          </div>
          {rows.length > 0 ? (
            <button
              type="button"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              className="flex items-center gap-1 justify-self-start font-body text-xs text-ink-soft hover:text-oxblood sm:col-span-2"
            >
              <Trash2 size={14} /> Remove
            </button>
          ) : null}
        </div>
      ))}
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setRows([...rows, emptyActivity])}>
        <Plus size={16} /> Add another activity
      </Button>
    </div>
  );
}
