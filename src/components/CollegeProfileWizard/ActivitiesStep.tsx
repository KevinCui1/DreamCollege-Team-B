import { Plus, Trash2, Info } from "lucide-react";
import {
  type ApplicationProfile,
  type ActivityEntry,
} from "../../context/StudentProfileContext";
import { TextField, SelectField, TextAreaField, FieldLabel } from "./fields";
import {
  ACTIVITY_TYPES,
  GRADE_LEVEL_OPTIONS,
  ACTIVITY_DESCRIPTION_MAX,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

const emptyActivity: ActivityEntry = {
  activityType: "",
  position: "",
  organizationName: "",
  grade: "",
  weeksPerYear: "",
  hoursPerWeek: "",
  description: "",
};

/** A plain text input with a unit suffix (wks / hrs), matching the screenshot. */
function UnitField({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100"
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">
        {unit}
      </span>
    </div>
  );
}

export default function ActivitiesStep({ profile, update }: Props) {
  // Always show at least one card so the step never looks empty.
  const rows = profile.activities.length > 0 ? profile.activities : [emptyActivity];

  const setRows = (next: ActivityEntry[]) => update({ activities: next });
  const patchRow = (i: number, patch: Partial<ActivityEntry>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows([...rows, { ...emptyActivity }]);
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Activities</h2>
      <p className="mt-1 text-slate-500">
        Reporting extracurricular activities can help colleges better understand
        your life outside of the classroom.
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-slate-700">
        Do you have any activities that you wish to report?
        <Info size={16} className="text-slate-400" /> Samples
      </p>

      <div className="mt-4 space-y-6">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="mt-8 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="grid gap-5 sm:grid-cols-3">
                  <SelectField
                    label="Activity Type"
                    value={row.activityType}
                    options={ACTIVITY_TYPES}
                    placeholder="Others"
                    onChange={(v) => patchRow(i, { activityType: v })}
                  />
                  <TextField
                    label="Position / Leadership"
                    value={row.position}
                    placeholder="e.g. President, Founder, Member"
                    onChange={(v) => patchRow(i, { position: v })}
                  />
                  <TextField
                    label="Organization Name"
                    value={row.organizationName}
                    placeholder="e.g. Plano West Sr High"
                    onChange={(v) => patchRow(i, { organizationName: v })}
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <SelectField
                    label="Grade"
                    value={row.grade}
                    options={GRADE_LEVEL_OPTIONS}
                    placeholder="Select..."
                    onChange={(v) => patchRow(i, { grade: v })}
                  />
                  <div>
                    <FieldLabel>Weeks/Year</FieldLabel>
                    <UnitField
                      value={row.weeksPerYear}
                      unit="wks"
                      onChange={(v) => patchRow(i, { weeksPerYear: v })}
                    />
                  </div>
                  <div>
                    <FieldLabel>Hours/Week</FieldLabel>
                    <UnitField
                      value={row.hoursPerWeek}
                      unit="hrs"
                      onChange={(v) => patchRow(i, { hoursPerWeek: v })}
                    />
                  </div>
                </div>

                <TextAreaField
                  label="Description"
                  className="mt-5"
                  value={row.description}
                  maxLength={ACTIVITY_DESCRIPTION_MAX}
                  rows={3}
                  onChange={(v) => patchRow(i, { description: v })}
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Remove activity"
                className="mt-8 text-slate-400 transition hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-5 text-base font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
      >
        <Plus size={20} /> Add Another Activity
      </button>
    </div>
  );
}
