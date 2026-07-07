import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";
import {
  bullet,
  callout,
  checkList,
  checkLists,
  divider,
  h1,
  h2,
  h3,
  labeledField,
  numbered,
  p,
  quote,
  section,
  table,
  twoColumns,
  type TemplateContent,
} from "@/lib/template-blocks";
import {
  PERSONAL_FINANCE_TRACKER_SOURCE,
  personalFinanceTrackerContent,
} from "@/lib/templates/personal-finance-tracker";

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
  sourceUrl?: string;
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

export const PLACEHOLDER_TITLE = "Untitled";

const weeklyPlannerContent: TemplateContent = [
  h1("Weekly Planner"),
  callout("blue"),
  ...section("This week's focus", checkLists(3)),
  divider(),
  ...section("Weekly schedule", [
    ...table(
      ["Day", "Morning", "Afternoon", "Evening"],
      [
        ["Monday", "", "", ""],
        ["Tuesday", "", "", ""],
        ["Wednesday", "", "", ""],
        ["Thursday", "", "", ""],
        ["Friday", "", "", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Weekend", [
    ...twoColumns("Saturday", "Sunday", ["", ""], ["", ""]),
  ]),
  divider(),
  ...section("End of week review", [
    quote(),
    h3("What went well?"),
    quote(),
    h3("What should change next week?"),
    quote(),
  ]),
];

const classNotesContent: TemplateContent = [
  h1("Class Notes"),
  callout("blue"),
  ...section("Course overview", [
    ...table(
      ["Field", "Details"],
      [
        ["Course", ""],
        ["Instructor", ""],
        ["Semester", ""],
        ["Office hours", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Today's lecture", [
    ...table(
      ["Item", "Notes"],
      [
        ["Date", ""],
        ["Topic", ""],
        ["Reading", ""],
      ]
    ),
  ]),
  ...section("Key concepts", [
    numbered("Main idea from the lecture"),
    numbered("Supporting detail or example"),
    numbered("Connection to previous material"),
  ]),
  ...section("Questions to review", checkLists(2)),
  ...section("Assignments & deadlines", [
    ...table(["Assignment", "Due date", "Status"], [["", "", ""]]),
  ]),
  ...section("Sources & references", [
    bullet("Textbook chapter or article"),
    bullet("Link or resource"),
  ]),
  ...section("Quick summary", [quote()]),
];

const todoListContent: TemplateContent = [
  h1("To-Do List"),
  callout("blue"),
  ...section("Today", checkLists(4)),
  divider(),
  ...section("Upcoming", checkLists(3)),
  ...section("Waiting on", checkLists(2)),
  ...section("Notes", [quote()]),
];

const meetingNotesContent: TemplateContent = [
  h1("Meeting Notes"),
  callout("blue"),
  ...section("Details", [
    ...table(
      ["Field", "Value"],
      [
        ["Date", ""],
        ["Attendees", ""],
        ["Purpose", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Agenda", [
    numbered("Topic one"),
    numbered("Topic two"),
    numbered("Topic three"),
  ]),
  ...section("Discussion", [quote()]),
  ...section("Decisions", [
    callout("green"),
    callout("green"),
  ]),
  ...section("Action items", [
    ...table(["Owner", "Task", "Due date"], [["", "", ""]]),
  ]),
];

const projectPlanContent: TemplateContent = [
  h1("Project Plan"),
  callout("blue"),
  ...section("Overview", [quote()]),
  divider(),
  ...twoColumns(
    "Goals",
    "Success metrics",
    ["Primary goal", "Secondary goal"],
    ["Metric 1", "Metric 2"]
  ),
  divider(),
  ...section("Milestones", [
    numbered("Kickoff and planning"),
    numbered("First deliverable"),
    numbered("Review and iteration"),
    numbered("Final delivery"),
  ]),
  ...section("Resources", [
    ...table(["Type", "Details"], [["People", ""], ["Tools", ""], ["Budget", ""]]),
  ]),
  ...section("Risks & blockers", [callout("yellow"), callout("red")]),
];

const studyPlannerContent: TemplateContent = [
  h1("Study Planner"),
  callout("blue"),
  ...section("Exam / assessment", [
    ...table(
      ["Field", "Details"],
      [
        ["Subject", ""],
        ["Date", ""],
        ["Format", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Topics to cover", [
    ...table(["Topic", "Confidence (1-5)"], [["", ""], ["", ""], ["", ""]]),
  ]),
  ...section("Study schedule", [
    ...table(
      ["Day", "Topic", "Duration"],
      [
        ["Monday", "", ""],
        ["Tuesday", "", ""],
        ["Wednesday", "", ""],
        ["Thursday", "", ""],
        ["Friday", "Review", ""],
      ]
    ),
  ]),
  ...section("Practice & resources", [
    bullet("Past papers or practice questions"),
    bullet("Flashcards or summary notes"),
  ]),
  ...section("Review checklist", checkLists(2)),
];

const habitTrackerContent: TemplateContent = [
  h1("Habit Tracker"),
  callout("blue"),
  ...section("Habits I'm building", [
    ...table(["Habit", "Why it matters"], [["", ""], ["", ""], ["", ""]]),
  ]),
  divider(),
  ...section("Daily log", [
    ...table(
      ["Habit", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      [
        ["Habit 1", "", "", "", "", "", "", ""],
        ["Habit 2", "", "", "", "", "", "", ""],
        ["Habit 3", "", "", "", "", "", "", ""],
      ]
    ),
  ]),
  ...section("Reflection", [quote()]),
];

const jobTrackerContent: TemplateContent = [
  h1("Job Application Tracker"),
  callout("blue"),
  ...section("Active applications", [
    ...table(
      ["Company", "Role", "Applied", "Status"],
      [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Interview prep", [
    ...table(["Company", "Interview date", "Notes"], [["", "", ""]]),
  ]),
  ...section("Follow-ups", checkLists(2)),
  ...section("Resources", [
    labeledField("CV version used"),
    labeledField("Portfolio or project links"),
  ]),
];

const monthlyBudgetContent: TemplateContent = [
  h1("Monthly Budget"),
  callout("blue"),
  ...section("Income plan", [
    ...table(["Expected income", "Actual"], [["", ""]]),
  ]),
  divider(),
  ...section("Budget by category", [
    ...table(
      ["Category", "Budget", "Spent", "Remaining"],
      [
        ["Housing", "", "", ""],
        ["Food", "", "", ""],
        ["Transport", "", "", ""],
        ["Entertainment", "", "", ""],
        ["Savings", "", "", ""],
      ]
    ),
  ]),
  ...section("Weekly check-in", [
    ...table(
      ["Week", "On track?", "Notes"],
      [
        ["Week 1", "", ""],
        ["Week 2", "", ""],
        ["Week 3", "", ""],
        ["Week 4", "", ""],
      ]
    ),
  ]),
  ...section("Adjustments", [callout("yellow")]),
];

const taskDatabaseContent: TemplateContent = [
  h1("Task Database"),
  callout("blue"),
  ...section("All tasks", [
    ...table(
      ["Name", "Status", "Owner", "Due date", "Priority"],
      [
        ["Design homepage", "In progress", "", "Friday", "High"],
        ["Write documentation", "Not started", "", "Next week", "Medium"],
        ["Review pull request", "Done", "", "Today", "Low"],
      ]
    ),
  ]),
  divider(),
  ...twoColumns(
    "Filter views",
    "Quick actions",
    ["All tasks", "My tasks", "Due this week"],
    ["Add task", "Sort by due date", "Group by status"]
  ),
];

const readingListContent: TemplateContent = [
  h1("Reading List"),
  callout("blue"),
  ...section("Currently reading", [
    ...table(["Title", "Author", "Progress"], [["", "", ""]]),
  ]),
  divider(),
  ...section("Want to read", [
    ...table(["Title", "Author", "Why it matters"], [["", "", ""]]),
  ]),
  ...section("Finished", [
    ...table(["Title", "Author", "Key takeaway"], [["", "", ""]]),
  ]),
  ...section("Notes", [quote()]),
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "weekly-planner",
    title: "Weekly Planner",
    icon: "📅",
    category: "productivity",
    featured: true,
    description:
      "Weekly layout with focus tasks, a day-by-day schedule table, weekend columns, and review prompts.",
    content: weeklyPlannerContent,
  },
  {
    id: "class-notes-2026",
    title: "Class Notes",
    icon: "📚",
    category: "education",
    featured: true,
    description:
      "Structured lecture notes with overview tables, concepts, assignments, and summary callouts.",
    content: classNotesContent,
  },
  {
    id: "personal-finance-tracker",
    title: "Personal Finance Tracker",
    icon: "💰",
    category: "finance",
    featured: true,
    sourceUrl: PERSONAL_FINANCE_TRACKER_SOURCE,
    description:
      "Official Notion-style finance tracker with quarterly overview, income & expense tables, categories, and tax set-aside reminders.",
    content: personalFinanceTrackerContent,
  },
  {
    id: "todo-list",
    title: "To-Do List",
    icon: "✅",
    category: "productivity",
    featured: true,
    description: "Checkbox sections for today, upcoming, waiting, and notes.",
    content: todoListContent,
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    icon: "📝",
    category: "work",
    description:
      "Agenda, discussion callouts, decisions, and an action-item table.",
    content: meetingNotesContent,
  },
  {
    id: "project-plan",
    title: "Project Plan",
    icon: "🎯",
    category: "work",
    description:
      "Two-column goals view, milestones, resources table, and risk callouts.",
    content: projectPlanContent,
  },
  {
    id: "study-planner",
    title: "Study Planner",
    icon: "🎓",
    category: "education",
    description:
      "Exam details, topic confidence table, weekly study schedule, and review checklist.",
    content: studyPlannerContent,
  },
  {
    id: "habit-tracker",
    title: "Habit Tracker",
    icon: "🌱",
    category: "personal",
    description: "Habit list plus a Mon–Sun tracking grid and reflection area.",
    content: habitTrackerContent,
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    icon: "💼",
    category: "work",
    description:
      "Application pipeline table, interview prep, follow-ups, and resources.",
    content: jobTrackerContent,
  },
  {
    id: "monthly-budget",
    title: "Monthly Budget",
    icon: "📊",
    category: "finance",
    description:
      "Category budget table, weekly check-ins, and adjustment notes.",
    content: monthlyBudgetContent,
  },
  {
    id: "task-database",
    title: "Task Database",
    icon: "🗂️",
    category: "work",
    description:
      "Database-style task table with status columns and filter views.",
    content: taskDatabaseContent,
  },
  {
    id: "reading-list",
    title: "Reading List",
    icon: "📖",
    category: "personal",
    description:
      "Currently reading, wishlist, and finished books in organized tables.",
    content: readingListContent,
  },
];

export const featuredTemplates = documentTemplates.filter(
  (template) => template.featured
);

export const getTemplatesByCategory = (category: TemplateCategory) =>
  documentTemplates.filter((template) => template.category === category);

export const getTemplateById = (id: string) =>
  documentTemplates.find((template) => template.id === id);

export const getCategoryLabel = (category: TemplateCategory) =>
  templateCategories.find((item) => item.id === category)?.label ?? category;

export const serializeTemplateContent = (
  content: PartialBlock<VotionBlockSchema>[]
) => JSON.stringify(content, null, 2);
