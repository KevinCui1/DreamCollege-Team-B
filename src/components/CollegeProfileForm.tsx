import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useStudentProfile } from "../context/StudentProfileContext";

type Props = {
  done: boolean;
  onComplete: () => void;
};

const GPA_SCALE_OPTIONS = ["4.0", "5.0", "100-point", "Other"];

export default function CollegeProfileForm({ done, onComplete }: Props) {
  const { profile, updateProfile } = useStudentProfile();
  const [editing, setEditing] = useState(!done);

  if (!editing) {
    return (
      <div>
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 size={24} />
          <span className="text-lg font-semibold">Profile saved</span>
        </div>
        <p className="mt-2 text-slate-500">
          Your academic details and extracurriculars are saved and feed into
          your personalized roadmap.
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
        >
          Edit profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Academics
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Current school year"
            value={profile.gradeLevel}
            placeholder="e.g. 11th grade"
            onChange={(v) => updateProfile({ gradeLevel: v })}
          />
          <TextField
            label="GPA"
            value={profile.gpa}
            placeholder="e.g. 3.8"
            onChange={(v) => updateProfile({ gpa: v })}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              GPA scale
            </label>
            <select
              value={profile.gpaScale}
              onChange={(e) => updateProfile({ gpaScale: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100"
            >
              <option value="">Select a scale</option>
              {GPA_SCALE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <TextField
            label="APs taken / planned"
            value={profile.apCount}
            placeholder="e.g. 4"
            onChange={(v) => updateProfile({ apCount: v })}
          />
          <TextAreaField
            className="sm:col-span-2"
            label="Standardized testing"
            value={profile.testScores}
            placeholder="e.g. SAT: 1450 (Math 740, EBRW 710); ACT: 32; AP Chemistry: 5"
            onChange={(v) => updateProfile({ testScores: v })}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Extracurriculars
        </h2>
        <div className="mt-3 grid gap-4">
          <TextAreaField
            label="Activities"
            value={profile.extracurriculars}
            placeholder="e.g. Varsity soccer captain (9-12), Robotics club VP (10-12), Volunteer tutor (9-present)"
            onChange={(v) => updateProfile({ extracurriculars: v })}
          />
          <TextAreaField
            label="Awards & honors"
            value={profile.extracurricularAwards}
            placeholder="e.g. National Merit Semifinalist, Regional Science Fair 1st place, Eagle Scout"
            onChange={(v) => updateProfile({ extracurricularAwards: v })}
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          setEditing(false);
          if (!done) onComplete();
        }}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
      >
        Save profile
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100"
      />
    </div>
  );
}
