import {
  callout,
  columnGroup,
  galleryDatabase,
  h2,
  smallText,
  table,
  type TemplateContent,
} from "@/lib/template-blocks";

/**
 * Notion Personal Finance Tracker layout:
 * https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039
 */
export const personalFinanceTrackerContent: TemplateContent = [
  callout(
    "blue",
    "Track income and expenses by month. Click any cell to edit, add rows with + New, or switch database views from the toolbar."
  ),
  smallText("Last updated · Today"),
  h2("Total Savings"),
  galleryDatabase(
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
  columnGroup(
    [
      h2("↗ Income"),
      table(
        ["Source", "Amount", "Tags", "Date"],
        [
          ["Acme Inc.", "$5,000.00", "Salary", "2025-01-09"],
          ["Design Agency", "$1,500.00", "Freelance", "2025-01-25"],
          ["Brokerage Account", "$500.00", "Investment", "2025-02-01"],
          ["Side project", "$350.00", "Freelance", "2025-02-14"],
          ["", "", "", ""],
        ]
      ),
    ],
    [
      h2("↘ Expenses"),
      table(
        ["Source", "Amount", "Tags", "Date"],
        [
          ["Joe's Pizza", "$25.00", "Dining Out", "2025-01-03"],
          ["Mortgage", "$2,500.00", "Rent/Mortgage", "2025-01-01"],
          ["Hydro Inc.", "$120.00", "Utilities", "2025-01-15"],
          ["Spotify", "$11.99", "Subscriptions", "2025-01-18"],
          ["", "", "", ""],
        ]
      ),
    ]
  ),
  callout(
    "yellow",
    "Tip: Set aside a portion of freelance and side income for tax each month."
  ),
];

export const PERSONAL_FINANCE_TRACKER_SOURCE =
  "https://notion.notion.site/Personal-Finance-Tracker-901648e0ed924bde8a2b07989a1df039";
