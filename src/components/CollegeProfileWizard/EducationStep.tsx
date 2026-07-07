import { type ApplicationProfile } from "../../context/StudentProfileContext";
import { TextField, SelectField } from "./fields";
import {
  COUNTRIES,
  US_STATES,
  GPA_SCALE_OPTIONS,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

export default function EducationStep({ profile, update }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Education</h2>
      <p className="mt-1 text-slate-500">
        Tell us about your school and academic performance so we can create the
        right college strategy for you.
      </p>

      <div className="mt-8 space-y-6">
        <TextField
          label="School Name"
          required
          value={profile.schoolName}
          placeholder="School Name"
          onChange={(v) => update({ schoolName: v })}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <SelectField
            label="Country"
            required
            value={profile.country}
            options={COUNTRIES}
            onChange={(v) => update({ country: v })}
          />
          <SelectField
            label="State/Province"
            required
            value={profile.stateProvince}
            options={US_STATES}
            onChange={(v) => update({ stateProvince: v })}
          />
          <TextField
            label="City"
            required
            value={profile.city}
            placeholder="City"
            onChange={(v) => update({ city: v })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Graduating class size (approx.)"
            required
            type="number"
            value={profile.graduatingClassSize}
            placeholder="Graduating class size (approx.)"
            onChange={(v) => update({ graduatingClassSize: v })}
          />
          <TextField
            label="Class Ranking"
            value={profile.classRanking}
            placeholder="Class Ranking"
            onChange={(v) => update({ classRanking: v })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <SelectField
            label="GPA Scale"
            value={profile.gpaScale}
            options={GPA_SCALE_OPTIONS}
            placeholder="None"
            onChange={(v) => update({ gpaScale: v })}
          />
          <TextField
            label="Unweighted GPA"
            value={profile.unweightedGpa}
            placeholder="Unweighted GPA"
            onChange={(v) => update({ unweightedGpa: v })}
          />
          <TextField
            label="Weighted GPA"
            value={profile.weightedGpa}
            placeholder="Weighted GPA"
            onChange={(v) => update({ weightedGpa: v })}
          />
        </div>
      </div>
    </div>
  );
}
