import type { TableColumn, TableData, TableView } from "@/lib/blocks/votion-block-utils";

export type DatabaseViewTab = {
  id: string;
  label: string;
  icon?: string;
  view: TableView;
  filterPreset?: "all" | "week" | "month" | "streak";
};

export type RowEntry = {
  row: Record<string, string>;
  rowIndex: number;
};

export const defaultDatabaseViewTabs = (): DatabaseViewTab[] => [
  { id: "table", label: "All", view: "table", filterPreset: "all" },
  {
    id: "week",
    label: "This week",
    icon: "📅",
    view: "gallery",
    filterPreset: "week",
  },
  {
    id: "month",
    label: "This month",
    icon: "🗓️",
    view: "gallery",
    filterPreset: "month",
  },
  {
    id: "streak",
    label: "Streak",
    icon: "🔥",
    view: "gallery",
    filterPreset: "streak",
  },
];

export const getActiveViewTab = (data: TableData) => {
  const tabs = data.viewTabs ?? defaultDatabaseViewTabs();
  return (
    tabs.find((tab) => tab.id === data.activeViewTabId) ??
    tabs[0] ??
    defaultDatabaseViewTabs()[0]
  );
};

export const parseFlexibleDate = (value: string) => {
  const cleaned = value.replace(/^@/, "").trim();
  if (!cleaned) return null;

  const parsed = Date.parse(cleaned);
  if (Number.isNaN(parsed)) return null;

  return new Date(parsed);
};

export const isTruthy = (value: string) =>
  value === "true" ||
  value === "1" ||
  value.toLowerCase() === "yes" ||
  value === "✓" ||
  value === "✔";

export const getCardTitle = (data: TableData, row: Record<string, string>) => {
  const titleColumn =
    (data.galleryCardColumnId
      ? data.columns.find((column) => column.id === data.galleryCardColumnId)
      : undefined) ??
    data.columns.find((column) => column.name.toLowerCase() === "date") ??
    data.columns.find((column) => column.name.toLowerCase() === "name") ??
    data.columns.find((column) => column.type === "text");

  const value = titleColumn ? row[titleColumn.id]?.trim() : "";
  if (!value) return "Untitled";

  return value.startsWith("@") ? value : `@${value}`;
};

export const getCheckboxColumns = (data: TableData) =>
  data.columns.filter((column) => column.type === "checkbox");

export const getDetailColumns = (data: TableData, groupColumnId?: string) =>
  data.columns.filter(
    (column) =>
      column.id !== groupColumnId &&
      column.id !== data.galleryCardColumnId &&
      column.type !== "checkbox"
  );

export const applySearchFilter = (data: TableData, entries: RowEntry[]) => {
  const query = data.filterText?.trim().toLowerCase();
  if (!query) return entries;

  return entries.filter(({ row }) =>
    data.columns.some((column) =>
      (row[column.id] ?? "").toLowerCase().includes(query)
    )
  );
};

export const applyViewPresetFilter = (
  data: TableData,
  entries: RowEntry[],
  preset?: DatabaseViewTab["filterPreset"]
) => {
  if (!preset || preset === "all") return entries;

  const dateColumn =
    data.columns.find((column) => column.id === data.galleryCardColumnId) ??
    data.columns.find((column) => column.name.toLowerCase() === "date") ??
    data.columns.find((column) => column.type === "date");

  const now = new Date();

  if (preset === "streak") {
    const checkboxColumns = getCheckboxColumns(data);
    if (checkboxColumns.length === 0) return entries;

    return entries.filter(({ row }) =>
      checkboxColumns.every((column) => isTruthy(row[column.id] ?? ""))
    );
  }

  if (!dateColumn) return entries;

  return entries.filter(({ row }) => {
    const parsed = parseFlexibleDate(row[dateColumn.id] ?? "");
    if (!parsed) return preset === "month";

    if (preset === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return parsed >= start && parsed < end;
    }

    if (preset === "month") {
      return (
        parsed.getFullYear() === now.getFullYear() &&
        parsed.getMonth() === now.getMonth()
      );
    }

    return true;
  });
};

export const getFilteredRowEntries = (data: TableData, preset?: DatabaseViewTab["filterPreset"]) => {
  const entries = data.rows.map((row, rowIndex) => ({ row, rowIndex }));
  const searched = applySearchFilter(data, entries);
  return applyViewPresetFilter(data, searched, preset);
};

export const sortRowEntries = (data: TableData, entries: RowEntry[]) => {
  if (!data.sortColumnId) return entries;

  const column = data.columns.find((item) => item.id === data.sortColumnId);
  if (!column) return entries;

  return [...entries].sort((a, b) => {
    const left = a.row[column.id] ?? "";
    const right = b.row[column.id] ?? "";

    if (column.type === "number") {
      const diff = Number(left) - Number(right);
      return data.sortDirection === "desc" ? -diff : diff;
    }

    if (column.type === "checkbox") {
      const diff = Number(isTruthy(left)) - Number(isTruthy(right));
      return data.sortDirection === "desc" ? -diff : diff;
    }

    const diff = left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return data.sortDirection === "desc" ? -diff : diff;
  });
};

export const getBoardGroups = (data: TableData, groupColumn: TableColumn) => {
  const optionSet = new Set(groupColumn.options ?? []);
  for (const row of data.rows) {
    const value = row[groupColumn.id]?.trim();
    if (value) optionSet.add(value);
  }

  const groups = Array.from(optionSet);
  if (groups.length === 0) {
    groups.push("No status");
  }

  return groups;
};

export const createEmptyRow = (data: TableData, overrides: Record<string, string> = {}) =>
  Object.fromEntries([
    ...data.columns.map((column) => [column.id, ""]),
    ...Object.entries(overrides),
  ]);

export const createColumn = (data: TableData, type: TableColumn["type"] = "text") => {
  const nextIndex = data.columns.length + 1;
  return {
    id: `col-${nextIndex}-${Date.now()}`,
    name: type === "checkbox" ? `Habit ${nextIndex}` : `Column ${nextIndex}`,
    type,
    options:
      type === "select"
        ? ["Not started", "In progress", "Done", "Blocked"]
        : undefined,
  } as TableColumn;
};
