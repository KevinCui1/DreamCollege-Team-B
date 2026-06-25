import { Check, Flame } from "lucide-react";
import {
  STREAK_CYCLE_DAYS,
  STREAK_MILESTONES,
} from "../context/CompletionContext";

type Props = {
  currentDay: number;
};

export default function StreakBar({ currentDay }: Props) {
  const progress = (currentDay / STREAK_CYCLE_DAYS) * 100;
  const latestMilestone = [...STREAK_MILESTONES]
    .reverse()
    .find((day) => currentDay >= day);

  return (
    <section className="mt-6 rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
            <Flame size={23} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Activity streak</p>
            <p className="text-sm text-slate-500">
              Complete an activity each day to keep it going.
            </p>
          </div>
        </div>
        <p className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
          Day {currentDay} of {STREAK_CYCLE_DAYS}
        </p>
      </div>

      <div className="relative mt-7">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {STREAK_MILESTONES.map((day) => {
          const reached = currentDay >= day;

          return (
            <div
              key={day}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(day / STREAK_CYCLE_DAYS) * 100}%` }}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  reached
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-300 bg-white text-slate-500"
                }`}
                aria-label={`Day ${day} milestone${reached ? " reached" : ""}`}
              >
                {reached ? <Check size={13} strokeWidth={3} /> : day}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3 h-5 text-xs font-medium text-slate-400">
        <span className="absolute left-0">0</span>
        {STREAK_MILESTONES.map((day) => (
          <span
            key={day}
            className={`absolute -translate-x-1/2 ${
              currentDay >= day ? "font-semibold text-purple-600" : ""
            }`}
            style={{ left: `${(day / STREAK_CYCLE_DAYS) * 100}%` }}
          >
            Day {day}
          </span>
        ))}
        <span className="absolute right-0">30</span>
      </div>

      {currentDay === STREAK_CYCLE_DAYS ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
          <Check size={16} />
          30-day cycle complete! Your next active day starts a new cycle.
        </p>
      ) : latestMilestone ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-purple-700">
          <Check size={16} />
          Day {latestMilestone} milestone reached
        </p>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Your first milestone is at day {STREAK_MILESTONES[0]}.
        </p>
      )}
    </section>
  );
}
