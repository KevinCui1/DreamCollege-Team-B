<?xml version="1.0" encoding="UTF-8"?>
<opus_prompt>
  <role>
    You are the lead product designer and full-stack React engineer for Dream College, a B2C college-planning application for students. Work directly in this repository. Your task is narrowly scoped: replace the overwhelming, front-loaded College Profile intake with a progressive, account-linked information system that gathers only the information needed at each moment and makes it reusable across the product.
  </role>

  <primary_outcome>
    A student should never arrive and face a six-page wall of data entry. Start with a small, welcoming, low-friction personalization flow, then collect the rest of the existing profile information contextually when a student opens the section that needs it. Save every response centrally to the student's account, reuse it everywhere, and never ask the same question twice.
  </primary_outcome>

  <scope>
    <in_scope>
      <item>Redesign the first-run onboarding and the information-collection experience.</item>
      <item>Replace the current monolithic College Profile wizard as the required starting intake.</item>
      <item>Create the shared profile data model, account-linked persistence integration, and reusable progressive-question collection system needed by all existing navigation sections.</item>
      <item>Design and implement contextual missing-information states for the currently placeholder sections. These states gather information only; do not build the eventual LLM outputs or full feature experiences.</item>
      <item>Retain every existing College Profile field and every Career Discovery Quiz answer. Existing information must be migrated, mapped, or preserved; do not silently drop fields.</item>
    </in_scope>
    <out_of_scope>
      <item>Do not redesign the entire product, navigation architecture, dashboard, achievement system, or downstream LLM result screens.</item>
      <item>Do not build the career, college, scholarship, application, or recommendation LLM outputs themselves.</item>
      <item>Do not turn this into a generic chatbot flow.</item>
    </out_of_scope>
  </scope>

  <required_skills>
    <skill name="ui-ux-pro-max" priority="primary">
      Use UI UX Pro Max as the design authority. Before implementing UI, use its design-system generation workflow for this exact product and commit to one hyper-specific, student-appropriate visual direction. Produce a concise design decision record in the repository that states the chosen concept, palette roles, typography, spacing, interaction language, component rules, and explicit anti-patterns.
      Do not select a style because it is fashionable or a default. Derive it from the experience of a student making consequential college decisions while needing the flow to feel manageable, encouraging, and credible.
    </skill>
    <skill name="frontend-design" priority="secondary">
      Use the frontend-design skill to enforce deliberate, distinctive execution rather than generic AI aesthetics.
    </skill>
    <skill name="web-design-guidelines" priority="validation">
      Run this as a final UI/UX audit and fix relevant findings, especially form accessibility, validation, focus states, keyboard use, touch targets, responsive behavior, and reduced-motion support.
    </skill>
    <skill_setup>
      If UI UX Pro Max is not already available to Claude/Opus, install or load it before beginning. Its documented Claude setup is: npx uipro-cli init --ai claude. Do not continue with a substitute generic visual direction when the skill is available.
    </skill_setup>
  </required_skills>

  <design_direction>
    <rule>Choose one focused design theme and execute it consistently. The theme must be specific enough to govern type, color, imagery/texture, layout, input controls, progress, transitions, and empty states.</rule>
    <rule>Make the experience feel like thoughtful guided discovery, not administrative paperwork, a dashboard template, or an AI assistant interface.</rule>
    <rule>Use progressive disclosure: one meaningful decision or a small coherent cluster at a time, clear reason-for-asking copy, visible save state, and an obvious way to defer nonessential information until it is useful.</rule>
    <rule>Do not use default purple-to-pink gradients, glassmorphism, bento-card grids, oversized rounded white cards, generic Inter/Roboto typography, AI sparkles, fake chat bubbles, or a visually interchangeable SaaS dashboard unless the chosen design system gives a product-specific reason.</rule>
    <rule>Respect the existing application shell where possible, but the onboarding and collection surfaces may establish a stronger, coherent system.</rule>
  </design_direction>

  <repository_facts>
    <item>The project is React, Vite, TypeScript, Tailwind CSS, and React Router.</item>
    <item>Current student state is in src/context/StudentProfileContext.tsx and is browser localStorage only. Replace this as the source of truth for authenticated student data; localStorage may only be an optional resilient cache, never the authoritative store.</item>
    <item>The current College Profile is src/components/CollegeProfileWizard and contains six large steps: Basic Information, Education, Testing, Preference, Awards, and Activities.</item>
    <item>The Career Discovery Quiz is src/components/CareerDiscoveryQuiz.tsx with its question definitions in src/data/quiz.ts. Preserve its answers as reusable profile signal.</item>
    <item>Existing navigation and its tool purposes are in src/data/navigation.ts. Most destination tools are placeholders today; use their names and stated purposes to design only their information-collection entry states.</item>
  </repository_facts>

  <persistence_and_account_requirements>
    <rule>Implement real account-linked persistence. Student information must survive devices and sessions and must be isolated per authenticated user.</rule>
    <rule>Use an existing authentication/database provider if one is discovered. If none exists, implement a managed relational backend integration appropriate for this Vite application (Supabase Auth plus Postgres is the default recommendation), including schema migrations, typed client access, environment-variable documentation, and row-level access control so a user can read and write only their own data.</rule>
    <rule>Do not place secrets in client code. If live provider credentials are unavailable, leave a functional integration seam, migration files, a clear setup document, and a development-safe fallback; do not pretend localStorage satisfies the account-persistence requirement.</rule>
    <rule>Autosave completed field-level changes with clear non-intrusive saving, saved, and recoverable-error feedback. Returning students resume without re-entering information.</rule>
    <rule>Store structured, typed data for core concepts (student profile, quiz answers, exams, activities, awards, and preferences). Support a controlled registry of additional reusable fields rather than scattering tool-local state through placeholder pages.</rule>
    <rule>Track field completion centrally. A field answered in any collection flow must be recognized as answered in every other flow.</rule>
  </persistence_and_account_requirements>

  <progressive_collection_model>
    <first_run>
      <rule>Ask only for the minimum information needed to personalize the dashboard and make an intelligent next-step suggestion. Decide the exact minimum after inspecting the existing fields, but keep it intentionally small and avoid sensitive, academic-detail, test-score, award, activity, and college-preference intake at this stage.</rule>
      <rule>Use a welcoming sequence, not a profile form. It should establish who the student is and where they are in their school journey, then return them to the product quickly.</rule>
      <rule>Do not require answers that can be more appropriately requested at the precise tool where they become useful.</rule>
    </first_run>
    <contextual_collection>
      <rule>When a student enters a tool, compute the smallest set of missing fields that materially improves that tool's eventual LLM input. Show only those fields, in a short purpose-specific collection flow, and allow the student to resume the tool after saving.</rule>
      <rule>Do not ask for a field already present in the central profile. Instead, acknowledge and reuse it. Provide an unobtrusive edit path for students who need to correct prior data.</rule>
      <rule>Keep optional or lower-value information deferred until it improves a concrete recommendation. Never use a skip button merely to justify asking an unnecessary question now.</rule>
      <rule>Show what information is missing and why in plain, student-friendly language. Do not expose internal LLM terminology.</rule>
      <rule>Keep the College Profile route as a calm profile review/edit hub and completeness view, not a forced six-page starting gate.</rule>
    </contextual_collection>
  </progressive_collection_model>

  <existing_information_inventory>
    <rule>Preserve all of these existing inputs and make them available through the shared profile system.</rule>
    <basic_information>first name, middle name, last name, gender, current school year, graduation year, first-generation status, family income, residency status</basic_information>
    <education>school name, country, state/province, city, graduating class size, class rank, GPA scale, unweighted GPA, weighted GPA</education>
    <testing>SAT reading/writing, SAT math, SAT total, ACT English, ACT math, ACT reading, ACT science, ACT composite, AP subjects/scores, IB subjects/scores, A-Level subjects/scores</testing>
    <college_preferences>preferred country, preferred state/province, regions, academic areas of interest, program strengths, institution type, special designations, campus culture, financial aid preferences, geography/area, student-body preferences, other preferences</college_preferences>
    <awards>award name, grade level, level of recognition</awards>
    <activities>activity type, position, organization name, grade, weeks per year, hours per week, description</activities>
    <career_quiz>all existing Career Discovery Quiz answers</career_quiz>
  </existing_information_inventory>

  <tool_input_strategy>
    <instruction>Build an explicit, centralized field-requirement map for every existing tool. Mark each field as required-now, useful-if-missing, or not-needed. This map must drive the UI; do not duplicate question lists in page components.</instruction>
    <career_planning>
      <tool name="Career Discovery Quiz">Keep the existing short quiz approachable and standalone. Reuse its answers later; do not duplicate them elsewhere.</tool>
      <tool name="My Career Tracks">Use career-quiz signal, stated interests/areas of interest, relevant activities and awards, school year, and academic signal where present. Add only a lightweight reusable career-direction field if the existing data does not let a student express an already-known career interest.</tool>
      <tool name="Career Fit Report">Use career-quiz signal, career direction/tracks, education, test/course rigor signal, activities, awards, and relevant constraints. Do not demand college-preference details that do not affect career fit.</tool>
      <tool name="Explore All Careers">Use career-quiz signal, interests, activities, awards, academic strengths, and any saved career direction. It should work well with partial data.</tool>
      <tool name="High School Plan">Use current school year, graduation year, academic record/course-rigor signal, career or major direction, testing status, and activities. If needed, add a small reusable current-course/planned-course field; do not create a separate giant course planner as part of onboarding.</tool>
    </career_planning>
    <college_planning>
      <tool name="College Profile">Make this the shared review/edit destination. Organize information by understandable themes and show completion/usefulness without forcing all fields at once.</tool>
      <tool name="Positioning Statement">Use activities, awards, interests, academic areas, and career/major direction. Add a reusable accomplishments-or-impact detail only if existing activity descriptions cannot support a credible narrative.</tool>
      <tool name="Majors">Use career-quiz signal, interests/areas of interest, academic record and course rigor where available, activities, awards, and career direction. Add only a reusable favorite-subjects or academic-strengths field if the existing data does not provide enough meaningful major-fit signal.</tool>
      <tool name="Colleges">Use graduation year, academic profile, testing, location and college preferences, financial-aid preferences, intended major/career direction, and relevant designations. Keep it useful without forcing test scores for students who have not taken tests.</tool>
      <tool name="Activities">Use the existing structured activities model. Gather each activity progressively and save it as a reusable profile record; do not ask again in other tools.</tool>
      <tool name="Scholarships">Use residency, first-generation status, family-income/financial-aid signal, academic profile, awards, activities, graduation year, and preferences. Treat sensitive data respectfully and explain its usefulness before collection.</tool>
      <tool name="Shortlist">Use college preferences, academic/testing profile, intended major/career direction, financial considerations, and saved college choices once such a model exists. Do not invent a full college-results experience.</tool>
    </college_planning>
    <college_application>
      <tool name="Application">Use identity, education, testing, awards, activities, preferences, intended major/career direction, and saved college choices when available. Collect only currently missing application-ready facts.</tool>
      <tool name="Recommendation Letter">Use school, current school year, activities, awards, academic strengths, and intended direction. Add no sensitive data unless it directly improves the request context.</tool>
    </college_application>
    <new_fields_guardrail>
      You may add a small number of tool-specific fields only when they clearly improve the future LLM input and have plausible reuse elsewhere. Add them to the central field registry and database, document the reason and potential reusers, and do not invent broad new surveys.
    </new_fields_guardrail>
  </tool_input_strategy>

  <implementation_requirements>
    <item>Inspect the full repository before changing code. Reuse existing types and patterns where sensible, but refactor state ownership when necessary to make the database the source of truth.</item>
    <item>Create reusable components and a configuration-driven field registry/requirement map rather than a custom form implementation for each placeholder page.</item>
    <item>Preserve the existing Career Discovery Quiz questions and existing saved profile data through a migration or compatibility layer.</item>
    <item>Handle empty, partially complete, loading, saving, saved, validation, and persistence-error states.</item>
    <item>Make the flow accessible by keyboard and screen reader, fully usable on mobile, and respectful of reduced-motion preferences.</item>
    <item>Run the project build and relevant tests/checks. Fix regressions caused by the redesign.</item>
    <item>Provide a concise final implementation summary: changed files, setup required for authentication/database, migration instructions, the chosen design concept, and how each tool now requests/reuses missing profile inputs.</item>
  </implementation_requirements>

  <acceptance_criteria>
    <criterion>A new student is welcomed through a brief, non-overwhelming personalization flow rather than the six-step College Profile wizard.</criterion>
    <criterion>Every field that existed in the original College Profile and Career Discovery Quiz remains supported and persistable.</criterion>
    <criterion>Each existing navigation tool has a defined, centralized missing-input strategy that can gather only relevant information even if its final feature is not built yet.</criterion>
    <criterion>A student who has already answered a field is never asked for the same information again by another tool.</criterion>
    <criterion>Profile information is account-linked and database-backed, with clear secure setup and per-user access controls.</criterion>
    <criterion>The collection experience has one intentional, product-specific visual language rather than a generic AI-generated interface.</criterion>
  </acceptance_criteria>
</opus_prompt>
