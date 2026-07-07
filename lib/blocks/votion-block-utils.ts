export type ColumnType = "text" | "number" | "checkbox" | "select" | "date";

export type TableColumn = {
  id: string;
  name: string;
  type: ColumnType;
  options?: string[];
};

export type TableView =
  | "table"
  | "board"
  | "gallery"
  | "list"
  | "feed"
  | "dashboard"
  | "calendar"
  | "timeline"
  | "map"
  | "chart";

export type DatabaseViewTab = {
  id: string;
  label: string;
  icon?: string;
  view: TableView;
  filterPreset?: "all" | "week" | "month" | "streak";
};

export type TableData = {
  columns: TableColumn[];
  rows: Record<string, string>[];
  view: TableView;
  groupByColumnId?: string;
  galleryCardColumnId?: string;
  calendarDateColumnId?: string;
  filterText?: string;
  sortColumnId?: string;
  sortDirection?: "asc" | "desc";
  activeViewTabId?: string;
  viewTabs?: DatabaseViewTab[];
  showSearch?: boolean;
  showFilterPanel?: boolean;
  showSortPanel?: boolean;
};

type LegacyTableData = {
  headers?: string[];
  rows?: string[][];
};

const defaultSelectOptions = ["Not started", "In progress", "Done", "Blocked"];

const isCheckboxTrue = (value: string) =>
  value === "true" ||
  value === "1" ||
  value.toLowerCase() === "yes" ||
  value === "✓" ||
  value === "✔";

const inferColumnType = (name: string, index: number): TableColumn => {
  const lower = name.toLowerCase();

  if (
    index > 0 &&
    (/^[\p{Extended_Pictographic}]/u.test(name.trim()) ||
      /^(mon|tue|wed|thu|fri|sat|sun)$/i.test(lower) ||
      lower.includes("habit") ||
      lower.includes("sleep") ||
      lower.includes("journal") ||
      lower.includes("meditat") ||
      lower.includes("running"))
  ) {
    return { id: "", name, type: "checkbox" };
  }

  if (lower === "status") {
    return {
      id: "",
      name,
      type: "select",
      options: defaultSelectOptions,
    };
  }

  if (lower.includes("due") || lower.includes("date") || lower === "day") {
    return { id: "", name, type: "date" };
  }

  if (lower === "priority") {
    return {
      id: "",
      name,
      type: "select",
      options: ["Low", "Medium", "High"],
    };
  }

  if (
    lower.includes("on track") ||
    lower.startsWith("done") ||
    lower === "checked"
  ) {
    return { id: "", name, type: "checkbox" };
  }

  return { id: "", name, type: "text" };
};

export const parseJsonProp = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const stringifyJsonProp = <T>(value: T): string => JSON.stringify(value);

export const emptyTable = (columnCount = 3, rowCount = 2): TableData => {
  const columns: TableColumn[] = Array.from({ length: columnCount }, (_, index) => ({
    id: `col-${index + 1}`,
    name: `Column ${index + 1}`,
    type: "text",
  }));

  return {
    columns,
    rows: Array.from({ length: rowCount }, () =>
      Object.fromEntries(columns.map((column) => [column.id, ""]))
    ),
    view: "table",
    groupByColumnId: columns[0]?.id,
  };
};

export const normalizeTableData = (
  value: unknown,
  fallback: TableData = emptyTable()
): TableData => {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  const data = value as Partial<TableData & LegacyTableData>;

  if (Array.isArray(data.columns) && Array.isArray(data.rows)) {
    const columns = data.columns.map((column, index) => ({
      ...column,
      id: column.id || `col-${index + 1}`,
      type: column.type ?? "text",
      options:
        column.type === "select"
          ? column.options?.length
            ? column.options
            : defaultSelectOptions
          : column.options,
    }));

    const selectColumn = columns.find((column) => column.type === "select");
    const dateColumn =
      columns.find((column) => column.name.toLowerCase() === "date") ??
      columns.find((column) => column.type === "date");

    return {
      columns,
      rows: data.rows,
      view: data.view ?? "table",
      groupByColumnId:
        data.groupByColumnId ?? selectColumn?.id ?? columns[0]?.id,
      galleryCardColumnId:
        data.galleryCardColumnId ?? dateColumn?.id ?? columns[0]?.id,
      calendarDateColumnId:
        data.calendarDateColumnId ?? dateColumn?.id ?? columns[0]?.id,
      filterText: data.filterText ?? "",
      sortColumnId: data.sortColumnId,
      sortDirection: data.sortDirection ?? "asc",
      activeViewTabId: data.activeViewTabId,
      viewTabs: data.viewTabs,
      showSearch: data.showSearch ?? false,
      showFilterPanel: data.showFilterPanel ?? false,
      showSortPanel: data.showSortPanel ?? false,
    };
  }

  if (Array.isArray(data.headers) && Array.isArray(data.rows)) {
    const columns = data.headers.map((name, index) => {
      const inferred = inferColumnType(name, index);
      return {
        ...inferred,
        id: `col-${index + 1}`,
      };
    });

    const rows = data.rows.map((row) =>
      Object.fromEntries(
        columns.map((column, index) => {
          const raw = row[index] ?? "";
          if (column.type === "checkbox") {
            return [column.id, isCheckboxTrue(raw) ? "true" : "false"];
          }
          return [column.id, raw];
        })
      )
    );

    const statusColumn = columns.find(
      (column) => column.name.toLowerCase() === "status"
    );
    const dateColumn =
      columns.find((column) => column.name.toLowerCase() === "date") ??
      columns.find((column) => column.type === "date");
    const checkboxCount = columns.filter((column) => column.type === "checkbox").length;

    const defaultView =
      checkboxCount >= 3 && dateColumn ? "gallery" : statusColumn ? "board" : "table";

    return {
      columns,
      rows,
      view: defaultView,
      groupByColumnId: statusColumn?.id ?? columns[0]?.id,
      galleryCardColumnId: dateColumn?.id ?? columns[0]?.id,
      calendarDateColumnId: dateColumn?.id ?? columns[0]?.id,
      filterText: "",
      activeViewTabId: defaultView === "gallery" ? "week" : undefined,
      viewTabs:
        defaultView === "gallery"
          ? [
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
            ]
          : undefined,
    };
  }

  return fallback;
};

export const tableData = (headers: string[], rows: string[][]): TableData =>
  normalizeTableData({ headers, rows });

export const kanbanTable = (
  headers: string[],
  rows: string[][],
  groupByHeader = "Status"
): TableData => {
  const data = normalizeTableData({ headers, rows });
  const groupColumn = data.columns.find(
    (column) => column.name.toLowerCase() === groupByHeader.toLowerCase()
  );

  return {
    ...data,
    view: "board",
    groupByColumnId: groupColumn?.id ?? data.columns[0]?.id,
  };
};

export const withDatabaseView = (data: TableData, view: TableView): TableData => {
  const dateColumn =
    data.columns.find((column) => column.name.toLowerCase() === "date") ??
    data.columns.find((column) => column.type === "date");
  const selectColumn = data.columns.find((column) => column.type === "select");
  const titleColumn =
    data.columns.find((column) => column.name.toLowerCase() === "name") ??
    data.columns[0];

  return {
    ...data,
    view,
    groupByColumnId:
      view === "board"
        ? (data.groupByColumnId ?? selectColumn?.id ?? data.columns[0]?.id)
        : data.groupByColumnId,
    galleryCardColumnId:
      view === "gallery" || view === "feed"
        ? (data.galleryCardColumnId ?? dateColumn?.id ?? titleColumn?.id)
        : data.galleryCardColumnId,
    calendarDateColumnId:
      view === "calendar" || view === "timeline"
        ? (data.calendarDateColumnId ?? dateColumn?.id ?? data.columns[0]?.id)
        : data.calendarDateColumnId,
  };
};

export const galleryTable = (
  headers: string[],
  rows: string[][],
  options?: {
    viewTabs?: DatabaseViewTab[];
    activeViewTabId?: string;
    galleryCardColumnId?: string;
  }
): TableData => {
  const data = normalizeTableData({ headers, rows });
  const dateColumn =
    data.columns.find((column) => column.name.toLowerCase() === "date") ??
    data.columns[0];

  return {
    ...data,
    view: "gallery",
    galleryCardColumnId: options?.galleryCardColumnId ?? dateColumn?.id,
    activeViewTabId: options?.activeViewTabId ?? "week",
    viewTabs:
      options?.viewTabs ??
      [
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
      ],
  };
};

export const getTableHeaders = (data: TableData) =>
  data.columns.map((column) => column.name);

export const getTableRows = (data: TableData) =>
  data.rows.map((row) => data.columns.map((column) => row[column.id] ?? ""));

export const filterTableRows = (data: TableData) => {
  const query = data.filterText?.trim().toLowerCase();
  if (!query) return data.rows;

  return data.rows.filter((row) =>
    data.columns.some((column) =>
      (row[column.id] ?? "").toLowerCase().includes(query)
    )
  );
};

export const filterTableRowEntries = (data: TableData) => {
  const query = data.filterText?.trim().toLowerCase();

  return data.rows
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) =>
      !query
        ? true
        : data.columns.some((column) =>
            (row[column.id] ?? "").toLowerCase().includes(query)
          )
    );
};
