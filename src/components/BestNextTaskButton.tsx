import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { activityPath } from "../data/navigation";
import BestNextTaskPanel from "./BestNextTaskPanel";

/** The Career Discovery Quiz must be complete before this appears. */
const QUIZ_PATH = activityPath("career-planning", "career-discovery-quiz");

/**
 * Floating control pinned next to the Reset Progress button. Hidden until the
 * Career Discovery Quiz is complete; opens the Best Next Task panel.
 */
export default function BestNextTaskButton() {
  const { isComplete } = useCompletion();
  const [open, setOpen] = useState(false);

  if (!isComplete(QUIZ_PATH)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Get your best next task"
        className="fixed bottom-4 right-56 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500 active:scale-95"
      >
        <Sparkles size={16} />
        Best Next Task
      </button>
      {open && <BestNextTaskPanel onClose={() => setOpen(false)} />}
    </>
  );
}
