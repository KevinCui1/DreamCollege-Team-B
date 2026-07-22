import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useStudentProfile,
  useProfileSnapshot,
} from "../context/StudentProfileContext";
import { getField } from "../profile/fields";
import FieldControl from "../components/collection/FieldControl";
import Button from "../components/ui/Button";
import SaveIndicator from "../components/ui/SaveIndicator";
import { ONBOARDING_FIELD_IDS } from "./config";
import stage1 from "../../images/stage1.png";
import stage2 from "../../images/stage2.png";
import stage3 from "../../images/stage3.png";
import logo from "../../images/logo.webp";

const SCENES = [stage1, stage2, stage3];
const CONTENT_EXIT_MS = 170;
const CONTENT_ENTER_DELAY_MS = 310;
const OVERLAY_EXIT_MS = 480;

const STEP_COPY = [
  {
    eyebrow: "Welcome to DreamCollege!",
    title: "Let’s personalize your journey!",
    supporting:
      "Answer three quick questions so DreamCollege can tailor your dashboard and next steps.",
  },
  {
    eyebrow: "Personalizing your plan!",
    title: "What grade will you be in next year?",
    supporting:
      "This helps us show you the milestones, activities, and planning tools that make sense for your stage.",
  },
  {
    eyebrow: "Planning your timeline!",
    title: "When will you graduate?",
    supporting:
      "We’ll use this to pace your college planning and surface next steps when they’re most helpful.",
  },
];

/**
 * A three-scene first-run welcome. Each answer advances the watercolor
 * landscape while the account-backed profile continues to autosave normally.
 */
export default function WelcomeFlow({ onComplete }: { onComplete: () => void }) {
  const { answerField, updateApplicationProfile, saveState, retrySave } =
    useStudentProfile();
  const snapshot = useProfileSnapshot();
  const [step, setStep] = useState(0);
  const [scene, setScene] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<number[]>([]);

  const fields = useMemo(
    () =>
      ONBOARDING_FIELD_IDS.map((id) => getField(id)!)
        .filter(Boolean)
        .map((field) => {
          if (field.id === "firstName") {
            return {
              ...field,
              label: "What should we call you?",
              reason: "We’ll use your name to personalize your DreamCollege experience.",
            };
          }
          if (field.id === "currentSchoolYear") {
            return {
              ...field,
              label: "Grade for the next school year",
              reason: "This lets us tailor your plan even if you are joining during summer.",
            };
          }
          return {
            ...field,
            label: "Expected graduation year",
            reason: "This helps DreamCollege map out your timeline.",
          };
        }),
    [],
  );

  const total = fields.length;
  const arriving = step >= total;
  const current = arriving ? undefined : fields[step];
  const answered = current ? current.answered(snapshot) : true;
  const firstName = snapshot.app.firstName.trim();

  const queue = (callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timers.current.push(id);
  };

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const moveTo = (nextStep: number) => {
    if (transitioning || nextStep < 0 || nextStep > total) return;

    setTransitioning(true);
    setContentVisible(false);

    queue(() => {
      setScene(Math.min(nextStep, total - 1));
    }, CONTENT_EXIT_MS);

    queue(() => {
      setStep(nextStep);
      setContentVisible(true);
    }, CONTENT_ENTER_DELAY_MS);

    queue(() => {
      setTransitioning(false);
    }, 900);

  };

  const completeWelcome = () => {
    if (exiting) return;
    setExiting(true);
    queue(onComplete, OVERLAY_EXIT_MS);
  };

  const copy = arriving ? null : STEP_COPY[step];
  const personalizedTitle =
    step === 1 && firstName
      ? `Great to meet you, ${firstName}.`
      : copy?.title;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to DreamCollege"
      aria-busy={transitioning}
      className={`welcome-journey fixed inset-0 z-50 overflow-hidden bg-white font-body ${
        exiting ? "welcome-journey-exiting" : ""
      }`}
    >
      <div className="welcome-scenes" aria-hidden="true">
        {SCENES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`welcome-scene ${index <= scene ? "is-visible" : ""}`}
          />
        ))}
        <div className="welcome-reading-light" />
        <div className="welcome-watercolor-bloom" key={`bloom-${scene}`} />
      </div>

      <div className="welcome-petals" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <header className="absolute left-5 top-5 z-20 sm:left-9 sm:top-8">
        <div className="welcome-logo-shell">
          <img src={logo} alt="DreamCollege" className="welcome-logo" />
        </div>
      </header>

      <main className="relative z-10 flex min-h-full items-center justify-center overflow-y-auto px-5 pb-10 pt-24 sm:px-8">
        <div className="w-full max-w-[39rem]">
          <nav aria-label="Welcome journey progress" className="mb-8">
            <ol className="welcome-journey-marks">
              {fields.map((field, index) => (
                <li
                  key={field.id}
                  className={index <= scene ? "is-grown" : ""}
                  aria-current={!arriving && index === step ? "step" : undefined}
                >
                  <span className="sr-only">
                    {index < step
                      ? `${field.label}, complete`
                      : index === step
                        ? `${field.label}, current`
                        : field.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          <section
            className={`welcome-content ${contentVisible ? "is-visible" : "is-leaving"}`}
            aria-live="polite"
          >
            {!arriving && current && copy ? (
              <>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-lavender-800">
                  {copy.eyebrow}
                </p>
                <h1
                  className={`${step === 0 ? "max-w-[16ch]" : "max-w-[12ch]"} font-display text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.94] tracking-[-0.045em] text-ink`}
                >
                  {personalizedTitle}
                </h1>
                <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-ink-muted sm:text-lg">
                  {copy.supporting}
                </p>

                <div key={current.id} className="welcome-field mt-9 max-w-lg">
                  <FieldControl
                    field={current}
                    app={snapshot.app}
                    quizTaken={snapshot.quiz !== null}
                    onAnswer={answerField}
                    onPatch={updateApplicationProfile}
                    autoFocus
                  />
                </div>

                <div className="mt-9 flex min-h-[52px] flex-wrap items-center justify-between gap-4">
                  {step > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="welcome-back-button"
                      onClick={() => moveTo(step - 1)}
                      disabled={transitioning}
                    >
                      <ArrowLeft size={16} /> Back
                    </Button>
                  ) : (
                    <span />
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <SaveIndicator
                      state={saveState}
                      onRetry={retrySave}
                      className="welcome-save-indicator"
                    />
                    <Button
                      variant="primary"
                      className="welcome-primary-button"
                      onClick={() => moveTo(step + 1)}
                      disabled={!answered || transitioning}
                    >
                      {step + 1 === total ? "Enter DreamCollege!" : "Continue!"}
                      <ArrowRight size={17} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-lavender-800">
                  Your personalized plan is ready!
                </p>
                <h1 className="mx-auto mt-4 max-w-[13ch] font-display text-[clamp(3rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink">
                  {firstName ? `Welcome in, ${firstName}!` : "Welcome in!"}
                </h1>
                <p className="mx-auto mt-5 max-w-md text-base font-medium leading-relaxed text-ink-muted sm:text-lg">
                  Your dashboard is set up to help you find the right next step, at the right time. Let’s get started!
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <SaveIndicator
                    state={saveState}
                    onRetry={retrySave}
                    className="welcome-save-indicator"
                  />
                  <Button
                    variant="primary"
                    className="welcome-primary-button"
                    onClick={completeWelcome}
                    disabled={exiting}
                  >
                    Open my dashboard! <ArrowRight size={17} />
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
