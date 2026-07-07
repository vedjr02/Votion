export type ColumnType = "text" | "number" | "checkbox" | "select" | "date";

export type TableColumn = {
  id: string;
  name: string;
  type: ColumnType;
  options?: string[];
};

export type TableView = "table" | "board";

export type TableData = {
  columns: TableColumn[];
  rows: Record<string, string>[];
  view: TableView;
  groupByColumnId?: string;
};

type LegacyTableData = {
  headers?: string[];
  rows?: string[][];
};

const defaultSelectOptions = ["Not started", "In progress", "Done", "Blocked"];

const inferColumnType = (name: string): TableColumn => {
  const lower = name.toLowerCase();

  if (lower === "status") {
    return {
      id: "",
      name,
      type: "select",
      options: defaultSelectOptions,
    };
  }

  if (lower.includes("due") || lower.includes("date")) {
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

    return {
      columns,
      rows: data.rows,
      view: data.view ?? "table",
      groupByColumnId:
        data.groupByColumnId ?? selectColumn?.id ?? columns[0]?.id,
    };
  }

  if (Array.isArray(data.headers) && Array.isArray(data.rows)) {
    const columns = data.headers.map((name, index) => {
      const inferred = inferColumnType(name);
      return {
        ...inferred,
        id: `col-${index + 1}`,
      };
    });

    const rows = data.rows.map((row) =>
      Object.fromEntries(
        columns.map((column, index) => [column.id, row[index] ?? ""])
      )
    );

    const statusColumn = columns.find(
      (column) => column.name.toLowerCase() === "status"
    );

    return {
      columns,
      rows,
      view: statusColumn ? "board" : "table",
      groupByColumnId: statusColumn?.id ?? columns[0]?.id,
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

export const getTableHeaders = (data: TableData) =>
  data.columns.map((column) => column.name);

export const getTableRows = (data: TableData) =>
  data.rows.map((row) => data.columns.map((column) => row[column.id] ?? ""));
