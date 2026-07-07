import { Plus, X, Info } from "lucide-react";
import {
  type ApplicationProfile,
  type AwardEntry,
} from "../../context/StudentProfileContext";
import { TextField, SelectField } from "./fields";
import {
  GRADE_LEVEL_OPTIONS,
  RECOGNITION_LEVELS,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

const emptyAward: AwardEntry = {
  award: "",
  gradeLevel: "",
  levelOfRecognition: "",
};

export default function AwardsStep({ profile, update }: Props) {
  // Always show at least one row so the step never looks empty.
  const rows = profile.awards.length > 0 ? profile.awards : [emptyAward];

  const setRows = (next: AwardEntry[]) => update({ awards: next });
  const patchRow = (i: number, patch: Partial<AwardEntry>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows([...rows, { ...emptyAward }]);
  const removeRow = (i: number) => {
    const next = rows.filter((_, idx) => idx !== i);
    setRows(next);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Awards</h2>
      <p className="mt-1 flex items-center gap-2 text-slate-500">
        Highlight your achievements to show colleges what sets you apart..
        <Info size={16} className="text-slate-400" /> Samples
      </p>

      <div className="mt-8 space-y-6">
        {rows.map((row, i) => (
          <div key={i} className="grid items-end gap-6 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <TextField
              label="Award/Honor"
              value={row.award}
              placeholder="Award/Honor"
              onChange={(v) => patchRow(i, { award: v })}
            />
            <SelectField
              label="Grade Level"
              value={row.gradeLevel}
              options={GRADE_LEVEL_OPTIONS}
              onChange={(v) => patchRow(i, { gradeLevel: v })}
            />
            <SelectField
              label="Level of Recognition"
              value={row.levelOfRecognition}
              options={RECOGNITION_LEVELS}
              onChange={(v) => patchRow(i, { levelOfRecognition: v })}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label="Remove award"
              className="pb-3 text-red-400 transition hover:text-red-600"
            >
              <X size={22} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  );
}
