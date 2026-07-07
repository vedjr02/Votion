import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";

export type TemplateCategory =
  | "productivity"
  | "education"
  | "finance"
  | "work"
  | "personal";

export type DocumentTemplate = {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: TemplateCategory;
  featured?: boolean;
  content: PartialBlock<VotionBlockSchema>[];
};

export const templateCategories: {
  id: TemplateCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "productivity",
    label: "Productivity",
    description: "Plan your week and stay on top of tasks.",
  },
  {
    id: "education",
    label: "Education",
    description: "Notes, courses, and assignments in one place.",
  },
  {
    id: "finance",
    label: "Finance",
    description: "Track spending, savings, and monthly budgets.",
  },
  {
    id: "work",
    label: "Work",
    description: "Meetings, projects, and team planning.",
  },
  {
    id: "personal",
    label: "Personal",
    description: "Goals, habits, and everyday planning.",
  },
];

const text = (value: string) => [
  { type: "text" as const, text: value, styles: {} },
];

const heading = (value: string, level: 1 | 2 | 3 = 2): PartialBlock<VotionBlockSchema> => ({
  type: "heading",
  props: {
    level,
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
  },
  content: text(value),
  children: [],
});

const paragraph = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "paragraph",
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
  },
  content: text(value),
  children: [],
});

const bullet = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "bulletListItem",
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
  },
  content: text(value),
  children: [],
});

const numbered = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "numberedListItem",
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
  },
  content: text(value),
  children: [],
});

const checkList = (): PartialBlock<VotionBlockSchema> => ({
  type: "checkListItem",
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
    checked: false,
  },
  content: [],
  children: [],
});

export const PLACEHOLDER_TITLE = "Untitled";

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "weekly-planner",
    title: "Weekly Planner",
    icon: "📅",
    category: "productivity",
    featured: true,
    description:
      "Minimal weekly layout to plan tasks, priorities, and focus areas.",
    content: [
      heading("Weekly Planner", 1),
      paragraph("Week of: "),
      heading("This week's focus", 2),
      bullet("Top priority"),
      bullet("Secondary goal"),
      bullet("Something to look forward to"),
      heading("Monday", 2),
      bullet("Morning — "),
      bullet("Afternoon — "),
      bullet("Evening — "),
      heading("Tuesday", 2),
      bullet("Morning — "),
      bullet("Afternoon — "),
      bullet("Evening — "),
      heading("Wednesday", 2),
      bullet("Morning — "),
      bullet("Afternoon — "),
      bullet("Evening — "),
      heading("Thursday", 2),
      bullet("Morning — "),
      bullet("Afternoon — "),
      bullet("Evening — "),
      heading("Friday", 2),
      bullet("Morning — "),
      bullet("Afternoon — "),
      bullet("Evening — "),
      heading("Weekend", 2),
      bullet("Rest & recharge"),
      bullet("Personal errands"),
      heading("End of week review", 2),
      paragraph("What went well? What should change next week?"),
    ],
  },
  {
    id: "class-notes-2026",
    title: "Class Notes",
    icon: "📚",
    category: "education",
    featured: true,
    description:
      "Structured notes for lectures, sources, assignments, and due dates.",
    content: [
      heading("Class Notes", 1),
      heading("Course overview", 2),
      bullet("Course name: "),
      bullet("Instructor: "),
      bullet("Semester: "),
      bullet("Office hours: "),
      heading("Today's lecture", 2),
      bullet("Date: "),
      bullet("Topic: "),
      bullet("Reading: "),
      heading("Key concepts", 2),
      numbered("Main idea from the lecture"),
      numbered("Supporting detail or example"),
      numbered("Connection to previous material"),
      heading("Questions to review", 2),
      bullet("Concept I need to clarify"),
      bullet("Topic to revisit before the exam"),
      heading("Assignments & deadlines", 2),
      bullet("Assignment — due date — status"),
      bullet("Quiz or exam — date — prep plan"),
      heading("Sources & references", 2),
      bullet("Textbook chapter or article"),
      bullet("Link or resource"),
      heading("Quick summary", 2),
      paragraph("Write a 2–3 sentence recap of today's session."),
    ],
  },
  {
    id: "finance-tracker",
    title: "Finance Tracker",
    icon: "💰",
    category: "finance",
    featured: true,
    description:
      "Track income, expenses, categories, and monthly budget at a glance.",
    content: [
      heading("Finance Tracker", 1),
      paragraph("Month: "),
      heading("Monthly overview", 2),
      bullet("Starting balance: "),
      bullet("Total income: "),
      bullet("Total expenses: "),
      bullet("Remaining: "),
      heading("Income", 2),
      bullet("Salary / wages — amount — date"),
      bullet("Side income — amount — date"),
      bullet("Other — amount — date"),
      heading("Fixed expenses", 2),
      bullet("Rent / mortgage — amount"),
      bullet("Utilities — amount"),
      bullet("Subscriptions — amount"),
      bullet("Insurance — amount"),
      heading("Variable expenses", 2),
      bullet("Groceries — amount — category"),
      bullet("Transport — amount — category"),
      bullet("Dining out — amount — category"),
      bullet("Shopping — amount — category"),
      heading("Savings goals", 2),
      bullet("Emergency fund — target — current"),
      bullet("Short-term goal — target — current"),
      bullet("Long-term goal — target — current"),
      heading("Category breakdown", 2),
      paragraph("Housing | Food | Transport | Entertainment | Other"),
      heading("Notes", 2),
      paragraph("Adjustments, upcoming bills, or spending habits to watch."),
    ],
  },
  {
    id: "todo-list",
    title: "To-Do List",
    icon: "✅",
    category: "productivity",
    featured: true,
    description: "Simple task list with today, upcoming, and notes.",
    content: [
      heading("To-Do List", 1),
      paragraph("Use this page to stay on top of what needs to get done."),
      heading("Today", 2),
      checkList(),
      checkList(),
      checkList(),
      heading("Upcoming", 2),
      checkList(),
      checkList(),
      heading("Waiting on", 2),
      checkList(),
      heading("Notes", 2),
      paragraph("Add any extra context here."),
    ],
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    icon: "📝",
    category: "work",
    description: "Capture agenda, discussion, decisions, and action items.",
    content: [
      heading("Meeting Notes", 1),
      heading("Details", 2),
      bullet("Date: "),
      bullet("Attendees: "),
      bullet("Purpose: "),
      heading("Agenda", 2),
      numbered("Topic one"),
      numbered("Topic two"),
      heading("Discussion", 2),
      paragraph("Write key points from the conversation."),
      heading("Decisions", 2),
      bullet("Decision made"),
      heading("Action items", 2),
      bullet("Owner — task — due date"),
      bullet("Owner — task — due date"),
    ],
  },
  {
    id: "project-plan",
    title: "Project Plan",
    icon: "🎯",
    category: "work",
    description: "Outline goals, milestones, resources, and risks.",
    content: [
      heading("Project Plan", 1),
      heading("Overview", 2),
      paragraph("Describe what this project is and why it matters."),
      heading("Goals", 2),
      bullet("Primary goal"),
      bullet("Success metric"),
      heading("Milestones", 2),
      numbered("Kickoff and planning"),
      numbered("First deliverable"),
      numbered("Review and iteration"),
      numbered("Final delivery"),
      heading("Resources needed", 2),
      bullet("People"),
      bullet("Tools"),
      bullet("Budget or time"),
      heading("Risks & blockers", 2),
      bullet("Potential issue and mitigation"),
    ],
  },
  {
    id: "study-planner",
    title: "Study Planner",
    icon: "🎓",
    category: "education",
    description: "Plan study sessions, topics, and exam prep week by week.",
    content: [
      heading("Study Planner", 1),
      heading("Exam / assessment", 2),
      bullet("Subject: "),
      bullet("Date: "),
      bullet("Format: "),
      heading("Topics to cover", 2),
      numbered("Topic 1 — confidence level (1–5)"),
      numbered("Topic 2 — confidence level (1–5)"),
      numbered("Topic 3 — confidence level (1–5)"),
      heading("Study schedule", 2),
      bullet("Monday — topic — duration"),
      bullet("Tuesday — topic — duration"),
      bullet("Wednesday — topic — duration"),
      bullet("Thursday — topic — duration"),
      bullet("Friday — review session"),
      heading("Practice & resources", 2),
      bullet("Past papers or practice questions"),
      bullet("Flashcards or summary notes"),
      heading("Review checklist", 2),
      bullet("Weak areas to revisit"),
      bullet("Ready for exam?"),
    ],
  },
  {
    id: "habit-tracker",
    title: "Habit Tracker",
    icon: "🌱",
    category: "personal",
    description: "Track daily habits and build consistent routines.",
    content: [
      heading("Habit Tracker", 1),
      paragraph("Month: "),
      heading("Habits I'm building", 2),
      bullet("Habit 1 — why it matters"),
      bullet("Habit 2 — why it matters"),
      bullet("Habit 3 — why it matters"),
      heading("Daily log", 2),
      paragraph("Mon | Tue | Wed | Thu | Fri | Sat | Sun"),
      heading("Week 1", 2),
      bullet("Habit 1 — done / missed"),
      bullet("Habit 2 — done / missed"),
      bullet("Habit 3 — done / missed"),
      heading("Reflection", 2),
      paragraph("What's working? What needs a smaller step?"),
    ],
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    icon: "💼",
    category: "work",
    description: "Organize applications, interviews, and follow-ups.",
    content: [
      heading("Job Application Tracker", 1),
      heading("Active applications", 2),
      bullet("Company — role — applied date — status"),
      bullet("Company — role — applied date — status"),
      bullet("Company — role — applied date — status"),
      heading("Interview prep", 2),
      bullet("Company — interview date — notes"),
      heading("Follow-ups", 2),
      bullet("Send thank-you email"),
      bullet("Check in after 1 week"),
      heading("Resources", 2),
      bullet("CV version used"),
      bullet("Portfolio or project links"),
    ],
  },
  {
    id: "monthly-budget",
    title: "Monthly Budget",
    icon: "📊",
    category: "finance",
    description: "Plan spending limits by category for the month.",
    content: [
      heading("Monthly Budget", 1),
      paragraph("Month: "),
      heading("Income plan", 2),
      bullet("Expected income: "),
      heading("Budget by category", 2),
      bullet("Housing — budget — spent"),
      bullet("Food — budget — spent"),
      bullet("Transport — budget — spent"),
      bullet("Entertainment — budget — spent"),
      bullet("Savings — budget — spent"),
      heading("Weekly check-in", 2),
      bullet("Week 1 — on track?"),
      bullet("Week 2 — on track?"),
      bullet("Week 3 — on track?"),
      bullet("Week 4 — on track?"),
      heading("Adjustments", 2),
      paragraph("What to cut or reallocate next month."),
    ],
  },
  {
    id: "task-database",
    title: "Task Database",
    icon: "🗂️",
    category: "work",
    description:
      "Table-style tracker for tasks, status, owner, and due dates.",
    content: [
      heading("Task Database", 1),
      paragraph("Track work items in a simple table-style layout."),
      heading("Columns", 2),
      bullet("Name | Status | Owner | Due date | Priority"),
      heading("Tasks", 2),
      bullet("Design homepage — In progress — You — Friday — High"),
      bullet("Write documentation — Not started — You — Next week — Medium"),
      bullet("Review pull request — Done — Team — Today — Low"),
      heading("Views", 2),
      bullet("All tasks"),
      bullet("My tasks"),
      bullet("Due this week"),
    ],
  },
  {
    id: "reading-list",
    title: "Reading List",
    icon: "📖",
    category: "personal",
    description: "Track books, articles, and learning resources.",
    content: [
      heading("Reading List", 1),
      heading("Currently reading", 2),
      bullet("Title — author — progress %"),
      heading("Want to read", 2),
      bullet("Title — author — why it matters"),
      heading("Finished", 2),
      bullet("Title — author — key takeaway"),
      heading("Notes", 2),
      paragraph("Capture quotes, ideas, and follow-up resources."),
    ],
  },
];

export const featuredTemplates = documentTemplates.filter(
  (template) => template.featured
);

export const getTemplatesByCategory = (category: TemplateCategory) =>
  documentTemplates.filter((template) => template.category === category);

export const getCategoryLabel = (category: TemplateCategory) =>
  templateCategories.find((item) => item.id === category)?.label ?? category;

export const serializeTemplateContent = (
  content: PartialBlock<VotionBlockSchema>[]
) =>
  JSON.stringify(content, null, 2);
