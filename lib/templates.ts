import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";
import {
  bullet,
  callout,
  checkLists,
  columns,
  divider,
  getBlockPlainText,
  h2,
  h3,
  intro,
  numbered,
  p,
  quote,
  section,
  table,
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
    description: "Plan your week, prioritize tasks, and ship work faster.",
  },
  {
    id: "education",
    label: "Education",
    description: "Capture lectures, exams, and study plans in one workspace.",
  },
  {
    id: "finance",
    label: "Finance",
    description: "Track income, spending, and monthly cash flow.",
  },
  {
    id: "work",
    label: "Work",
    description: "Run meetings, projects, hiring, and team delivery.",
  },
  {
    id: "personal",
    label: "Personal",
    description: "Build habits, goals, and everyday systems that stick.",
  },
];

export const PLACEHOLDER_TITLE = "Untitled";

const weeklyPlannerContent: TemplateContent = [
  intro(
    "Set your week in 10 minutes: pick 3 focus tasks, block your calendar, then review on Friday."
  ),
  columns(
    [
      h3("This week's focus"),
      ...checkLists(3),
      callout("green", "Win of the week — celebrate one thing you finished."),
    ],
    [
      h3("Top priorities"),
      numbered("Most important outcome this week"),
      numbered("Second priority"),
      numbered("Quick win if time allows"),
    ]
  ),
  divider(),
  h2("Weekly schedule"),
  table(
    ["Day", "Morning", "Afternoon", "Evening"],
    [
      ["Monday", "Deep work — project A", "Meetings", "Admin & inbox"],
      ["Tuesday", "Study / learning block", "Team sync", "Gym / personal"],
      ["Wednesday", "Deep work — project B", "Calls", "Planning"],
      ["Thursday", "Focus block", "Collaboration", "Wrap-up tasks"],
      ["Friday", "Review & retro", "Loose ends", "Weekend prep"],
    ]
  ),
  divider(),
  h2("Weekend"),
  columns(
    [
      h3("Saturday"),
      bullet("Errands & life admin"),
      bullet("Social / rest"),
      ...checkLists(2),
    ],
    [
      h3("Sunday"),
      bullet("Meal prep or planning"),
      bullet("Preview next week"),
      ...checkLists(2),
    ]
  ),
  divider(),
  ...section("End of week review", [
    h3("What went well?"),
    quote("Capture 2–3 wins from this week."),
    h3("What should change?"),
    quote("One habit or process to adjust for next week."),
  ]),
];

const classNotesContent: TemplateContent = [
  intro(
    "Duplicate this page per lecture, or duplicate the Today's lecture section inside one course hub."
  ),
  columns(
    [
      h3("Course overview"),
      table(
        ["Field", "Details"],
        [
          ["Course", "CS 401 — Machine Learning"],
          ["Instructor", ""],
          ["Semester", "Spring 2026"],
          ["Office hours", ""],
        ]
      ),
    ],
    [
      h3("Today's lecture"),
      table(
        ["Item", "Notes"],
        [
          ["Date", ""],
          ["Topic", ""],
          ["Required reading", ""],
        ]
      ),
    ]
  ),
  divider(),
  ...section("Key concepts", [
    numbered("Main idea — explain in your own words"),
    numbered("Important definition or formula"),
    numbered("Example or case study from class"),
    numbered("How this connects to last lecture"),
  ]),
  columns(
    [
      h3("Questions to review"),
      ...checkLists(3),
    ],
    [
      h3("Assignments & deadlines"),
      table(
        ["Assignment", "Due date", "Status"],
        [
          ["Problem set 1", "", "Not started"],
          ["Lab report", "", "In progress"],
          ["", "", ""],
        ]
      ),
    ]
  ),
  divider(),
  ...section("Quick summary", [
    quote("Three-sentence summary of today's lecture — great for exam revision."),
  ]),
];

const todoListContent: TemplateContent = [
  intro(
    "Use Today for must-do items, Upcoming for this week, and Waiting on for blocked tasks."
  ),
  columns(
    [
      h3("Today"),
      ...checkLists(4),
    ],
    [
      h3("Upcoming"),
      ...checkLists(3),
    ]
  ),
  divider(),
  columns(
    [
      h3("Waiting on"),
      bullet("Blocked by design review — @Alex"),
      bullet("Waiting on client feedback"),
      ...checkLists(1),
    ],
    [
      h3("Notes & context"),
      quote("Drop links, decisions, or context so future-you knows what to do."),
    ]
  ),
  callout("yellow", "End-of-day: move unfinished Today items to Upcoming or delete."),
];

const meetingNotesContent: TemplateContent = [
  intro("Copy this page for each meeting, or reset the sections below after each sync."),
  columns(
    [
      h3("Meeting details"),
      table(
        ["Field", "Value"],
        [
          ["Date", ""],
          ["Time", ""],
          ["Location / link", ""],
          ["Purpose", ""],
        ]
      ),
    ],
    [
      h3("Attendees"),
      bullet("You"),
      bullet("Teammate"),
      bullet("Stakeholder"),
      p(""),
    ]
  ),
  divider(),
  ...section("Agenda", [
    numbered("Status updates (5 min)"),
    numbered("Main discussion topic"),
    numbered("Decisions needed"),
    numbered("Next steps & owners"),
  ]),
  columns(
    [
      h3("Discussion notes"),
      quote("Capture key points, questions raised, and context — not a full transcript."),
    ],
    [
      h3("Decisions made"),
      callout("green", "Decision 1 — what was agreed and why."),
      callout("green", "Decision 2 — owner and deadline."),
    ]
  ),
  divider(),
  h2("Action items"),
  table(
    ["Owner", "Task", "Due date", "Status"],
    [
      ["You", "Send follow-up email", "Tomorrow", "To do"],
      ["Alex", "Update spec", "Friday", "In progress"],
      ["", "", "", ""],
    ]
  ),
];

const projectPlanContent: TemplateContent = [
  intro(
    "One page for scope, timeline, and risks — share with your team and update weekly."
  ),
  quote(
    "Project summary: what we're building, for whom, and what success looks like in one paragraph."
  ),
  divider(),
  columns(
    [
      h3("Goals"),
      bullet("Launch MVP by end of Q2"),
      bullet("Reduce onboarding time by 30%"),
      bullet("Hit 500 active users"),
    ],
    [
      h3("Success metrics"),
      table(
        ["Metric", "Target", "Current"],
        [
          ["Activation rate", "40%", ""],
          ["Weekly active users", "500", ""],
          ["NPS", "> 40", ""],
        ]
      ),
    ]
  ),
  divider(),
  h2("Milestones"),
  table(
    ["Phase", "Deliverable", "Owner", "Due date"],
    [
      ["Discovery", "Requirements & user research", "", ""],
      ["Build", "MVP feature set", "", ""],
      ["Beta", "Pilot with 10 users", "", ""],
      ["Launch", "Public release", "", ""],
    ]
  ),
  divider(),
  columns(
    [
      h3("Resources"),
      table(
        ["Type", "Details"],
        [
          ["Team", "2 engineers, 1 designer"],
          ["Tools", "Figma, GitHub, Votion"],
          ["Budget", ""],
        ]
      ),
    ],
    [
      h3("Risks & blockers"),
      callout("yellow", "Timeline risk — dependency on external API approval."),
      callout("red", "Blocker — need legal review before launch."),
    ]
  ),
];

const studyPlannerContent: TemplateContent = [
  intro(
    "Rate topic confidence 1–5, then schedule more time on weak areas before the exam."
  ),
  columns(
    [
      h3("Exam details"),
      table(
        ["Field", "Details"],
        [
          ["Subject", ""],
          ["Date", ""],
          ["Format", "Written / MCQ / Practical"],
          ["Weight", "40% of final grade"],
        ]
      ),
    ],
    [
      h3("Topics to cover"),
      table(
        ["Topic", "Confidence (1–5)", "Hours planned"],
        [
          ["Topic 1", "3", "4h"],
          ["Topic 2", "2", "6h"],
          ["Topic 3", "4", "2h"],
          ["Topic 4", "1", "8h"],
        ]
      ),
    ]
  ),
  divider(),
  h2("Study schedule"),
  table(
    ["Day", "Focus topic", "Method", "Duration"],
    [
      ["Monday", "Topic 4 — weak area", "Active recall", "2h"],
      ["Tuesday", "Topic 2", "Practice problems", "1.5h"],
      ["Wednesday", "Topic 1 & 3", "Summary notes", "2h"],
      ["Thursday", "Mixed review", "Past papers", "2h"],
      ["Friday", "Full mock exam", "Timed practice", "3h"],
    ]
  ),
  divider(),
  columns(
    [
      h3("Practice & resources"),
      bullet("Past exam papers — link or location"),
      bullet("Flashcards / Anki deck"),
      bullet("Office hours — questions to ask"),
    ],
    [
      h3("Pre-exam checklist"),
      ...checkLists(4),
    ]
  ),
];

const habitTrackerContent: TemplateContent = [
  intro(
    "Pick 3 habits max. Track daily, then reflect every Sunday — consistency beats perfection."
  ),
  h2("Habits I'm building"),
  table(
    ["Habit", "Why it matters", "Trigger / cue"],
    [
      ["Morning workout", "Energy & focus", "After coffee"],
      ["Read 20 pages", "Learning habit", "Before bed"],
      ["No phone first hour", "Deep work", "Wake up alarm"],
    ]
  ),
  divider(),
  h2("This week's tracker"),
  table(
    ["Habit", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    [
      ["Morning workout", "✓", "✓", "", "✓", "", "✓", ""],
      ["Read 20 pages", "✓", "", "✓", "✓", "✓", "", "✓"],
      ["No phone first hour", "", "✓", "✓", "", "✓", "✓", ""],
    ]
  ),
  divider(),
  columns(
    [
      h3("Weekly wins"),
      callout("green", "What habits felt easier this week?"),
    ],
    [
      h3("Adjust for next week"),
      callout("yellow", "What got in the way? One small change to try."),
    ]
  ),
];

const jobTrackerContent: TemplateContent = [
  intro(
    "Track every application in one pipeline — update status after each email or interview."
  ),
  h2("Application pipeline"),
  table(
    ["Company", "Role", "Applied", "Status", "Next step"],
    [
      ["Acme Corp", "Frontend Engineer", "Jan 12", "Interview", "Technical round Fri"],
      ["Northwind", "Product Designer", "Jan 8", "Applied", "Follow up in 1 week"],
      ["Globex", "Full-stack Dev", "Jan 15", "Offer", "Review comp package"],
      ["", "", "", "", ""],
    ]
  ),
  divider(),
  columns(
    [
      h3("Interview prep"),
      table(
        ["Company", "Round", "Date", "Notes"],
        [
          ["Acme Corp", "Technical", "", "Review React + system design"],
          ["", "Behavioural", "", "Prepare STAR stories"],
        ]
      ),
    ],
    [
      h3("Follow-ups"),
      ...checkLists(3),
      bullet("Thank-you email template saved in Notes"),
    ]
  ),
  divider(),
  ...section("Resources", [
    bullet("CV version: v3 — tailored for frontend roles"),
    bullet("Portfolio: yoursite.com"),
    bullet("Referrals: list people who can intro you"),
  ]),
];

const monthlyBudgetContent: TemplateContent = [
  intro(
    "Update Spent weekly. Remaining = Budget − Spent. Adjust categories that drift off plan."
  ),
  columns(
    [
      h3("Income this month"),
      table(
        ["Source", "Expected", "Actual"],
        [
          ["Salary", "$4,200", ""],
          ["Freelance", "$800", ""],
          ["Other", "$0", ""],
        ]
      ),
    ],
    [
      h3("Summary"),
      table(
        ["", "Amount"],
        [
          ["Total income", "$5,000"],
          ["Total spent", ""],
          ["Remaining", ""],
        ]
      ),
    ]
  ),
  divider(),
  h2("Budget by category"),
  table(
    ["Category", "Budget", "Spent", "Remaining"],
    [
      ["Housing", "$1,500", "$1,500", "$0"],
      ["Food & groceries", "$400", "$285", "$115"],
      ["Transport", "$150", "$120", "$30"],
      ["Subscriptions", "$80", "$65", "$15"],
      ["Entertainment", "$200", "$140", "$60"],
      ["Savings", "$800", "", "$800"],
    ]
  ),
  divider(),
  h2("Weekly check-in"),
  table(
    ["Week", "On track?", "Biggest spend", "Notes"],
    [
      ["Week 1", "Yes", "Groceries", ""],
      ["Week 2", "", "", ""],
      ["Week 3", "", "", ""],
      ["Week 4", "", "", ""],
    ]
  ),
  callout("yellow", "Adjustment: move unused entertainment budget to savings if under-spent."),
];

const taskDatabaseContent: TemplateContent = [
  intro(
    "Your team task board — filter by status or owner. Add rows with + Row on the table."
  ),
  h2("All tasks"),
  table(
    ["Name", "Status", "Owner", "Due date", "Priority"],
    [
      ["Design homepage", "In progress", "Sam", "Friday", "High"],
      ["Write API docs", "Not started", "Alex", "Next Mon", "Medium"],
      ["Fix checkout bug", "Blocked", "Jordan", "ASAP", "High"],
      ["Review analytics", "Done", "You", "Today", "Low"],
      ["", "", "", "", ""],
    ]
  ),
  divider(),
  columns(
    [
      h3("By status"),
      table(
        ["Status", "Count", "Tasks"],
        [
          ["In progress", "2", "Design homepage, …"],
          ["Blocked", "1", "Fix checkout bug"],
          ["Done", "1", "Review analytics"],
        ]
      ),
    ],
    [
      h3("Due this week"),
      table(
        ["Task", "Owner", "Due"],
        [
          ["Design homepage", "Sam", "Friday"],
          ["Review analytics", "You", "Today"],
          ["", "", ""],
        ]
      ),
    ]
  ),
];

const readingListContent: TemplateContent = [
  intro(
    "Move books between sections as you progress. Add key takeaways when you finish."
  ),
  columns(
    [
      h3("Currently reading"),
      table(
        ["Title", "Author", "Progress"],
        [
          ["Atomic Habits", "James Clear", "45%"],
          ["", "", ""],
        ]
      ),
    ],
    [
      h3("Want to read"),
      table(
        ["Title", "Author", "Why"],
        [
          ["Deep Work", "Cal Newport", "Focus strategies"],
          ["The Pragmatic Programmer", "Hunt & Thomas", "Career growth"],
          ["", "", ""],
        ]
      ),
    ]
  ),
  divider(),
  h2("Finished"),
  table(
    ["Title", "Author", "Rating", "Key takeaway"],
    [
      ["Thinking, Fast and Slow", "Daniel Kahneman", "★★★★☆", "Bias awareness in decisions"],
      ["", "", "", ""],
    ]
  ),
  divider(),
  ...section("Reading notes", [
    quote("Quotes, ideas, and links worth revisiting — one block per book."),
  ]),
];

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "weekly-planner",
    title: "Weekly Planner",
    icon: "📅",
    category: "productivity",
    featured: true,
    description:
      "Focus tasks, time-blocked schedule, weekend columns, and a Friday review.",
    content: weeklyPlannerContent,
  },
  {
    id: "personal-finance-tracker",
    title: "Personal Finance Tracker",
    icon: "💰",
    category: "finance",
    featured: true,
    sourceUrl: PERSONAL_FINANCE_TRACKER_SOURCE,
    description:
      "Monthly savings table plus side-by-side income and expense ledgers.",
    content: personalFinanceTrackerContent,
  },
  {
    id: "todo-list",
    title: "To-Do List",
    icon: "✅",
    category: "productivity",
    featured: true,
    description:
      "Today, upcoming, and waiting-on columns with end-of-day cleanup prompts.",
    content: todoListContent,
  },
  {
    id: "class-notes-2026",
    title: "Class Notes",
    icon: "📚",
    category: "education",
    featured: true,
    description:
      "Course hub with lecture capture, concepts, assignments, and exam prep.",
    content: classNotesContent,
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    icon: "📝",
    category: "work",
    description:
      "Agenda, live notes, decisions, and an owner-tracked action table.",
    content: meetingNotesContent,
  },
  {
    id: "project-plan",
    title: "Project Plan",
    icon: "🎯",
    category: "work",
    description:
      "Goals, metrics, milestone tracker, resources, and risk callouts.",
    content: projectPlanContent,
  },
  {
    id: "task-database",
    title: "Task Database",
    icon: "🗂️",
    category: "work",
    description:
      "Team task table with status views and a due-this-week snapshot.",
    content: taskDatabaseContent,
  },
  {
    id: "study-planner",
    title: "Study Planner",
    icon: "🎓",
    category: "education",
    description:
      "Exam countdown, confidence tracker, weekly schedule, and checklists.",
    content: studyPlannerContent,
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    icon: "💼",
    category: "work",
    description:
      "Full hiring pipeline with interview prep and follow-up tracking.",
    content: jobTrackerContent,
  },
  {
    id: "monthly-budget",
    title: "Monthly Budget",
    icon: "📊",
    category: "finance",
    description:
      "Income vs spend summary, category budgets, and weekly check-ins.",
    content: monthlyBudgetContent,
  },
  {
    id: "habit-tracker",
    title: "Habit Tracker",
    icon: "🌱",
    category: "personal",
    description:
      "Three-habit system with a Mon–Sun grid and weekly reflection.",
    content: habitTrackerContent,
  },
  {
    id: "reading-list",
    title: "Reading List",
    icon: "📖",
    category: "personal",
    description:
      "Reading queue, finished log with ratings, and notes section.",
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

export const stripDuplicatePageTitle = (
  title: string,
  content: PartialBlock<VotionBlockSchema>[]
): PartialBlock<VotionBlockSchema>[] => {
  if (content.length === 0) return content;

  const [first, ...rest] = content;
  const isDuplicateTitleHeading =
    first.type === "heading" &&
    first.props?.level === 1 &&
    getBlockPlainText(first).toLowerCase() === title.trim().toLowerCase();

  return isDuplicateTitleHeading ? rest : content;
};

export const prepareTemplateContentForDocument = (
  template: Pick<DocumentTemplate, "title" | "content">
) => stripDuplicatePageTitle(template.title, template.content);

export const serializeTemplateContent = (
  content: PartialBlock<VotionBlockSchema>[]
) => JSON.stringify(content, null, 2);

export const serializeTemplateForDocument = (
  template: Pick<DocumentTemplate, "title" | "content">
) => serializeTemplateContent(prepareTemplateContentForDocument(template));
