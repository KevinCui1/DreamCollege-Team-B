import { navigation, activityPath } from "../data/navigation";
import { quizQuestions } from "../data/quiz";
import type { QuizAnswers, StudentProfile } from "../context/StudentProfileContext";

export type RoadmapEntryCategory =
  | "career"
  | "academic"
  | "college"
  | "application"
  | "financial"
  | "personal";

export type RoadmapEntry = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  category: RoadmapEntryCategory;
};

/**
 * The "best next step" recommendation, folded into the timeline instead of
 * living in its own panel. Optional so a roadmap generated before the backend
 * returns this field still renders fine (no recommendation card shown).
 */
export type RoadmapRecommendation = {
  bestTask: string;
  why: string;
  appTool: string;
  missingInfo: string[];
};

export type GeneratedRoadmap = {
  entries: RoadmapEntry[];
  recommendation?: RoadmapRecommendation;
  generatedAt: string;
};

export const ROADMAP_STORAGE_KEY = "crew-b:ai-roadmap";

export function loadRoadmap(): GeneratedRoadmap | null {
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return null;
    return parsed as GeneratedRoadmap;
  } catch {
    return null;
  }
}

export function saveRoadmap(roadmap: GeneratedRoadmap): void {
  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap));
  } catch {
    // Ignore storage failures.
  }
}

export type RoadmapContext = {
  quiz: { question: string; answer: string }[];
  profile: {
    gradeLevel: string;
    gpa: string;
    apCount: string;
    interests: string;
    goals: string;
    constraints: string;
  };
  completedActivities: string[];
  /** Everything not yet done — helps the LLM avoid recommending finished work. */
  incompleteActivities: string[];
  /**
   * The single most recently completed activity, if this call was triggered
   * by a step being checked off. Lets the backend weight that signal heavily
   * when deciding how to update the plan, rather than treating it as just
   * one more entry in `completedActivities`.
   */
  lastCompletedActivity: string | null;
};

export function buildRoadmapContext(args: {
  quizAnswers: QuizAnswers | null;
  profile: StudentProfile;
  isComplete: (path: string) => boolean;
  lastCompletedActivity?: string | null;
}): RoadmapContext {
  const completedActivities: string[] = [];
  const incompleteActivities: string[] = [];

  for (const group of navigation) {
    for (const item of group.items) {
      const path = activityPath(group.slug, item.slug);
      if (args.isComplete(path)) completedActivities.push(item.label);
      else incompleteActivities.push(item.label);
    }
  }

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
    lastCompletedActivity: args.lastCompletedActivity ?? null,
  };
}

export async function requestRoadmap(
  context: RoadmapContext,
): Promise<GeneratedRoadmap> {
  let res: Response;
  try {
    res = await fetch("/api/generate-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context }),
    });
  } catch {
    throw new Error(
      "Could not reach the roadmap service. Is the dev server running?",
    );
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Fall through to status-based error handling.
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      `Request failed (${res.status}).`;
    throw new Error(message);
  }

  const result = data as {
    entries?: unknown[];
    recommendation?: unknown;
  } | null;

  if (!result || !Array.isArray(result.entries)) {
    throw new Error("The roadmap response was not in the expected format.");
  }

  return {
    entries: result.entries as RoadmapEntry[],
    recommendation: result.recommendation
      ? (result.recommendation as RoadmapRecommendation)
      : undefined,
    generatedAt: new Date().toISOString(),
  };
}
