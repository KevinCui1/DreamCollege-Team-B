import { type LucideIcon, Check, Pencil } from "lucide-react";

export type StepMeta = {
  label: string;
  icon: LucideIcon;
};

/**
 * Left rail for the College Profile wizard. Mirrors the screenshots: a
 * "Step X of N" eyebrow, a vertical list of nodes joined by a connector line,
 * with check circles for visited steps, a ring for the active one, and an
 * "Edit again" affordance on any step already reached.
 */
export default function Stepper({
  steps,
  current,
  maxReached,
  onSelect,
}: {
  steps: StepMeta[];
  current: number;
  /** Highest step index the user has advanced to (drives visited styling). */
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Profile steps" className="w-full">
      <p className="mb-6 text-sm font-bold text-indigo-600">
        Step {current + 1} of {steps.length}
      </p>
      <ol className="relative">
        {steps.map((step, i) => {
          const isCurrent = i === current;
          const isVisited = i <= maxReached && !isCurrent;
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Connector line between this node and the next. */}
              {!isLast && (
                <span
                  className={`absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-px ${
                    i < current ? "bg-indigo-400" : "bg-slate-200"
                  }`}
                />
              )}
              <div className="relative z-10 flex-none">
                {isCurrent ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
                  </span>
                ) : isVisited ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Check size={20} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Icon size={20} />
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className="cursor-pointer pt-1.5 text-left"
              >
                <span
                  className={`block text-lg font-semibold ${
                    isCurrent ? "text-slate-800" : "text-slate-700"
                  }`}
                >
                  {step.label}
                  {i > 0 && <span className="ml-1 text-red-400">*</span>}
                </span>
                {isVisited && !isCurrent && (
                  <span className="mt-0.5 flex items-center gap-1 text-sm text-slate-400">
                    Edit again <Pencil size={12} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
