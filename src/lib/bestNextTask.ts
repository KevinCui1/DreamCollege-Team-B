import { navigation, activityPath } from "../data/navigation";
import type { QuizAnswers, StudentProfile } from "../context/StudentProfileContext";
import { quizQuestions } from "../data/quiz";

/** Shape of the recommendation returned by the backend. */
export type BestNextTaskResult = {
  bestTask: string;
  why: string;
  appTool: string;
  missingInfo: string[];
};

/** Everything the backend needs to build the Claude prompt. */
export type BestNextTaskContext = {
  quiz: { question: string; answer: string }[];
  profile: StudentProfile;
  completedActivities: string[];
  incompleteActivities: string[];
  earnedMilestones: string[];
  nextMilestone: string | null;
  gradeGoals: { grade: number; title: string; completed: boolean }[];
  currentRank: string;
  availableTools: { label: string; path: string; group: string }[];
};

/** Inputs gathered from the various contexts to assemble the request body. */
export type BuildContextArgs = {
  quizAnswers: QuizAnswers | null;
  profile: StudentProfile;
  isComplete: (path: string) => boolean;
  earnedMilestoneTitles: string[];
  nextMilestoneTitle: string | null;
  gradeGoals: { gradeLevel: number; title: string; completed: boolean }[];
  currentRank: string;
};

/**
 * Assemble the student-context payload from app state. The list of available
 * tools is derived from `navigation` so it stays in sync with the sidebar.
 */
export function buildBestNextTaskContext(
  args: BuildContextArgs,
): BestNextTaskContext {
  const completedActivities: string[] = [];
  const incompleteActivities: string[] = [];
  const availableTools: BestNextTaskContext["availableTools"] = [];

  for (const group of navigation) {
    for (const item of group.items) {
      const path = activityPath(group.slug, item.slug);
      availableTools.push({
        label: item.label,
        path,
        group: group.label,
      });
      if (args.isComplete(path)) completedActivities.push(item.label);
      else incompleteActivities.push(item.label);
    }
  }
  // The Achievement Map / Four Year Plan is a real app surface too.
  availableTools.push({
    label: "Achievement Map (Four Year Plan)",
    path: "/achievements",
    group: "Planning",
  });

  const quiz = quizQuestions
    .map((q) => {
      const value = args.quizAnswers?.[q.id];
      const answer = q.options.find((o) => o.value === value)?.label;
      return answer ? { question: q.prompt, answer } : null;
    })
    .filter((x): x is { question: string; answer: string } => x !== null);

  return {
    quiz,
    profile: args.profile,
    completedActivities,
    incompleteActivities,
    earnedMilestones: args.earnedMilestoneTitles,
    nextMilestone: args.nextMilestoneTitle,
    gradeGoals: args.gradeGoals.map((g) => ({
      grade: g.gradeLevel,
      title: g.title,
      completed: g.completed,
    })),
    currentRank: args.currentRank,
    availableTools,
  };
}

/**
 * POST the context to the secure backend endpoint and return the parsed
 * recommendation. Throws an Error with a readable message on failure.
 */
export async function requestBestNextTask(
  context: BestNextTaskContext,
): Promise<BestNextTaskResult> {
  let res: Response;
  try {
    res = await fetch("/api/best-next-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context }),
    });
  } catch {
    throw new Error(
      "Could not reach the recommendation service. Is the dev server running?",
    );
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Fall through to status-based error handling below.
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      `Request failed (${res.status}).`;
    throw new Error(message);
  }

  const result = data as Partial<BestNextTaskResult> | null;
  if (!result || typeof result.bestTask !== "string") {
    throw new Error("The recommendation response was not in the expected format.");
  }
  return {
    bestTask: result.bestTask,
    why: result.why ?? "",
    appTool: result.appTool ?? "",
    missingInfo: Array.isArray(result.missingInfo) ? result.missingInfo : [],
  };
}
