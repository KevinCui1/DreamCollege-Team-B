import { Link, NavLink } from "react-router-dom";
import { Map, Menu } from "lucide-react";
import { navigation } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import NavGroup from "./NavGroup";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { completedCount, totalCount } = useCompletion();
  const { earnedMilestoneCount, totalMilestoneCount } = useAchievement();
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <aside
      className={`flex h-full flex-col border-r border-white/50 bg-white/60 backdrop-blur-xl transition-all duration-200 ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-900/[0.06] px-4 py-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-900/[0.04] hover:text-slate-700"
        >
          <Menu size={22} />
        </button>
        {!collapsed && (
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-slate-900"
          >
            Student Dashboard
          </Link>
        )}
      </div>

      {!collapsed && (
        <>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <NavLink
              to="/achievements"
              end
              className={({ isActive }) =>
                `mb-3 flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold transition ${
                  isActive
                    ? "bg-violet-600 text-white shadow-card"
                    : "border border-slate-900/[0.06] bg-white/40 text-slate-700 hover:bg-white/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Map
                    size={20}
                    strokeWidth={2}
                    className={isActive ? "text-white" : "text-slate-500"}
                  />
                  <span className="flex-1">Achievement Map</span>
                  <span
                    className={`text-xs font-normal ${
                      isActive ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {earnedMilestoneCount}/{totalMilestoneCount}
                  </span>
                </>
              )}
            </NavLink>

            {navigation.map((group) => (
              <NavGroup key={group.slug} group={group} />
            ))}
          </nav>

          <div className="border-t border-slate-900/[0.06] px-4 py-4">
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-500">
              <span>Progress</span>
              <span className="text-violet-700">
                {completedCount} of {totalCount} complete
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/[0.06]">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
