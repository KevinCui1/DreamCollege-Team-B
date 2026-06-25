import {
  User,
  Compass,
  Calendar,
  School,
  Award,
  BookOpen,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type MilestoneId =
  | "user-profile"
  | "career-discovery"
  | "four-year-plan"
  | "college-search"
  | "scholarship-search"
  | "college-application"
  | "recommendation-letters";

export type GradeLevel = 9 | 10 | 11 | 12;

export type MilestoneAchievement = {
  id: MilestoneId;
  title: string;
  description: string;
  icon: LucideIcon;
  triggerPath: string;
  order: number;
};

export type GradeAchievement = {
  id: string;
  gradeLevel: GradeLevel;
  title: string;
  completed: boolean;
};

export const milestones: MilestoneAchievement[] = [
  {
    id: "user-profile",
    title: "Complete Your Profile",
    description: "Set up your college profile to personalize your journey.",
    icon: User,
    triggerPath: "/college-planning/college-profile",
    order: 1,
  },
  {
    id: "career-discovery",
    title: "Career Discovery Quiz",
    description: "Take the quiz to uncover your strengths and ideal career paths.",
    icon: Compass,
    triggerPath: "/career-planning/career-discovery-quiz",
    order: 2,
  },
  {
    id: "four-year-plan",
    title: "Build Your Four Year Plan",
    description: "Map your entire high school journey with a personalized academic plan.",
    icon: Calendar,
    triggerPath: "/career-planning/high-school-plan",
    order: 3,
  },
  {
    id: "college-search",
    title: "College Search",
    description: "Explore colleges that align with your goals and aspirations.",
    icon: School,
    triggerPath: "/college-planning/colleges",
    order: 4,
  },
  {
    id: "scholarship-search",
    title: "Scholarship Search",
    description: "Discover scholarships and funding opportunities for your education.",
    icon: Award,
    triggerPath: "/college-planning/scholarships",
    order: 5,
  },
  {
    id: "college-application",
    title: "Add Colleges to Apply",
    description: "Finalize your shortlist and begin your college applications.",
    icon: BookOpen,
    triggerPath: "/college-planning/shortlist",
    order: 6,
  },
  {
    id: "recommendation-letters",
    title: "Recommendation Letters",
    description: "Request and manage letters of recommendation from your mentors.",
    icon: Mail,
    triggerPath: "/college-application/recommendation-letter",
    order: 7,
  },
];

export const defaultGradeAchievements: GradeAchievement[] = [
  // 9th Grade
  { id: "9-1", gradeLevel: 9, title: "Join a club or extracurricular activity", completed: false },
  { id: "9-2", gradeLevel: 9, title: "Meet with your school counselor", completed: false },
  { id: "9-3", gradeLevel: 9, title: "Research career interests and strengths", completed: false },
  { id: "9-4", gradeLevel: 9, title: "Begin community service or volunteer work", completed: false },
  { id: "9-5", gradeLevel: 9, title: "Explore summer programs or enrichment opportunities", completed: false },
  // 10th Grade
  { id: "10-1", gradeLevel: 10, title: "Take the PSAT for practice", completed: false },
  { id: "10-2", gradeLevel: 10, title: "Explore dual enrollment or AP courses", completed: false },
  { id: "10-3", gradeLevel: 10, title: "Visit a college campus", completed: false },
  { id: "10-4", gradeLevel: 10, title: "Job shadow a professional in your field", completed: false },
  { id: "10-5", gradeLevel: 10, title: "Expand leadership roles in activities", completed: false },
  // 11th Grade
  { id: "11-1", gradeLevel: 11, title: "Take the SAT or ACT", completed: false },
  { id: "11-2", gradeLevel: 11, title: "Attend college fairs and information sessions", completed: false },
  { id: "11-3", gradeLevel: 11, title: "Begin researching and applying for scholarships", completed: false },
  { id: "11-4", gradeLevel: 11, title: "Narrow down your college list to 8–12 schools", completed: false },
  { id: "11-5", gradeLevel: 11, title: "Build relationships with recommendation writers", completed: false },
  // 12th Grade
  { id: "12-1", gradeLevel: 12, title: "Submit all college applications by deadlines", completed: false },
  { id: "12-2", gradeLevel: 12, title: "Complete FAFSA and financial aid applications", completed: false },
  { id: "12-3", gradeLevel: 12, title: "Finalize and submit scholarship applications", completed: false },
  { id: "12-4", gradeLevel: 12, title: "Accept your college admission offer", completed: false },
  { id: "12-5", gradeLevel: 12, title: "Prepare for your college transition and orientation", completed: false },
];
