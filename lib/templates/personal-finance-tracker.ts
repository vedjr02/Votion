import {
  callout,
  columns,
  h1,
  h2,
  table,
  type TemplateContent,
} from "@/lib/template-blocks";

/**
 * Notion Personal Finance Tracker layout:
 * https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039
 */
export const personalFinanceTrackerContent: TemplateContent = [
  h1("Personal Finance Tracker"),
  callout(
    "blue",
    "Track income and expenses by month. Edit any cell, add rows, or use / for more blocks."
  ),
  h2("Total Savings"),
  table(
    ["Month", "Income", "Expenses", "Net"],
    [
      ["January", "$6,500", "$2,845", "$3,655"],
      ["February", "$5,100", "$2,800", "$2,300"],
      ["March", "$6,200", "$3,310", "$2,890"],
      ["April", "$5,500", "$3,295", "$2,205"],
      ["May", "$5,800", "$3,850", "$1,950"],
      ["June", "$5,400", "$2,945", "$2,455"],
      ["July", "$5,900", "$3,500", "$2,400"],
      ["August", "$6,100", "$2,600", "$3,500"],
      ["September", "$5,300", "$3,400", "$1,900"],
      ["October", "$6,000", "$4,100", "$1,900"],
      ["November", "$6,200", "$3,850", "$2,350"],
      ["December", "$7,000", "$4,000", "$3,000"],
    ]
  ),
  columns(
    [
      h2("↗ Income"),
      table(
        ["Source", "Amount", "Tags", "Date"],
        [
          ["Acme Inc.", "$5,000.00", "Salary", "January 9, 2025"],
          ["Design Agency", "$1,500.00", "Freelance", "January 25, 2025"],
          ["Brokerage Account", "$500.00", "Investment", "February 1, 2025"],
          ["", "", "", ""],
        ]
      ),
    ],
    [
      h2("↘ Expenses"),
      table(
        ["Source", "Amount", "Tags", "Date"],
        [
          ["Joe's Pizza", "$25.00", "Dining Out", "January 3, 2025"],
          ["Mortgage", "$2,500.00", "Rent/Mortgage", "January 1, 2025"],
          ["Hydro Inc.", "$120.00", "Utilities", "January 15, 2025"],
          ["", "", "", ""],
        ]
      ),
    ]
  ),
];

export const PERSONAL_FINANCE_TRACKER_SOURCE =
  "https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039";
