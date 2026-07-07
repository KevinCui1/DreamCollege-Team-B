import { type ApplicationProfile } from "../../context/StudentProfileContext";
import { TextField, SelectField } from "./fields";
import {
  GENDER_OPTIONS,
  SCHOOL_YEAR_OPTIONS,
  GRADUATION_YEARS,
  FIRST_GEN_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  RESIDENCY_OPTIONS,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

export default function BasicInfoStep({ profile, update }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
      <p className="mt-1 text-slate-500">
        Start here so we can match you with the right opportunities based on your
        background
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <TextField
          label="First Name"
          required
          value={profile.firstName}
          placeholder="Enter First Name"
          onChange={(v) => update({ firstName: v })}
        />
        <TextField
          label="Middle name"
          value={profile.middleName}
          placeholder="Middle name"
          onChange={(v) => update({ middleName: v })}
        />
        <TextField
          label="Last name"
          required
          value={profile.lastName}
          placeholder="Last name"
          onChange={(v) => update({ lastName: v })}
        />

        <SelectField
          label="Gender"
          required
          value={profile.gender}
          options={GENDER_OPTIONS}
          onChange={(v) => update({ gender: v })}
        />
        <SelectField
          label="Current School Year"
          required
          value={profile.currentSchoolYear}
          options={SCHOOL_YEAR_OPTIONS}
          onChange={(v) => update({ currentSchoolYear: v })}
        />
        <SelectField
          label="Graduation Year"
          required
          value={profile.graduationYear}
          options={GRADUATION_YEARS}
          onChange={(v) => update({ graduationYear: v })}
        />
      </div>

      <div className="mt-6">
        <SelectField
          label="First-generation college student?"
          required
          value={profile.firstGeneration}
          options={FIRST_GEN_OPTIONS}
          onChange={(v) => update({ firstGeneration: v })}
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Family Income (US $)"
          required
          value={profile.familyIncome}
          options={FAMILY_INCOME_OPTIONS}
          onChange={(v) => update({ familyIncome: v })}
        />
        <SelectField
          label="Residency Status"
          required
          value={profile.residencyStatus}
          options={RESIDENCY_OPTIONS}
          onChange={(v) => update({ residencyStatus: v })}
        />
      </div>
    </div>
  );
}
