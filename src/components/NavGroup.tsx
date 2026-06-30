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
        className="flex w-full items-center justify-between rounded-lg border border-slate-900/[0.06] bg-white/50 px-4 py-2.5 text-left text-slate-700 transition hover:bg-white/70"
      >
        <span className="flex items-center gap-3 font-display font-semibold">
          <Icon size={18} strokeWidth={2} className="text-slate-500" />
          {group.label}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
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
                    `flex items-center gap-2 rounded-md px-3 py-2 text-[15px] transition ${
                      isActive
                        ? "bg-white/70 font-semibold text-violet-700"
                        : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                    }`
                  }
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Circle size={16} className="text-slate-300" />
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
