/**
 * Career Discovery Quiz - a short, single-select questionnaire.
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
    prompt: "What sounds like your ideal lazy Sunday morning?",
    options: [
      { value: "building", label: "Taking something apart and fixing it, or building something with your hands" },
      { value: "analyzing", label: "Doing a puzzle, sudoku, or brain teaser over breakfast" },
      { value: "helping", label: "Hanging out or video-calling with friends and family" },
      { value: "creating", label: "Doodling, writing, or working on a creative project" },
    ],
  },
  {
    id: "subject",
    prompt: "You've got a free afternoon and no homework. What do you get lost in online?",
    options: [
      { value: "stem", label: "A video explaining how something works or a wild science fact" },
      { value: "humanities", label: "A gripping story, biography, or history deep-dive" },
      { value: "arts", label: "Something visually stunning, like art, music, or design" },
      { value: "business", label: "A video about how a company or product blew up" },
    ],
  },
  {
    id: "environment",
    prompt: "Which weekend plan sounds the most appealing?",
    options: [
      { value: "office", label: "Organizing your room or setting up a great desk setup" },
      { value: "outdoors", label: "Going for a hike, bike ride, or just being outside" },
      { value: "studio", label: "Working on a DIY, art, or design project" },
      { value: "anywhere", label: "Getting stuff done from a coffee shop, park, or wherever you feel like" },
    ],
  },
  {
    id: "motivation",
    prompt: "You just found $20 you forgot about. What's your first instinct?",
    options: [
      { value: "impact", label: "Use it to help someone out or donate it" },
      { value: "stability", label: "Save it for something bigger later" },
      { value: "creativity", label: "Spend it on supplies or a gadget to make something" },
      { value: "growth", label: "Put it toward a book, course, or something that teaches you a new skill" },
    ],
  },
  {
    id: "strength",
    prompt: "Your friend group is planning a trip and it's total chaos. What's your natural role?",
    options: [
      { value: "leadership", label: "The one who makes the plan and keeps everyone on track" },
      { value: "problem-solving", label: "The one who figures out a fix when something goes wrong" },
      { value: "communication", label: "The one who smooths things over and keeps everyone happy" },
      { value: "creativity", label: "The one who comes up with the fun, unique ideas" },
    ],
  },
];

/** Total number of quiz questions, used to gate completion. */
export const totalQuizQuestions = quizQuestions.length;
