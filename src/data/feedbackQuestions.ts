export type QuestionType = "rating" | "choice" | "thumbs";

export type FeedbackQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
};

export type FeedbackItem = {
  /** Unique key used for de-duplication within a session. */
  id: string;
  title: string;
  subtitle: string;
  questions: FeedbackQuestion[];
};

export const quizFeedback: FeedbackItem = {
  id: "quiz-complete",
  title: "How was the quiz?",
  subtitle: "Career Discovery Quiz",
  questions: [
    {
      id: "accuracy",
      text: "How well did the quiz reflect your real interests?",
      type: "rating",
    },
    {
      id: "clarity",
      text: "Were the questions easy to understand?",
      type: "choice",
      options: ["Very clear", "Mostly clear", "Confusing"],
    },
  ],
};

export const roadmapFeedback: FeedbackItem = {
  id: "roadmap-generated",
  title: "About your roadmap",
  subtitle: "AI College Roadmap",
  questions: [
    {
      id: "relevance",
      text: "How relevant is this roadmap to your actual situation?",
      type: "rating",
    },
    {
      id: "reflective",
      text: "Do the suggestions reflect what you told us?",
      type: "choice",
      options: ["Yes, exactly", "Mostly", "Not really"],
    },
    {
      id: "missing",
      text: "Is there anything important missing from your plan?",
      type: "choice",
      options: ["No, it looks complete", "A few gaps", "A lot is missing"],
    },
  ],
};

export const bestNextTaskFeedback: FeedbackItem = {
  id: "best-next-task",
  title: "About this recommendation",
  subtitle: "Best Next Task · AI",
  questions: [
    {
      id: "right-step",
      text: "Does this feel like the right next step for you?",
      type: "choice",
      options: ["Yes", "Somewhat", "Not really"],
    },
    {
      id: "confidence",
      text: "How confident are you in this AI recommendation?",
      type: "rating",
    },
  ],
};

export function activityFeedback(
  activityPath: string,
  activityLabel: string,
): FeedbackItem {
  return {
    id: `activity-complete:${activityPath}`,
    title: "Quick feedback",
    subtitle: activityLabel,
    questions: [
      {
        id: "useful",
        text: "Was this activity useful for your college planning?",
        type: "thumbs",
      },
      {
        id: "difficulty",
        text: "How was the difficulty level?",
        type: "choice",
        options: ["Too easy", "Just right", "Too hard"],
      },
    ],
  };
}
