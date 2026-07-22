import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  useStudentProfile,
  useProfileSnapshot,
} from "../context/StudentProfileContext";
import { THEME_META, type Theme } from "../profile/schema";
import { fieldsByTheme } from "../profile/fields";
import { themeCompletion, overallCompletion } from "../profile/completeness";
import Card, { SectionTitle } from "./ui/Card";
import Button from "./ui/Button";
import SaveIndicator from "./ui/SaveIndicator";
import SectionTabs, { type SectionTab } from "./ui/SectionTabs";
import ProgressRibbon from "./ui/ProgressRibbon";
import FieldControl from "./collection/FieldControl";

const THEME_ORDER: Theme[] = [
  "identity",
  "education",
  "testing",
  "career",
  "preferences",
  "awards",
  "activities",
];

/**
 * The College Profile as a calm review/edit hub — themed sections, live
 * completeness, inline editing. Not a forced six-page gate: the student can dip
 * into any section, and every field here is the same one reused across tools.
 */
export default function CollegeProfileHub({
  done,
  onComplete,
}: {
  done: boolean;
  onComplete: () => void;
}) {
  const { applicationProfile, answerField, updateApplicationProfile, saveState, retrySave } =
    useStudentProfile();
  const snapshot = useProfileSnapshot();
  const [active, setActive] = useState<Theme>("identity");

  const tabs: SectionTab[] = useMemo(
    () =>
      THEME_ORDER.map((theme) => {
        const { answered, total } = themeCompletion(theme, snapshot);
        return { id: theme, label: THEME_META[theme].label, hint: `${answered}/${total}` };
      }),
    [snapshot],
  );

  const overall = overallCompletion(snapshot);
  const fields = fieldsByTheme(active);

  return (
    <div className="mt-8 flex flex-col gap-6">
      <Card className="p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionTitle eyebrow="Your profile" as="h2">
                Everything, in one calm place
              </SectionTitle>
              <p className="mt-2 max-w-prose font-body text-[15px] leading-relaxed text-graphite-muted">
                Review or update anything here. There's no need to fill it all at
                once — each tool asks for what it needs, when it needs it.
              </p>
            </div>
            <SaveIndicator state={saveState} onRetry={retrySave} />
          </div>
          <ProgressRibbon
            current={overall.answered}
            total={overall.total}
            label={`${overall.answered} of ${overall.total} details added`}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <SectionTabs tabs={tabs} activeId={active} onChange={(id) => setActive(id as Theme)} />

        <div className="mt-6 flex flex-col gap-3">
          <p className="font-body text-sm text-graphite-muted">
            {THEME_META[active].blurb}
          </p>
          <div className="flex flex-col gap-7">
            {fields.map((field) => (
              <FieldControl
                key={field.id}
                field={field}
                app={applicationProfile}
                quizTaken={snapshot.quiz !== null}
                onAnswer={answerField}
                onPatch={updateApplicationProfile}
              />
            ))}
          </div>
        </div>
      </Card>

      {!done && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onComplete}>
            <CheckCircle2 size={16} /> Mark my profile as reviewed
          </Button>
        </div>
      )}
    </div>
  );
}
