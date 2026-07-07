/**
 * Static option lists for the College Profile wizard (the six-step form
 * rendered by `CollegeProfileWizard`). Kept here — alongside the other static
 * config in `src/data/` — so the step components stay presentational.
 */

/** US states + territories, matching the Preference/Education dropdowns. */
export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Armed Forces (AA)",
  "Armed Forces (AE)",
  "Armed Forces (AP)",
];

/** Countries for the Education-step address dropdown. */
export const COUNTRIES = [
  "United States of America",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "China",
  "Other",
];

/** Country choices for the Preference step (short codes as shown). */
export const PREF_COUNTRIES = ["US", "Canada", "UK", "Other"];

// ---------------------------------------------------------------------------
// Step 1 — Basic Information
// ---------------------------------------------------------------------------

export const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
];

export const SCHOOL_YEAR_OPTIONS = [
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

/** Graduation years — a rolling window around the current year. */
export const GRADUATION_YEARS = (() => {
  const start = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => String(start + i));
})();

export const FIRST_GEN_OPTIONS = ["Yes", "No"];

export const FAMILY_INCOME_OPTIONS = [
  "Less than $30,000",
  "$30,000 - $60,000",
  "$60,000 - $100,000",
  "$100,000 - $150,000",
  "$150,000 - $250,000",
  "More than $250,000",
  "Prefer not to say",
];

export const RESIDENCY_OPTIONS = [
  "U.S. Citizen",
  "U.S. Permanent Resident",
  "International Student",
  "DACA / Undocumented",
  "Other",
];

// ---------------------------------------------------------------------------
// Step 2 — Education
// ---------------------------------------------------------------------------

export const GPA_SCALE_OPTIONS = ["None", "4.0", "5.0", "100-point", "Other"];

// ---------------------------------------------------------------------------
// Step 3 — Testing
// ---------------------------------------------------------------------------

export type ExamType = "AP" | "IB" | "A-Level";
export const EXAM_TYPES: ExamType[] = ["AP", "IB", "A-Level"];

export const AP_SCORES = ["5", "4", "3", "2", "1"];

export const AP_SUBJECTS = [
  "AP Art History",
  "AP Biology",
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Chemistry",
  "AP Chinese Language and Culture",
  "AP Computer Science A",
  "AP Computer Science Principles",
  "AP English Language and Composition",
  "AP English Literature and Composition",
  "AP Environmental Science",
  "AP European History",
  "AP French Language and Culture",
  "AP German Language and Culture",
  "AP Human Geography",
  "AP Italian Language and Culture",
  "AP Japanese Language and Culture",
  "AP Latin",
  "AP Macroeconomics",
  "AP Microeconomics",
  "AP Music Theory",
  "AP Physics 1",
  "AP Physics 2",
  "AP Physics C: Electricity and Magnetism",
  "AP Physics C: Mechanics",
  "AP Precalculus",
  "AP Psychology",
  "AP Research",
  "AP Seminar",
  "AP Spanish Language and Culture",
  "AP Spanish Literature and Culture",
  "AP Statistics",
  "AP United States Government and Politics",
  "AP United States History",
  "AP World History: Modern",
];

export const IB_SCORES = ["7", "6", "5", "4", "3", "2", "1"];

export const IB_SUBJECTS = [
  "Biology HL",
  "Biology SL",
  "Chemistry HL",
  "Chemistry SL",
  "Physics HL",
  "Physics SL",
  "Mathematics: Analysis and Approaches HL",
  "Mathematics: Analysis and Approaches SL",
  "Mathematics: Applications and Interpretation HL",
  "Mathematics: Applications and Interpretation SL",
  "English A: Literature HL",
  "English A: Literature SL",
  "History HL",
  "History SL",
  "Economics HL",
  "Economics SL",
  "Psychology HL",
  "Psychology SL",
  "Computer Science HL",
  "Computer Science SL",
];

export const A_LEVEL_SCORES = ["A*", "A", "B", "C", "D", "E"];

export const A_LEVEL_SUBJECTS = [
  "Mathematics",
  "Further Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "History",
  "Geography",
  "English Literature",
  "Psychology",
  "Business Studies",
];

// ---------------------------------------------------------------------------
// Step 4 — Preference (checkbox groups, labels verbatim from the spec)
// ---------------------------------------------------------------------------

export const REGIONS = [
  "East Coast (Boston, New York, Philadelphia, Washington DC)",
  "West Coast (California, Seattle, Portland)",
  "Midwest (Chicago, Detroit, St. Louis, Minneapolis)",
  "South (Atlanta, Dallas, Miami, Nashville)",
  "Mid-Atlantic (Virginia, Maryland, North Carolina)",
  "Other Regions (e.g., Mountain West, Southwest, Alaska, Hawaii)",
  "No Preference",
];

export const AREAS_OF_INTEREST = [
  "Arts",
  "Humanities",
  "Political science",
  "Business",
  "Economics",
  "Accounting",
  "Communications",
  "Health and Medicine",
  "Public and Social Services",
  "Math and Statistics",
  "Environmental Science",
  "Computer Technologies",
  "Science",
  "Education",
  "Engineering",
  "English",
  "History",
  "Psychology",
];

export const PROGRAM_STRENGTH = [
  "Strong emphasis on STEM (Science, Technology, Engineering, Math)",
  "Strong Liberal Arts programs",
  "Specialized programs (Business, Art, Music, etc.)",
  "Research opportunities",
  "No Preference",
];

export const INSTITUTION_TYPE = [
  "Public College",
  "Private College",
  "Liberal Arts College",
  "Community College",
  "No Preference",
];

export const SPECIAL_DESIGNATION = [
  "HBCU (Historically Black Colleges and Universities)",
  "Women's College",
  "No Preference",
];

export const CAMPUS_CULTURE = [
  "Diverse and inclusive environment",
  "Focus on leadership development",
  "Socially active campus",
  "Academically focused, rigorous environment",
  "No Preference",
];

export const FINANCIAL_AID = [
  "Critical (Financial aid is a determining factor)",
  "Moderately Important (It would be helpful but not crucial)",
  "Not Important (Financial aid is not a factor)",
];

export const GEOGRAPHY_AREA = ["Rural", "Suburb", "Urban", "Not Important"];

export const STUDENT_BODY = [
  "< 2,000 (Small)",
  "2,000 - 5,000 (Lower - Midsize)",
  "5,001 - 10,000 (Upper - Midsize)",
  ">10,000 (Large)",
  "No Preference",
];

// ---------------------------------------------------------------------------
// Step 5 — Awards
// ---------------------------------------------------------------------------

export const GRADE_LEVEL_OPTIONS = [
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "Post-Graduate",
];

export const RECOGNITION_LEVELS = [
  "School",
  "Regional",
  "State",
  "National",
  "International",
];

// ---------------------------------------------------------------------------
// Step 6 — Activities
// ---------------------------------------------------------------------------

export const ACTIVITY_TYPES = [
  "Academic",
  "Art",
  "Athletics: Club",
  "Athletics: JV/Varsity",
  "Career Oriented",
  "Community Service (Volunteer)",
  "Computer / Technology",
  "Cultural",
  "Dance",
  "Debate / Speech",
  "Environmental",
  "Family Responsibilities",
  "Foreign Exchange",
  "Internship",
  "Journalism / Publication",
  "Junior R.O.T.C.",
  "LGBT",
  "Music: Instrumental",
  "Music: Vocal",
  "Religious",
  "Research",
  "Robotics",
  "School Spirit",
  "Science / Math",
  "Student Government / Politics",
  "Theater / Drama",
  "Work (Paid)",
  "Others",
];

/** Max length for an activity description, shown as an "N/150 chars" counter. */
export const ACTIVITY_DESCRIPTION_MAX = 150;
