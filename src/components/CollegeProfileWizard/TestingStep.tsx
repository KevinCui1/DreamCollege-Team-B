import { useState } from "react";
import { ListChecks, CheckSquare, Plus, Trash2, Info } from "lucide-react";
import {
  type ApplicationProfile,
  type ExamEntry,
} from "../../context/StudentProfileContext";
import { TextField } from "./fields";
import {
  EXAM_TYPES,
  type ExamType,
  AP_SUBJECTS,
  AP_SCORES,
  IB_SUBJECTS,
  IB_SCORES,
  A_LEVEL_SUBJECTS,
  A_LEVEL_SCORES,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

type Tab = "standardized" | "academic";

const rowSelect =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100";

export default function TestingStep({ profile, update }: Props) {
  const [tab, setTab] = useState<Tab>("standardized");

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Tests</h2>

      {/* Tabs */}
      <div className="mt-5 flex gap-8 border-b border-slate-200">
        <TabButton
          active={tab === "standardized"}
          onClick={() => setTab("standardized")}
          icon={<ListChecks size={18} />}
          label="Standardized Tests"
        />
        <TabButton
          active={tab === "academic"}
          onClick={() => setTab("academic")}
          icon={<CheckSquare size={18} />}
          label="Academic Exams"
          trailing={<Info size={15} className="text-slate-400" />}
        />
      </div>

      {tab === "standardized" ? (
        <StandardizedTab profile={profile} update={update} />
      ) : (
        <AcademicTab profile={profile} update={update} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  trailing,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-base font-semibold transition ${
        active
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon}
      {label}
      {trailing}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Standardized Tests
// ---------------------------------------------------------------------------

function StandardizedTab({ profile, update }: Props) {
  const setSat = (patch: Partial<ApplicationProfile["sat"]>) =>
    update({ sat: { ...profile.sat, ...patch } });
  const setAct = (patch: Partial<ApplicationProfile["act"]>) =>
    update({ act: { ...profile.act, ...patch } });

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-800">Standardized Tests</h3>

      {/* SAT */}
      <div className="mt-4 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            SAT
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800">SAT</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Recommended
              </span>
            </div>
            <p className="text-sm text-slate-500">Scholastic Assessment Test</p>
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <TextField
            label="Reading & Writing"
            type="number"
            value={profile.sat.readingWriting}
            suffix="out of 800"
            onChange={(v) => setSat({ readingWriting: v })}
          />
          <TextField
            label="Math"
            type="number"
            value={profile.sat.math}
            suffix="out of 800"
            onChange={(v) => setSat({ math: v })}
          />
          <TextField
            label="Total Score"
            type="number"
            value={profile.sat.total}
            suffix="out of 1600"
            onChange={(v) => setSat({ total: v })}
          />
        </div>
      </div>

      {/* ACT */}
      <div className="mt-6 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white">
            ACT
          </span>
          <div>
            <span className="text-lg font-bold text-slate-800">ACT</span>
            <p className="text-sm text-slate-500">American College Testing</p>
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-5">
          <TextField
            label="English"
            type="number"
            value={profile.act.english}
            suffix="/ 36"
            onChange={(v) => setAct({ english: v })}
          />
          <TextField
            label="Math"
            type="number"
            value={profile.act.math}
            suffix="/ 36"
            onChange={(v) => setAct({ math: v })}
          />
          <TextField
            label="Reading"
            type="number"
            value={profile.act.reading}
            suffix="/ 36"
            onChange={(v) => setAct({ reading: v })}
          />
          <TextField
            label="Science"
            type="number"
            value={profile.act.science}
            suffix="/ 36"
            onChange={(v) => setAct({ science: v })}
          />
          <TextField
            label="Composite Score"
            type="number"
            value={profile.act.composite}
            suffix="/ 36"
            onChange={(v) => setAct({ composite: v })}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Academic Exams (AP / IB / A-Level)
// ---------------------------------------------------------------------------

const EXAM_CONFIG: Record<
  ExamType,
  {
    title: string;
    blurb: string;
    subjects: string[];
    scores: string[];
    key: "apSubjects" | "ibSubjects" | "aLevels";
    scoreLabel: string;
  }
> = {
  AP: {
    title: "AP Subject Testing",
    blurb: "Add each AP subject you have taken or plan to take.",
    subjects: AP_SUBJECTS,
    scores: AP_SCORES,
    key: "apSubjects",
    scoreLabel: "Score (1–5)",
  },
  IB: {
    title: "IB Subject Testing",
    blurb: "Add each IB subject you have taken or plan to take.",
    subjects: IB_SUBJECTS,
    scores: IB_SCORES,
    key: "ibSubjects",
    scoreLabel: "Score (1–7)",
  },
  "A-Level": {
    title: "A-Level Subject Testing",
    blurb: "Add each A-Level subject you have taken or plan to take.",
    subjects: A_LEVEL_SUBJECTS,
    scores: A_LEVEL_SCORES,
    key: "aLevels",
    scoreLabel: "Grade",
  },
};

function AcademicTab({ profile, update }: Props) {
  const config = EXAM_CONFIG[profile.examType];
  const rows = profile[config.key];

  const setRows = (next: ExamEntry[]) => update({ [config.key]: next });
  const addRow = () => setRows([...rows, { subject: "", score: "" }]);
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const patchRow = (i: number, patch: Partial<ExamEntry>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-bold text-indigo-600">Select Exam Type</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {EXAM_TYPES.map((type) => {
          const active = profile.examType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => update({ examType: type })}
              className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left font-semibold transition ${
                active
                  ? "border-indigo-500 bg-indigo-50 text-slate-800"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  active ? "border-indigo-600" : "border-slate-300"
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
              </span>
              {type === "AP"
                ? "AP Subject Testing"
                : type === "IB"
                  ? "IB Subject Testing"
                  : "A-Level"}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800">{config.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{config.blurb}</p>

        <div className="mt-5 grid grid-cols-[1fr_10rem_3rem] items-center gap-4 text-sm font-semibold text-slate-700">
          <span>Subject</span>
          <span>{config.scoreLabel}</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="mt-2 space-y-3">
          {rows.length === 0 && (
            <p className="py-2 text-sm text-slate-400">
              No subjects added yet — use the button below.
            </p>
          )}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_10rem_3rem] items-center gap-4"
            >
              <select
                value={row.subject}
                onChange={(e) => patchRow(i, { subject: e.target.value })}
                className={rowSelect}
              >
                <option value="">Select subject</option>
                {config.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={row.score}
                onChange={(e) => patchRow(i, { score: e.target.value })}
                className={rowSelect}
              >
                <option value="">—</option>
                {config.scores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Remove subject"
                className="flex justify-center text-red-500 transition hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus size={18} /> Add {profile.examType} Subject
        </button>
      </div>
    </div>
  );
}
