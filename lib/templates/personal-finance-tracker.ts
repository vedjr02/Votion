import {
  bullet,
  callout,
  divider,
  h1,
  h2,
  h3,
  p,
  section,
  table,
  tableWithEmptyRows,
  twoColumns,
  type TemplateContent,
} from "@/lib/template-blocks";

/**
 * Recreation of Notion's official Personal Finance Tracker template:
 * https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a1df039
 *
 * Includes quarterly overview, income & expense tables, and tax set-aside prompts
 * (database automations are approximated with structured tables in Votion).
 */
export const personalFinanceTrackerContent: TemplateContent = [
  h1("Personal Finance Tracker"),
  p(
    "Track your income and expenses in one place. Log entries in the tables below to maintain an accurate financial journal."
  ),
  callout(
    "blue",
    "💡 Tip: Set aside money for tax on taxable income streams (salary, freelance, side income)."
  ),
  divider(),
  ...section("Overview", [
    ...table(
      ["", "This month", "This year"],
      [
        ["Total income", "", ""],
        ["Total expenses", "", ""],
        ["Net", "", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Yearly quarters", [
    p("Review income and expenses by quarter throughout the year."),
    ...table(
      ["Quarter", "Income", "Expenses", "Net"],
      [
        ["Q1", "", "", ""],
        ["Q2", "", "", ""],
        ["Q3", "", "", ""],
        ["Q4", "", "", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Income", [
    callout(
      "green",
      "Add salary, freelance payments, and other income. Date is filled when you log each entry."
    ),
    h3("Income table"),
    ...tableWithEmptyRows(
      ["Name", "Date", "Amount", "Category", "Quarter", "Set aside for tax"],
      5
    ),
    h3("Income categories"),
    bullet("Salary"),
    bullet("Freelance"),
    bullet("Side income"),
    bullet("Investment"),
    bullet("Other"),
  ]),
  divider(),
  ...section("Expenses", [
    callout(
      "yellow",
      "Log every purchase with category and amount so you know where your money goes."
    ),
    h3("Expenses table"),
    ...tableWithEmptyRows(
      ["Name", "Date", "Amount", "Category", "Quarter"],
      5
    ),
    h3("Expense categories"),
    bullet("Housing"),
    bullet("Food & groceries"),
    bullet("Transport"),
    bullet("Subscriptions"),
    bullet("Entertainment"),
    bullet("Shopping"),
    bullet("Health"),
    bullet("Other"),
  ]),
  divider(),
  ...twoColumns(
    "Income by category (year)",
    "Expenses by category (year)",
    ["Salary", "Freelance", "Side income", "Other"],
    ["Housing", "Food", "Transport", "Subscriptions", "Other"]
  ),
  divider(),
  ...section("Monthly snapshot", [
    ...table(
      ["Month", "Income", "Expenses", "Net"],
      [
        ["January", "", "", ""],
        ["February", "", "", ""],
        ["March", "", "", ""],
        ["April", "", "", ""],
        ["May", "", "", ""],
        ["June", "", "", ""],
        ["July", "", "", ""],
        ["August", "", "", ""],
        ["September", "", "", ""],
        ["October", "", "", ""],
        ["November", "", "", ""],
        ["December", "", "", ""],
      ]
    ),
  ]),
  divider(),
  ...section("Notes & reminders", [
    callout("gray"),
    bullet("Review totals at the end of each month"),
    bullet("Update quarter summaries when logging bulk entries"),
    bullet("Keep tax set-aside amounts in a separate savings account"),
  ]),
];

export const PERSONAL_FINANCE_TRACKER_SOURCE =
  "https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039";
