import { useState } from "react";
import {
  User,
  BookOpen,
  Pencil,
  Star,
  Trophy,
  Activity,
  ChevronLeft,
  Save,
} from "lucide-react";
import {
  useStudentProfile,
  type ApplicationProfile,
  type StudentProfile,
} from "../../context/StudentProfileContext";
import Stepper, { type StepMeta } from "./Stepper";
import BasicInfoStep from "./BasicInfoStep";
import EducationStep from "./EducationStep";
import TestingStep from "./TestingStep";
import PreferenceStep from "./PreferenceStep";
import AwardsStep from "./AwardsStep";
import ActivitiesStep from "./ActivitiesStep";

type Props = {
  done: boolean;
  onComplete: () => void;
};

const STEPS: StepMeta[] = [
  { label: "Basic Information", icon: User },
  { label: "Education", icon: BookOpen },
  { label: "Testing", icon: Pencil },
  { label: "Preference", icon: Star },
  { label: "Awards", icon: Trophy },
  { label: "Activities", icon: Activity },
];

/**
 * Fold the structured wizard data down into the legacy free-text
 * `StudentProfile` fields so the roadmap / Best-Next-Task recommendations
 * (which serialize that object) keep receiving profile signal.
 */
function deriveLegacyProfile(p: ApplicationProfile): Partial<StudentProfile> {
  const tests: string[] = [];
  if (p.sat.total || p.sat.readingWriting || p.sat.math) {
    tests.push(
      `SAT: ${p.sat.total || "?"} (R&W ${p.sat.readingWriting || "?"}, Math ${p.sat.math || "?"})`,
    );
  }
  if (p.act.composite) tests.push(`ACT: ${p.act.composite}`);
  const apList = p.apSubjects
    .filter((a) => a.subject)
    .map((a) => `${a.subject}${a.score ? `: ${a.score}` : ""}`);
  if (apList.length) tests.push(`AP — ${apList.join(", ")}`);

  const activities = p.activities
    .filter((a) => a.activityType || a.organizationName)
    .map((a) =>
      [a.position, a.organizationName].filter(Boolean).join(" @ ") ||
      a.activityType,
    );

  const awards = p.awards
    .filter((a) => a.award)
    .map((a) =>
      [a.award, a.levelOfRecognition].filter(Boolean).join(" — "),
    );

  return {
    gradeLevel: p.currentSchoolYear,
    gpa: p.unweightedGpa || p.weightedGpa,
    gpaScale: p.gpaScale === "None" ? "" : p.gpaScale,
    apCount: apList.length ? String(apList.length) : "",
    testScores: tests.join("; "),
    extracurriculars: activities.join("; "),
    extracurricularAwards: awards.join("; "),
    interests: p.areasOfInterest.join(", "),
  };
}

export default function CollegeProfileWizard({ done, onComplete }: Props) {
  const { applicationProfile, updateApplicationProfile, updateProfile } =
    useStudentProfile();
  const [step, setStep] = useState(0);
  // If the profile was already completed, every step is freely navigable.
  const [maxReached, setMaxReached] = useState(done ? STEPS.length - 1 : 0);

  const isLast = step === STEPS.length - 1;

  const goTo = (i: number) => {
    setStep(i);
    setMaxReached((m) => Math.max(m, i));
  };

  const handleContinue = () => {
    if (isLast) {
      // Final save: fold into legacy fields and mark the activity complete.
      updateProfile(deriveLegacyProfile(applicationProfile));
      onComplete();
      return;
    }
    goTo(step + 1);
  };

  const stepProps = {
    profile: applicationProfile,
    update: updateApplicationProfile,
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Left rail */}
        <aside className="shrink-0 border-b border-slate-100 bg-lavender-50/60 p-8 md:w-72 md:border-b-0 md:border-r">
          <Stepper
            steps={STEPS}
            current={step}
            maxReached={maxReached}
            onSelect={goTo}
          />
        </aside>

        {/* Right content */}
        <div className="flex-1 p-8">
          {step === 0 && <BasicInfoStep {...stepProps} />}
          {step === 1 && <EducationStep {...stepProps} />}
          {step === 2 && <TestingStep {...stepProps} />}
          {step === 3 && <PreferenceStep {...stepProps} />}
          {step === 4 && <AwardsStep {...stepProps} />}
          {step === 5 && <ActivitiesStep {...stepProps} />}

          {/* Footer nav */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
            >
              <Save size={16} />
              {isLast ? "Save Profile" : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
