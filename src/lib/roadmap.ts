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
 *
 * `sectionId` is the slug of the app section the LLM is routing the student to
 * (e.g. "positioning-statement"), resolved to a link via `findSectionBySlug`.
 */
export type RoadmapRecommendation = {
  bestTask: string;
  why: string;
  sectionId: string;
  missingInfo: string[];
};

/**
 * A secondary "also recommended" section pick, shown in a smaller slot beneath
 * the single highlighted best next step.
 */
export type SectionPick = {
  sectionId: string;
  why: string;
};

export type GeneratedRoadmap = {
  entries: RoadmapEntry[];
  recommendation?: RoadmapRecommendation;
  sectionPicks?: SectionPick[];
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

export function clearRoadmap(): void {
  try {
    localStorage.removeItem(ROADMAP_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

/**
 * One section of the app the LLM can route the student to, with a description
 * of what it's for. This is the catalog the "best next step" recommendation
 * and section picks must choose from.
 */
export type AvailableSection = {
  id: string;
  label: string;
  path: string;
  group: string;
  purpose: string;
  done: boolean;
};

export type RoadmapContext = {
  quiz: { question: string; answer: string }[];
  profile: StudentProfile;
  /** Every app section with its purpose + completion state — the LLM routes from this. */
  availableSections: AvailableSection[];
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
  const availableSections: AvailableSection[] = [];

  for (const group of navigation) {
    for (const item of group.items) {
      const path = activityPath(group.slug, item.slug);
      const done = args.isComplete(path);
      if (done) completedActivities.push(item.label);
      else incompleteActivities.push(item.label);
      availableSections.push({
        id: item.slug,
        label: item.label,
        path,
        group: group.label,
        purpose: item.purpose,
        done,
      });
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
    availableSections,
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
    sectionPicks?: unknown[];
  } | null;

  if (!result || !Array.isArray(result.entries)) {
    throw new Error("The roadmap response was not in the expected format.");
  }

  return {
    entries: result.entries as RoadmapEntry[],
    recommendation: result.recommendation
      ? (result.recommendation as RoadmapRecommendation)
      : undefined,
    sectionPicks: Array.isArray(result.sectionPicks)
      ? (result.sectionPicks as SectionPick[])
      : undefined,
    generatedAt: new Date().toISOString(),
  };
}
