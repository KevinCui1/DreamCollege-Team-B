import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import {
  useStudentProfile,
  useProfileSnapshot,
} from "../context/StudentProfileContext";
import { getField } from "../profile/fields";
import FieldControl from "../components/collection/FieldControl";
import Button from "../components/ui/Button";
import ProgressRibbon from "../components/ui/ProgressRibbon";
import SaveIndicator from "../components/ui/SaveIndicator";
import { ONBOARDING_FIELD_IDS } from "./config";

/**
 * The first-run welcome — a warm, one-decision-at-a-time sequence, not a form.
 * It gathers only the essentials (name, grade, graduation year), saving each
 * answer to the account as it goes, then hands the student back to a
 * personalized dashboard. Everything else waits until a tool needs it.
 */
export default function WelcomeFlow({ onComplete }: { onComplete: () => void }) {
  const { answerField, updateApplicationProfile, saveState, retrySave } =
    useStudentProfile();
  const snapshot = useProfileSnapshot();
  const [step, setStep] = useState(0);

  const fields = useMemo(
    () => ONBOARDING_FIELD_IDS.map((id) => getField(id)!).filter(Boolean),
    [],
  );
  const total = fields.length;
  const onClosing = step >= total;

  const firstName = snapshot.app.firstName.trim();
  const current = onClosing ? undefined : fields[step];
  const answered = current ? current.answered(snapshot) : true;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Dream College"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-paper px-5 py-10 font-body"
    >
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center gap-2.5 text-evergreen">
          <Compass size={22} strokeWidth={2} />
          <span className="font-serif text-lg font-semibold text-graphite">
            Dream College
          </span>
        </div>

        {!onClosing ? (
          <>
            <ProgressRibbon
              current={step + 1}
              total={total}
              label={`A quick hello — ${step + 1} of ${total}`}
              className="mb-8"
            />

            {step === 0 && (
              <p className="mb-6 font-serif text-2xl font-semibold leading-snug text-graphite">
                Welcome. Let's get to know you — just three quick things.
              </p>
            )}

            <div key={current!.id} className="animate-collect-in">
              <FieldControl
                field={current!}
                app={snapshot.app}
                quizTaken={snapshot.quiz !== null}
                onAnswer={answerField}
                onPatch={updateApplicationProfile}
                autoFocus
              />
            </div>

            <div className="mt-10 flex items-center justify-between">
              {step > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-3">
                <SaveIndicator state={saveState} onRetry={retrySave} />
                <Button
                  variant="primary"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!answered}
                >
                  {step + 1 === total ? "Finish" : "Continue"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="animate-collect-in flex flex-col gap-5 text-center">
            <p className="font-serif text-3xl font-semibold leading-tight text-graphite">
              {firstName ? `You're all set, ${firstName}.` : "You're all set."}
            </p>
            <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-graphite-muted">
              We saved that to your account. From here, each tool asks only for
              what it needs — nothing you've already told us. No giant forms.
            </p>
            <div className="mx-auto mt-2 flex items-center gap-3">
              <SaveIndicator state={saveState} onRetry={retrySave} />
              <Button variant="primary" onClick={onComplete}>
                Go to my dashboard <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
