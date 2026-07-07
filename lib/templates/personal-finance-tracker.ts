import { callout, h1, notionColumns, notionGallery, type TemplateContent } from "@/lib/template-blocks";
import {
  financeIncomeExpensesColumns,
  financeTotalSavingsGallery,
} from "@/lib/notion-blocks/finance-data";

/**
 * Notion Personal Finance Tracker layout:
 * https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039
 */
export const personalFinanceTrackerContent: TemplateContent = [
  h1("Personal Finance Tracker"),
  callout(
    "blue",
    "Track income and expenses by month and quarter. Use the tables below like Notion databases."
  ),
  notionGallery(financeTotalSavingsGallery),
  notionColumns(financeIncomeExpensesColumns),
];

export const PERSONAL_FINANCE_TRACKER_SOURCE =
  "https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039";
