import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CheckCircle2, ChevronDown, Circle } from "lucide-react";
import type { NavGroup as NavGroupType } from "../data/navigation";
import { activityPath } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";

type Props = {
  group: NavGroupType;
  defaultOpen?: boolean;
};

export default function NavGroup({ group, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { isComplete } = useCompletion();
  const Icon = group.icon;

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl bg-lavender-50 px-4 py-2.5 text-left text-ink transition hover:bg-lavender-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400"
      >
        <span className="flex items-center gap-3 font-display font-semibold">
          <Icon size={18} strokeWidth={2} className="text-lavender-500" />
          {group.label}
        </span>
        <ChevronDown
          size={18}
          className={`text-lavender-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5 pl-3">
          {group.items.map((item) => {
            const path = activityPath(group.slug, item.slug);
            const done = isComplete(path);
            return (
              <li key={item.slug}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 ${
                      isActive
                        ? "bg-lavender-100 font-semibold text-lavender-700"
                        : "text-ink-muted hover:bg-lavender-50 hover:text-ink"
                    }`
                  }
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Circle size={16} className="text-lavender-300" />
                  )}
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
