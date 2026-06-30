/**
 * Career Discovery Quiz — a short, single-select questionnaire.
 * Answers are stored by question `id` and feed the Best Next Task recommendation.
 * Keep this list small and approachable; it is the only quiz in the app.
 */
export type QuizOption = {
  /** Stored value for this answer. */
  value: string;
  /** Label shown to the student. */
  label: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "work-style",
    prompt: "Which way of working sounds most like you?",
    options: [
      { value: "building", label: "Building or fixing things hands-on" },
      { value: "analyzing", label: "Analyzing data and solving puzzles" },
      { value: "helping", label: "Helping and working with people" },
      { value: "creating", label: "Creating and designing new things" },
    ],
  },
  {
    id: "subject",
    prompt: "Which school subject do you enjoy the most?",
    options: [
      { value: "stem", label: "Math & Science" },
      { value: "humanities", label: "English & History" },
      { value: "arts", label: "Art, Music & Design" },
      { value: "business", label: "Business & Economics" },
    ],
  },
  {
    id: "environment",
    prompt: "Where would you most like to work someday?",
    options: [
      { value: "office", label: "An office or lab" },
      { value: "outdoors", label: "Outdoors or in the field" },
      { value: "studio", label: "A studio or creative space" },
      { value: "anywhere", label: "Anywhere — remote / flexible" },
    ],
  },
  {
    id: "motivation",
    prompt: "What matters most to you in a future career?",
    options: [
      { value: "impact", label: "Making a positive impact" },
      { value: "stability", label: "Stability and good income" },
      { value: "creativity", label: "Creative freedom" },
      { value: "growth", label: "Learning and advancement" },
    ],
  },
  {
    id: "strength",
    prompt: "Which strength describes you best?",
    options: [
      { value: "leadership", label: "Leadership & organization" },
      { value: "problem-solving", label: "Problem solving" },
      { value: "communication", label: "Communication" },
      { value: "creativity", label: "Creativity & imagination" },
    ],
  },
];

/** Total number of quiz questions — used to gate completion. */
export const totalQuizQuestions = quizQuestions.length;
