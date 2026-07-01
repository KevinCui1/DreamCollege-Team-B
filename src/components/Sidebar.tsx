import { Link, NavLink } from "react-router-dom";
import { GraduationCap, LayoutDashboard, Map, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { navigation, activityPath } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import { useRank } from "../context/RankContext";
import NavGroup from "./NavGroup";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { completedCount, totalCount } = useCompletion();
  const { earnedMilestoneCount, totalMilestoneCount } = useAchievement();
  const { currentRank } = useRank();
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <aside
      className={`flex h-full flex-col border-r border-lavender-200/70 bg-white/80 backdrop-blur-xl transition-all duration-200 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* ── Identity block ── */}
      <div className="border-b border-lavender-200/70 px-3 py-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/"
              aria-label="College Journey home"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-700 text-white shadow-soft"
            >
              <GraduationCap size={22} strokeWidth={2.25} />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="rounded-lg p-1.5 text-lavender-500 transition hover:bg-lavender-100 hover:text-lavender-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400"
            >
              <PanelLeftOpen size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="College Journey home"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-700 text-white shadow-soft"
            >
              <GraduationCap size={22} strokeWidth={2.25} />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lavender-500">
                College Journey
              </p>
              <p className="truncate font-display text-base font-bold leading-tight text-ink">
                {currentRank.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="rounded-lg p-1.5 text-lavender-500 transition hover:bg-lavender-100 hover:text-lavender-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      {collapsed ? (
        <CollapsedRail />
      ) : (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 ${
                isActive
                  ? "bg-gradient-to-br from-lavender-600 to-lavender-700 text-white shadow-soft"
                  : "text-ink-muted hover:bg-lavender-50 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard
                  size={20}
                  strokeWidth={2}
                  className={isActive ? "text-white" : "text-lavender-500"}
                />
                Dashboard
              </>
            )}
          </NavLink>

          <NavLink
            to="/achievements"
            end
            className={({ isActive }) =>
              `mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 ${
                isActive
                  ? "bg-gradient-to-br from-lavender-600 to-lavender-700 text-white shadow-soft"
                  : "text-ink-muted hover:bg-lavender-50 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Map
                  size={20}
                  strokeWidth={2}
                  className={isActive ? "text-white" : "text-lavender-500"}
                />
                <span className="flex-1">Achievement Map</span>
                <span
                  className={`text-xs font-semibold ${
                    isActive ? "text-white/75" : "text-lavender-400"
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
      )}

      {/* ── Progress footer ── */}
      <div className="border-t border-lavender-200/70 px-4 py-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold tabular-nums text-lavender-700">
              {pct}%
            </span>
            <div
              className="relative h-16 w-2 overflow-hidden rounded-full bg-lavender-100"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall progress"
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-lavender-600 to-lavender-400 transition-all"
                style={{ height: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-muted">
              <span>Progress</span>
              <span className="text-lavender-700">
                {completedCount} of {totalCount} complete
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-lavender-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lavender-500 to-lavender-700 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ── Collapsed icon rail ──────────────────────────────────────────────────────
// Keeps every destination reachable when collapsed (the old sidebar hid all nav).
// Group icons link to the group's first activity.

function CollapsedRail() {
  const { earnedMilestoneCount } = useAchievement();

  const railClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex h-11 w-11 items-center justify-center rounded-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 ${
      isActive
        ? "bg-gradient-to-br from-lavender-600 to-lavender-700 text-white shadow-soft"
        : "text-lavender-600 hover:bg-lavender-100"
    }`;

  return (
    <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-4">
      <NavLink to="/" end className={railClass} title="Dashboard" aria-label="Dashboard">
        <LayoutDashboard size={20} strokeWidth={2} />
      </NavLink>

      <NavLink
        to="/achievements"
        end
        className={railClass}
        title="Achievement Map"
        aria-label="Achievement Map"
      >
        <Map size={20} strokeWidth={2} />
        {earnedMilestoneCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-white">
            {earnedMilestoneCount}
          </span>
        )}
      </NavLink>

      <div className="my-1.5 h-px w-8 bg-lavender-200/70" />

      {navigation.map((group) => {
        const Icon = group.icon;
        const first = group.items[0];
        return (
          <NavLink
            key={group.slug}
            to={activityPath(group.slug, first.slug)}
            className={railClass}
            title={group.label}
            aria-label={group.label}
          >
            <Icon size={20} strokeWidth={2} />
          </NavLink>
        );
      })}
    </nav>
  );
}
