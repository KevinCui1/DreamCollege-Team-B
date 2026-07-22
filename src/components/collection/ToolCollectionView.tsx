import { useState } from "react";
import { CheckCircle2, PencilLine, Sparkle } from "lucide-react";
import type { NavGroup, NavItem } from "../../data/navigation";
import { useProfileSnapshot } from "../../context/StudentProfileContext";
import { reusedFieldsForTool } from "../../profile/completeness";
import Card, { SectionTitle } from "../ui/Card";
import Button from "../ui/Button";
import ProgressiveCollector from "./ProgressiveCollector";
import { summarizeField } from "./summarize";

/** First sentence of a nav item's purpose — a clean, student-facing summary. */
function shortPurpose(purpose: string): string {
  const firstClause = purpose.split(/;|—/)[0].trim();
  return firstClause.charAt(0).toUpperCase() + firstClause.slice(1);
}

/**
 * The information-collection entry state for a placeholder tool. It gathers only
 * what this tool needs (via ProgressiveCollector), then shows a calm "ready"
 * state — the actual LLM/feature output is intentionally not built here.
 */
export default function ToolCollectionView({
  group,
  item,
  done,
  onComplete,
}: {
  group: NavGroup;
  item: NavItem;
  done: boolean;
  onComplete: () => void;
}) {
  const snapshot = useProfileSnapshot();
  // Previously-completed tools land straight on their ready state.
  const [entered, setEntered] = useState(done);

  if (entered) {
    const reused = reusedFieldsForTool(item.slug, snapshot);
    return (
      <Card className="mt-8 p-7 sm:p-9">
        <div className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-lavender-100 px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.12em] text-lavender-800">
            <CheckCircle2 size={14} /> Ready
          </span>
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {item.label} has what it needs.
          </h2>
          <p className="max-w-prose font-body text-[15px] leading-relaxed text-ink-muted">
            We've saved everything for {item.label.toLowerCase()} to your profile
            and will reuse it here. The full {item.label} experience is coming
            soon — your inputs are ready and waiting.
          </p>

          {reused.length > 0 && (
            <div className="rounded-xl border border-lavender-200 bg-lavender-50 p-4">
              <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                What this tool will use
              </p>
              <ul className="flex flex-col gap-1.5">
                {reused.slice(0, 6).map((field) => (
                  <li
                    key={field.id}
                    className="flex items-center gap-2 font-body text-sm text-ink"
                  >
                    <Sparkle size={13} className="text-lavender-600" />
                    <span className="text-ink-muted">{field.label}:</span>{" "}
                    {summarizeField(field, snapshot)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="secondary" className="self-start" onClick={() => setEntered(false)}>
            <PencilLine size={16} /> Update your information
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-8 p-7 sm:p-9">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <SectionTitle eyebrow={group.label} as="h2">
            Let's set up {item.label}
          </SectionTitle>
          <p className="max-w-prose font-body text-[15px] leading-relaxed text-ink-muted">
            {shortPurpose(item.purpose)}. First, a few details make it genuinely
            useful — we'll only ask for what you haven't shared yet.
          </p>
        </div>

        <ProgressiveCollector
          slug={item.slug}
          toolLabel={item.label}
          onReady={() => {
            onComplete();
            setEntered(true);
          }}
        />
      </div>
    </Card>
  );
}
