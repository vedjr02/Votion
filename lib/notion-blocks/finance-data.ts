import type {
  NotionColumnsData,
  NotionDatabaseData,
  NotionGalleryData,
} from "@/lib/notion-blocks/types";

const monthIcons = ["❄️", "❄️", "🌱", "🌱", "🌱", "☀️", "☀️", "☀️", "🍂", "🍂", "🍂", "🎄"];
const monthColors = [
  "#3b82f6", "#3b82f6", "#22c55e", "#22c55e", "#22c55e",
  "#eab308", "#eab308", "#eab308", "#ef4444", "#ef4444", "#ef4444", "#6366f1",
];

const monthStats = [
  { income: "$6,500", expenses: "$2,845", net: "$3,655" },
  { income: "$5,100", expenses: "$2,800", net: "$2,300" },
  { income: "$6,200", expenses: "$3,310", net: "$2,890" },
  { income: "$5,500", expenses: "$3,295", net: "$2,205" },
  { income: "$5,800", expenses: "$3,850", net: "$1,950" },
  { income: "$5,400", expenses: "$2,945", net: "$2,455" },
  { income: "$5,900", expenses: "$3,500", net: "$2,400" },
  { income: "$6,100", expenses: "$2,600", net: "$3,500" },
  { income: "$5,300", expenses: "$3,400", net: "$1,900" },
  { income: "$6,000", expenses: "$4,100", net: "$1,900" },
  { income: "$6,200", expenses: "$3,850", net: "$2,350" },
  { income: "$7,000", expenses: "$4,000", net: "$3,000" },
];

export const financeTotalSavingsGallery: NotionGalleryData = {
  title: "Total Savings",
  icon: "🐷",
  tabs: ["All Months", "Q1", "Q2", "Q3", "Q4"],
  activeTab: "All Months",
  items: monthStats.map((stats, index) => ({
    id: `month-${index + 1}`,
    title: `${index + 1}. ${[
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ][index]}`,
    icon: monthIcons[index],
    iconColor: monthColors[index],
    properties: [
      { label: "Income", value: stats.income },
      { label: "Expenses", value: stats.expenses },
      { label: "Net", value: stats.net },
    ],
  })),
};

export const financeIncomeDatabase: NotionDatabaseData = {
  title: "Income",
  icon: "↗",
  tabs: ["Q1", "Q2", "Q3", "Q4", "All Months"],
  activeTab: "Q1",
  columns: [
    { id: "source", label: "Source" },
    { id: "amount", label: "Amount" },
    { id: "tags", label: "Tags" },
    { id: "date", label: "Date" },
  ],
  sumColumnId: "amount",
  groups: [
    {
      title: "1. January",
      rows: [
        {
          id: "inc-jan-1",
          cells: {
            source: "Acme Inc.",
            amount: "$5,000.00",
            date: "January 9, 2025",
          },
          tags: { tags: { label: "Salary", color: "gray" } },
        },
        {
          id: "inc-jan-2",
          cells: {
            source: "Design Agency",
            amount: "$1,500.00",
            date: "January 25, 2025",
          },
          tags: { tags: { label: "Freelance", color: "gray" } },
        },
      ],
    },
    {
      title: "2. February",
      rows: [
        {
          id: "inc-feb-1",
          cells: {
            source: "Acme Inc.",
            amount: "$5,000.00",
            date: "February 9, 2025",
          },
          tags: { tags: { label: "Salary", color: "gray" } },
        },
      ],
    },
    {
      title: "3. March",
      rows: [
        {
          id: "inc-mar-1",
          cells: {
            source: "Acme Inc.",
            amount: "$5,000.00",
            date: "March 9, 2025",
          },
          tags: { tags: { label: "Salary", color: "gray" } },
        },
      ],
    },
  ],
};

export const financeExpensesDatabase: NotionDatabaseData = {
  title: "Expenses",
  icon: "↘",
  tabs: ["Q1", "Q2", "Q3", "Q4", "All Months"],
  activeTab: "Q1",
  columns: [
    { id: "source", label: "Source" },
    { id: "amount", label: "Amount" },
    { id: "tags", label: "Tags" },
    { id: "date", label: "Date" },
  ],
  sumColumnId: "amount",
  groups: [
    {
      title: "1. January",
      rows: [
        {
          id: "exp-jan-1",
          cells: {
            source: "Joe's Pizza",
            amount: "$25.00",
            date: "January 20, 2025",
          },
          tags: { tags: { label: "Dining Out", color: "blue" } },
        },
        {
          id: "exp-jan-2",
          cells: {
            source: "Mortgage",
            amount: "$2,500.00",
            date: "January 15, 2025",
          },
          tags: { tags: { label: "Rent/Mortgage", color: "red" } },
        },
        {
          id: "exp-jan-3",
          cells: {
            source: "Hydro Inc.",
            amount: "$320.00",
            date: "January 30, 2025",
          },
          tags: { tags: { label: "Utilities", color: "pink" } },
        },
      ],
    },
    {
      title: "2. February",
      rows: [
        {
          id: "exp-feb-1",
          cells: {
            source: "Mortgage",
            amount: "$2,500.00",
            date: "February 15, 2025",
          },
          tags: { tags: { label: "Rent/Mortgage", color: "red" } },
        },
        {
          id: "exp-feb-2",
          cells: {
            source: "Whole Foods",
            amount: "$300.00",
            date: "February 22, 2025",
          },
          tags: { tags: { label: "Retail", color: "gray" } },
        },
      ],
    },
    {
      title: "3. March",
      rows: [
        {
          id: "exp-mar-1",
          cells: {
            source: "Mortgage",
            amount: "$2,500.00",
            date: "March 15, 2025",
          },
          tags: { tags: { label: "Rent/Mortgage", color: "red" } },
        },
      ],
    },
  ],
};

export const financeIncomeExpensesColumns: NotionColumnsData = {
  left: financeIncomeDatabase,
  right: financeExpensesDatabase,
};
