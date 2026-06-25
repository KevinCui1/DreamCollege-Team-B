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
      className={`flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1 text-slate-600 transition hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
        {!collapsed && (
          <Link to="/" className="text-lg font-bold text-slate-800">
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
                `mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Map
                    size={20}
                    strokeWidth={2}
                    className={isActive ? "text-white" : "text-indigo-600"}
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

          <div className="border-t border-slate-200 px-4 py-4">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-500">
              <span>Progress</span>
              <span>
                {completedCount} of {totalCount} complete
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
