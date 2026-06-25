import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import { milestones, type GradeLevel } from "../data/achievements";
import { useAchievement } from "../context/AchievementContext";

const GRADES: GradeLevel[] = [9, 10, 11, 12];
const GRADE_LABELS: Record<GradeLevel, string> = {
  9: "9th Grade",
  10: "10th Grade",
  11: "11th Grade",
  12: "12th Grade",
};

type MilestoneStatus = "earned" | "active" | "locked";

export default function AchievementMap() {
  const {
    isMilestoneEarned,
    earnedMilestoneCount,
    totalMilestoneCount,
    gradeAchievements,
    toggleGradeAchievement,
    addGradeAchievement,
    removeGradeAchievement,
  } = useAchievement();

  const [activeGrade, setActiveGrade] = useState<GradeLevel>(9);
  const [newGoalText, setNewGoalText] = useState("");

  const getMilestoneStatus = (index: number): MilestoneStatus => {
    const milestone = milestones[index];
    if (isMilestoneEarned(milestone.id)) return "earned";
    if (index === 0 || isMilestoneEarned(milestones[index - 1].id)) return "active";
    return "locked";
  };

  const gradeItems = gradeAchievements.filter((a) => a.gradeLevel === activeGrade);
  const gradeCompleted = gradeItems.filter((a) => a.completed).length;
  const overallPct =
    totalMilestoneCount === 0
      ? 0
      : Math.round((earnedMilestoneCount / totalMilestoneCount) * 100);

  const handleAdd = () => {
    const text = newGoalText.trim();
    if (!text) return;
    addGradeAchievement(activeGrade, text);
    setNewGoalText("");
  };

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Achievement Map</h1>
        <p className="mt-2 text-slate-500">
          Your personalized path from freshman year to college acceptance — complete
          each step to unlock the next.
        </p>
      </div>

      {/* Progress summary */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm opacity-90">Milestones Complete</p>
            <p className="mt-1 text-4xl font-bold">
              {earnedMilestoneCount}
              <span className="text-xl font-medium opacity-80">
                {" "}
                / {totalMilestoneCount}
              </span>
            </p>
          </div>
          <p className="text-3xl font-bold">{overallPct}%</p>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Milestone path */}
      <section className="mb-14">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">Your Journey</h2>

        <div>
          {milestones.map((milestone, idx) => {
            const status = getMilestoneStatus(idx);
            const Icon = milestone.icon;
            const isLast = idx === milestones.length - 1;

            return (
              <div key={milestone.id} className="flex gap-5">
                {/* Node + vertical connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
                      status === "earned"
                        ? "border-emerald-400 bg-emerald-500"
                        : status === "active"
                          ? "border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-600"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    {status === "earned" ? (
                      <CheckCircle2 size={22} className="text-white" />
                    ) : status === "locked" ? (
                      <Lock size={15} className="text-slate-300" />
                    ) : (
                      <Icon size={19} className="text-white" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`mt-1 w-0.5 flex-1 min-h-6 rounded-full transition-colors duration-300 ${
                        status === "earned" ? "bg-emerald-200" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content card */}
                <div
                  className={`mb-4 flex-1 rounded-2xl border p-5 shadow-sm transition-opacity duration-300 ${
                    status === "earned"
                      ? "border-emerald-200 bg-emerald-50"
                      : status === "active"
                        ? "border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50"
                        : "border-slate-200 bg-white opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            status === "earned"
                              ? "text-emerald-600"
                              : status === "active"
                                ? "text-indigo-600"
                                : "text-slate-400"
                          }`}
                        >
                          Step {milestone.order}
                        </span>
                        {status === "earned" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <Trophy size={10} />
                            Complete
                          </span>
                        )}
                        {status === "active" && (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                            Up Next
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-base font-semibold ${
                          status === "locked" ? "text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        className={`mt-0.5 text-sm ${
                          status === "locked" ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {milestone.description}
                      </p>
                    </div>

                    {status === "active" && (
                      <Link
                        to={milestone.triggerPath}
                        className="flex flex-shrink-0 items-center gap-1.5 self-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
                      >
                        Start <ArrowRight size={14} />
                      </Link>
                    )}
                    {status === "earned" && (
                      <div className="flex-shrink-0 self-center rounded-full bg-emerald-100 p-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grade-level achievements */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-800">Four Year Plan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track and customize your goals for each year of high school.
          </p>
        </div>

        {/* Grade tabs */}
        <div className="mb-5 flex gap-2">
          {GRADES.map((grade) => {
            const items = gradeAchievements.filter((a) => a.gradeLevel === grade);
            const done = items.filter((a) => a.completed).length;
            const isActive = activeGrade === grade;
            return (
              <button
                key={grade}
                type="button"
                onClick={() => setActiveGrade(grade)}
                className={`flex flex-1 flex-col items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{GRADE_LABELS[grade]}</span>
                <span
                  className={`mt-0.5 text-xs font-normal ${
                    isActive ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {done}/{items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Achievement list */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="font-semibold text-slate-800">
                {GRADE_LABELS[activeGrade]} Goals
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {gradeCompleted} of {gradeItems.length} completed
              </p>
            </div>
            {gradeItems.length > 0 && (
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${Math.round((gradeCompleted / gradeItems.length) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>

          <ul className="divide-y divide-slate-100">
            {gradeItems.map((a) => (
              <li key={a.id} className="group flex items-center gap-3 px-6 py-3">
                <button
                  type="button"
                  onClick={() => toggleGradeAchievement(a.id)}
                  className="flex-shrink-0 transition"
                  aria-label={a.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {a.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  ) : (
                    <Circle size={20} className="text-slate-300 hover:text-indigo-400 transition" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm leading-snug ${
                    a.completed
                      ? "text-slate-400 line-through decoration-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {a.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeGradeAchievement(a.id)}
                  aria-label="Remove goal"
                  className="flex-shrink-0 rounded-lg p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-500"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {gradeItems.length === 0 && (
              <li className="px-6 py-10 text-center text-sm text-slate-400">
                No goals yet — add your first goal below.
              </li>
            )}
          </ul>

          {/* Add goal */}
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder={`Add a goal for ${GRADE_LABELS[activeGrade]}…`}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newGoalText.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
