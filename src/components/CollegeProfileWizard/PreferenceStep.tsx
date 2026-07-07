import { type ApplicationProfile } from "../../context/StudentProfileContext";
import { SelectField, CheckboxGroup, TextAreaField, FieldLabel } from "./fields";
import {
  PREF_COUNTRIES,
  US_STATES,
  REGIONS,
  AREAS_OF_INTEREST,
  PROGRAM_STRENGTH,
  INSTITUTION_TYPE,
  SPECIAL_DESIGNATION,
  CAMPUS_CULTURE,
  FINANCIAL_AID,
  GEOGRAPHY_AREA,
  STUDENT_BODY,
} from "../../data/applicationProfileOptions";

type Props = {
  profile: ApplicationProfile;
  update: (patch: Partial<ApplicationProfile>) => void;
};

/** A numbered sub-section wrapper matching the Preference screenshot. */
function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800">
        {n}.{title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PreferenceStep({ profile, update }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Preference</h2>
      <p className="mt-1 text-slate-500">
        Tell us what matters most to you in a college and we&rsquo;ll help
        discover your perfect fit.
      </p>

      <div className="mt-8 space-y-6">
        <Section n={1} title="Select Country and Region Preference">
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField
              label="Select Country"
              required
              value={profile.prefCountry}
              options={PREF_COUNTRIES}
              onChange={(v) => update({ prefCountry: v })}
            />
            <SelectField
              label="State/Province"
              value={profile.prefStateProvince}
              options={US_STATES}
              placeholder="Select a State"
              onChange={(v) => update({ prefStateProvince: v })}
            />
          </div>
          <div className="mt-4">
            <FieldLabel>Select Region</FieldLabel>
            <CheckboxGroup
              options={REGIONS}
              selected={profile.regions}
              onChange={(next) => update({ regions: next })}
            />
          </div>
        </Section>

        <Section n={2} title="What areas are you interested in?">
          <CheckboxGroup
            options={AREAS_OF_INTEREST}
            selected={profile.areasOfInterest}
            onChange={(next) => update({ areasOfInterest: next })}
          />
        </Section>

        <Section n={3} title="Academic Program Strength">
          <CheckboxGroup
            options={PROGRAM_STRENGTH}
            selected={profile.programStrength}
            onChange={(next) => update({ programStrength: next })}
          />
        </Section>

        <Section n={4} title="Type of Institution">
          <CheckboxGroup
            options={INSTITUTION_TYPE}
            selected={profile.institutionType}
            onChange={(next) => update({ institutionType: next })}
          />
        </Section>

        <Section n={5} title="Special Designation">
          <CheckboxGroup
            options={SPECIAL_DESIGNATION}
            selected={profile.specialDesignation}
            onChange={(next) => update({ specialDesignation: next })}
          />
        </Section>

        <Section n={6} title="Campus Culture">
          <CheckboxGroup
            options={CAMPUS_CULTURE}
            selected={profile.campusCulture}
            onChange={(next) => update({ campusCulture: next })}
          />
        </Section>

        <Section n={7} title="Financial Aid Importance">
          <CheckboxGroup
            options={FINANCIAL_AID}
            selected={profile.financialAid}
            onChange={(next) => update({ financialAid: next })}
          />
        </Section>

        <Section n={8} title="Geography Area">
          <CheckboxGroup
            options={GEOGRAPHY_AREA}
            selected={profile.geographyArea}
            onChange={(next) => update({ geographyArea: next })}
          />
        </Section>

        <Section n={9} title="Student Body">
          <CheckboxGroup
            options={STUDENT_BODY}
            selected={profile.studentBody}
            onChange={(next) => update({ studentBody: next })}
          />
        </Section>

        <Section n={10} title="Others">
          <TextAreaField
            value={profile.prefOthers}
            placeholder="Any personal story, perspective, or passion you want to share"
            rows={4}
            onChange={(v) => update({ prefOthers: v })}
          />
        </Section>
      </div>
    </div>
  );
}
