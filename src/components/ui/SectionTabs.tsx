import { cn } from "./cn";

export type SectionTab = {
  id: string;
  label: string;
  /** Optional completion hint, e.g. "6/9". */
  hint?: string;
};

/**
 * Planner-divider tabs for the College Profile review hub. Keyboard-operable
 * (roving arrow keys), current tab marked with aria-selected. Not pill nav.
 */
export default function SectionTabs({
  tabs,
  activeId,
  onChange,
  className,
}: {
  tabs: SectionTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const activeIndex = tabs.findIndex((t) => t.id === activeId);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKey}
      className={cn(
        "flex flex-wrap gap-x-1 gap-y-2 border-b border-line",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px flex items-center gap-2 rounded-t-lg border-b-2 px-3.5 py-2.5",
              "font-body text-sm font-semibold outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-evergreen focus-visible:ring-offset-1 focus-visible:ring-offset-paper",
              active
                ? "border-marigold text-graphite"
                : "border-transparent text-graphite-muted hover:text-graphite",
            )}
          >
            {tab.label}
            {tab.hint ? (
              <span className="rounded-full bg-paper-deep px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-graphite-muted">
                {tab.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
