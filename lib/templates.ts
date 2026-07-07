import { PartialBlock } from "@blocknote/core";

import type { VotionBlockSchema } from "@/lib/block-schema";
import {
  bullet,
  callout,
  checkItem,
  columnGroup,
  databaseTable,
  divider,
  galleryDatabase,
  getBlockPlainText,
  h2,
  h3,
  numbered,
  quote,
  smallText,
  table,
  toggle,
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
  callout(
    "blue",
    "Set your week in 10 minutes: pick 3 focus tasks, block your calendar, then review on Friday."
  ),
  h2("This week"),
  columnGroup(
    [
      h3("Focus tasks"),
      ...[
        "Ship project milestone",
        "Study for midterm",
        "Book dentist appointment",
      ].map((task) => checkItem(task)),
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
      ["Saturday", "Errands & rest", "Social", "Personal projects"],
      ["Sunday", "Meal prep", "Preview next week", "Rest"],
    ]
  ),
  divider(),
  toggle("End of week review", [
    h3("What went well?"),
    quote("Capture 2–3 wins from this week."),
    h3("What should change?"),
    quote("One habit or process to adjust for next week."),
  ]),
];

const classNotesContent: TemplateContent = [
  callout(
    "blue",
    "Duplicate this page per lecture, or duplicate the Today's lecture section inside one course hub."
  ),
  columnGroup(
    [
      h3("Course overview"),
      table(
        ["Field", "Details"],
        [
          ["Course", "CS 401 — Machine Learning"],
          ["Instructor", "Dr. Smith"],
          ["Semester", "Spring 2026"],
          ["Office hours", "Tue 2–4pm · Room 312"],
        ]
      ),
    ],
    [
      h3("Today's lecture"),
      table(
        ["Item", "Notes"],
        [
          ["Date", "March 20, 2026"],
          ["Topic", "Gradient descent & backpropagation"],
          ["Required reading", "Ch. 4 — Neural Networks"],
        ]
      ),
    ]
  ),
  divider(),
  h2("Key concepts"),
  numbered("Main idea — explain in your own words"),
  numbered("Important definition or formula"),
  numbered("Example or case study from class"),
  numbered("How this connects to last lecture"),
  divider(),
  columnGroup(
    [
      h3("Questions to review"),
      checkItem("Why does learning rate matter?"),
      checkItem("When does vanishing gradient occur?"),
      checkItem("Difference between SGD and Adam?"),
    ],
    [
      h3("Assignments & deadlines"),
      databaseTable(
        ["Assignment", "Due date", "Status"],
        [
          ["Problem set 1", "2026-03-25", "Not started"],
          ["Lab report", "2026-03-28", "In progress"],
          ["Midterm prep", "2026-04-05", "Not started"],
        ],
        "Status"
      ),
    ]
  ),
  toggle("Quick summary", [
    quote("Three-sentence summary of today's lecture — great for exam revision."),
  ]),
];

const todoListContent: TemplateContent = [
  callout(
    "blue",
    "Use Today for must-do items, Upcoming for this week, and Waiting on for blocked tasks."
  ),
  columnGroup(
    [
      h3("Today"),
      checkItem("Finish presentation slides"),
      checkItem("Reply to client email"),
      checkItem("30 min inbox zero"),
      checkItem("Review pull request"),
    ],
    [
      h3("Upcoming"),
      checkItem("Draft Q2 roadmap"),
      checkItem("Schedule team retro"),
      checkItem("Update portfolio site"),
    ],
    [
      h3("Waiting on"),
      bullet("Blocked by design review — @Alex"),
      bullet("Waiting on client feedback"),
      checkItem("Legal review on contract"),
    ]
  ),
  divider(),
  toggle("Notes & context", [
    quote("Drop links, decisions, or context so future-you knows what to do."),
    bullet("Design review doc: paste link here"),
    bullet("Client thread: paste link here"),
  ]),
  callout(
    "yellow",
    "End-of-day: move unfinished Today items to Upcoming or delete."
  ),
];

const meetingNotesContent: TemplateContent = [
  callout("blue", "Copy this page for each meeting, or reset the sections below after each sync."),
  columnGroup(
    [
      h3("Meeting details"),
      table(
        ["Field", "Value"],
        [
          ["Date", "March 20, 2026"],
          ["Time", "10:00 – 10:45 AM"],
          ["Location / link", "Zoom · Product sync"],
          ["Purpose", "Sprint planning & blockers"],
        ]
      ),
    ],
    [
      h3("Attendees"),
      bullet("You · Product"),
      bullet("Alex · Engineering"),
      bullet("Sam · Design"),
      bullet("Jordan · Stakeholder"),
    ]
  ),
  divider(),
  h2("Agenda"),
  numbered("Status updates (5 min)"),
  numbered("Main discussion topic"),
  numbered("Decisions needed"),
  numbered("Next steps & owners"),
  divider(),
  columnGroup(
    [
      h3("Discussion notes"),
      quote("Capture key points, questions raised, and context — not a full transcript."),
      bullet("Launch date confirmed for April 14"),
      bullet("Need design sign-off on onboarding flow"),
    ],
    [
      h3("Decisions made"),
      callout("green", "Decision 1 — Ship MVP with core onboarding only."),
      callout("green", "Decision 2 — Alex owns API integration by Friday."),
    ]
  ),
  divider(),
  h2("Action items"),
  databaseTable(
    ["Owner", "Task", "Due date", "Status"],
    [
      ["You", "Send follow-up email", "2026-03-21", "Not started"],
      ["Alex", "Update API spec", "2026-03-22", "In progress"],
      ["Sam", "Finalize onboarding mocks", "2026-03-24", "In progress"],
      ["Jordan", "Review comp package", "2026-03-25", "Not started"],
    ],
    "Status"
  ),
];

const projectPlanContent: TemplateContent = [
  callout(
    "blue",
    "One page for scope, timeline, and risks — share with your team and update weekly."
  ),
  quote(
    "Project summary: Launch a mobile onboarding flow that reduces drop-off by 30% before end of Q2."
  ),
  divider(),
  columnGroup(
    [
      h3("Goals"),
      bullet("Launch MVP by end of Q2"),
      bullet("Reduce onboarding time by 30%"),
      bullet("Hit 500 active users in beta"),
    ],
    [
      h3("Success metrics"),
      table(
        ["Metric", "Target", "Current"],
        [
          ["Activation rate", "40%", "28%"],
          ["Weekly active users", "500", "210"],
          ["NPS", "> 40", "36"],
        ]
      ),
    ]
  ),
  divider(),
  h2("Milestones"),
  databaseTable(
    ["Phase", "Deliverable", "Owner", "Due date", "Status"],
    [
      ["Discovery", "Requirements & user research", "You", "2026-03-01", "Done"],
      ["Build", "MVP feature set", "Alex", "2026-04-15", "In progress"],
      ["Beta", "Pilot with 10 users", "Sam", "2026-05-01", "Not started"],
      ["Launch", "Public release", "You", "2026-06-15", "Not started"],
    ],
    "Status"
  ),
  divider(),
  columnGroup(
    [
      h3("Resources"),
      table(
        ["Type", "Details"],
        [
          ["Team", "2 engineers, 1 designer"],
          ["Tools", "Figma, GitHub, Votion"],
          ["Budget", "$12,000"],
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
  callout(
    "blue",
    "Rate topic confidence 1–5, then schedule more time on weak areas before the exam."
  ),
  columnGroup(
    [
      h3("Exam details"),
      table(
        ["Field", "Details"],
        [
          ["Subject", "Data Structures & Algorithms"],
          ["Date", "April 18, 2026"],
          ["Format", "Written + coding"],
          ["Weight", "40% of final grade"],
        ]
      ),
    ],
    [
      h3("Topics to cover"),
      table(
        ["Topic", "Confidence (1–5)", "Hours planned"],
        [
          ["Graphs & BFS/DFS", "2", "6h"],
          ["Dynamic programming", "1", "8h"],
          ["Sorting & complexity", "4", "2h"],
          ["Trees & heaps", "3", "4h"],
        ]
      ),
    ]
  ),
  divider(),
  h2("Study schedule"),
  table(
    ["Day", "Focus topic", "Method", "Duration"],
    [
      ["Monday", "Dynamic programming", "Active recall", "2h"],
      ["Tuesday", "Graphs", "Practice problems", "1.5h"],
      ["Wednesday", "Trees & heaps", "Summary notes", "2h"],
      ["Thursday", "Mixed review", "Past papers", "2h"],
      ["Friday", "Full mock exam", "Timed practice", "3h"],
    ]
  ),
  divider(),
  columnGroup(
    [
      h3("Practice & resources"),
      bullet("Past exam papers — link or location"),
      bullet("LeetCode list — 20 medium problems"),
      bullet("Office hours — questions to ask"),
    ],
    [
      h3("Pre-exam checklist"),
      checkItem("Review all weak topics once"),
      checkItem("Complete 2 timed mocks"),
      checkItem("Sleep 8h night before"),
      checkItem("Pack calculator / materials"),
    ]
  ),
];

const habitTrackerContent: TemplateContent = [
  callout(
    "blue",
    "Tap habit buttons on each day card to check them off — switch views with This week / This month / Streak."
  ),
  smallText("Track daily habits · Updated today"),
  h2("Habits"),
  galleryDatabase(
    [
      "Date",
      "✍️ Journaling",
      "🏃 Running",
      "😴 8hrs sleep",
      "🧘 Meditation",
      "💧 Water",
    ],
    [
      ["March 20, 2026", "true", "true", "false", "true", "true"],
      ["March 21, 2026", "true", "false", "true", "false", "true"],
      ["March 22, 2026", "false", "true", "true", "true", "false"],
      ["March 23, 2026", "true", "true", "true", "false", "true"],
      ["March 24, 2026", "false", "false", "true", "true", "true"],
      ["March 25, 2026", "true", "true", "false", "true", "true"],
      ["March 26, 2026", "true", "false", "true", "true", "false"],
      ["March 27, 2026", "false", "true", "true", "false", "true"],
      ["March 28, 2026", "true", "true", "true", "true", "true"],
      ["March 29, 2026", "true", "false", "false", "true", "true"],
    ]
  ),
  divider(),
  columnGroup(
    [
      h3("Weekly wins"),
      callout("green", "Running felt easier — kept the 7am slot 4 days this week."),
    ],
    [
      h3("Adjust for next week"),
      callout("yellow", "Meditation slipped on busy days — try 5 min before bed instead."),
    ]
  ),
];

const jobTrackerContent: TemplateContent = [
  callout(
    "blue",
    "Track every application in one pipeline — update status after each email or interview."
  ),
  h2("Application pipeline"),
  databaseTable(
    ["Company", "Role", "Applied", "Status", "Next step"],
    [
      ["Acme Corp", "Frontend Engineer", "2026-01-12", "Interview", "Technical round Fri"],
      ["Northwind", "Product Designer", "2026-01-08", "In progress", "Follow up in 1 week"],
      ["Globex", "Full-stack Dev", "2026-01-15", "Done", "Review comp package"],
      ["Initech", "Software Engineer", "2026-01-20", "Not started", "Submit take-home"],
      ["Umbrella Co", "React Developer", "2026-01-18", "Blocked", "Waiting on recruiter"],
    ],
    "Status"
  ),
  divider(),
  columnGroup(
    [
      h3("Interview prep"),
      table(
        ["Company", "Round", "Date", "Notes"],
        [
          ["Acme Corp", "Technical", "2026-03-22", "Review React + system design"],
          ["Acme Corp", "Behavioural", "2026-03-25", "Prepare STAR stories"],
          ["Northwind", "Portfolio review", "2026-03-28", "Walk through 2 case studies"],
        ]
      ),
    ],
    [
      h3("Follow-ups"),
      checkItem("Thank-you email to Acme recruiter"),
      checkItem("Send portfolio link to Northwind"),
      checkItem("Update CV with latest project"),
      bullet("Referrals: @Jamie at Globex, @Priya at Initech"),
    ]
  ),
  toggle("Resources", [
    bullet("CV version: v3 — tailored for frontend roles"),
    bullet("Portfolio: yoursite.com"),
    bullet("Salary target: €65k – €75k"),
  ]),
];

const monthlyBudgetContent: TemplateContent = [
  callout(
    "blue",
    "Update Spent weekly. Remaining = Budget − Spent. Adjust categories that drift off plan."
  ),
  columnGroup(
    [
      h3("Income this month"),
      table(
        ["Source", "Expected", "Actual"],
        [
          ["Salary", "$4,200", "$4,200"],
          ["Freelance", "$800", "$650"],
          ["Other", "$0", "$0"],
        ]
      ),
    ],
    [
      h3("Summary"),
      table(
        ["", "Amount"],
        [
          ["Total income", "$4,850"],
          ["Total spent", "$2,910"],
          ["Remaining", "$1,940"],
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
      ["Savings", "$800", "$800", "$0"],
    ]
  ),
  divider(),
  h2("Weekly check-in"),
  table(
    ["Week", "On track?", "Biggest spend", "Notes"],
    [
      ["Week 1", "Yes", "Groceries", "Under budget on dining out"],
      ["Week 2", "Yes", "Transport", "Extra taxi rides"],
      ["Week 3", "", "", ""],
      ["Week 4", "", "", ""],
    ]
  ),
  callout(
    "yellow",
    "Adjustment: move unused entertainment budget to savings if under-spent."
  ),
];

const taskDatabaseContent: TemplateContent = [
  callout(
    "blue",
    "Team task board — switch to Board view to drag by status, or filter with the toolbar."
  ),
  h2("All tasks"),
  databaseTable(
    ["Name", "Status", "Owner", "Due date", "Priority"],
    [
      ["Design homepage", "In progress", "Sam", "2026-03-22", "High"],
      ["Write API docs", "Not started", "Alex", "2026-03-24", "Medium"],
      ["Fix checkout bug", "Blocked", "Jordan", "2026-03-21", "High"],
      ["Review analytics", "Done", "You", "2026-03-20", "Low"],
      ["Ship onboarding v2", "In progress", "You", "2026-03-28", "High"],
      ["Update changelog", "Not started", "Alex", "2026-03-25", "Low"],
    ],
    "Status"
  ),
  divider(),
  columnGroup(
    [
      h3("Due this week"),
      table(
        ["Task", "Owner", "Due"],
        [
          ["Design homepage", "Sam", "Fri"],
          ["Fix checkout bug", "Jordan", "ASAP"],
          ["Review analytics", "You", "Today"],
        ]
      ),
    ],
    [
      h3("Blocked"),
      bullet("Fix checkout bug — waiting on payment API"),
      bullet("Legal review — contract template"),
    ]
  ),
];

const readingListContent: TemplateContent = [
  callout(
    "blue",
    "Move books between sections as you progress. Add key takeaways when you finish."
  ),
  h2("Library"),
  databaseTable(
    ["Title", "Author", "Status", "Rating", "Notes"],
    [
      ["Atomic Habits", "James Clear", "In progress", "—", "45% through"],
      ["Deep Work", "Cal Newport", "Not started", "—", "Focus strategies"],
      ["Thinking, Fast and Slow", "Daniel Kahneman", "Done", "4", "Bias awareness"],
      ["The Pragmatic Programmer", "Hunt & Thomas", "Not started", "—", "Career growth"],
      ["Project Hail Mary", "Andy Weir", "In progress", "—", "Sci-fi break"],
    ],
    "Status"
  ),
  divider(),
  toggle("Reading notes", [
    quote("Quotes, ideas, and links worth revisiting — one block per book."),
    h3("Atomic Habits"),
    bullet("1% improvements compound — focus on systems not goals"),
    h3("Thinking, Fast and Slow"),
    bullet("System 1 vs System 2 — watch for anchoring bias"),
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
      "Gallery savings overview plus side-by-side income and expense ledgers.",
    content: personalFinanceTrackerContent,
  },
  {
    id: "todo-list",
    title: "To-Do List",
    icon: "✅",
    category: "productivity",
    featured: true,
    description:
      "Notion-style 3-column task board with Today, Upcoming, and Waiting on sections.",
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
      "Kanban pipeline with interview prep, follow-ups, and collapsible resources.",
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
      "Notion-style daily habit cards with checkbox buttons, view tabs, and streak filter.",
    content: habitTrackerContent,
  },
  {
    id: "reading-list",
    title: "Reading List",
    icon: "📖",
    category: "personal",
    description:
      "Board view library with status, ratings, and expandable reading notes.",
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
