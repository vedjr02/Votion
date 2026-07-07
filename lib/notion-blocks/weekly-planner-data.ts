import type {
  NotionColumnsData,
  NotionDatabaseData,
  NotionGalleryData,
} from "@/lib/notion-blocks/types";

export const weeklyFocusGallery: NotionGalleryData = {
  title: "This week's focus",
  icon: "🎯",
  tabs: ["This week", "Next week"],
  activeTab: "This week",
  items: [
    {
      id: "focus-1",
      title: "Top priority",
      icon: "⭐",
      iconColor: "#eab308",
      properties: [
        { label: "Status", value: "In progress" },
        { label: "Due", value: "Friday" },
      ],
    },
    {
      id: "focus-2",
      title: "Secondary goal",
      icon: "📌",
      iconColor: "#3b82f6",
      properties: [
        { label: "Status", value: "Not started" },
        { label: "Due", value: "Thursday" },
      ],
    },
    {
      id: "focus-3",
      title: "Something to look forward to",
      icon: "🎉",
      iconColor: "#22c55e",
      properties: [
        { label: "Status", value: "Planned" },
        { label: "When", value: "Weekend" },
      ],
    },
  ],
};

export const weeklyScheduleDatabase: NotionDatabaseData = {
  title: "Weekly schedule",
  icon: "📅",
  tabs: ["Mon–Fri", "Weekend", "All"],
  activeTab: "Mon–Fri",
  columns: [
    { id: "day", label: "Day" },
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
  ],
  groups: [
    {
      title: "Weekdays",
      rows: [
        { id: "mon", cells: { day: "Monday", morning: "", afternoon: "", evening: "" } },
        { id: "tue", cells: { day: "Tuesday", morning: "", afternoon: "", evening: "" } },
        { id: "wed", cells: { day: "Wednesday", morning: "", afternoon: "", evening: "" } },
        { id: "thu", cells: { day: "Thursday", morning: "", afternoon: "", evening: "" } },
        { id: "fri", cells: { day: "Friday", morning: "", afternoon: "", evening: "" } },
      ],
    },
  ],
};

export const weeklyWeekendColumns: NotionColumnsData = {
  left: {
    title: "Saturday",
    icon: "☀️",
    tabs: ["Plan"],
    columns: [
      { id: "time", label: "Time" },
      { id: "activity", label: "Activity" },
    ],
    groups: [
      {
        title: "Saturday plan",
        rows: [
          { id: "sat-am", cells: { time: "Morning", activity: "" } },
          { id: "sat-pm", cells: { time: "Afternoon", activity: "" } },
        ],
      },
    ],
  },
  right: {
    title: "Sunday",
    icon: "🌙",
    tabs: ["Plan"],
    columns: [
      { id: "time", label: "Time" },
      { id: "activity", label: "Activity" },
    ],
    groups: [
      {
        title: "Sunday plan",
        rows: [
          { id: "sun-am", cells: { time: "Morning", activity: "" } },
          { id: "sun-pm", cells: { time: "Afternoon", activity: "" } },
        ],
      },
    ],
  },
};
