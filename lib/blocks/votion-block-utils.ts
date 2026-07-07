export type TableData = {
  headers: string[];
  rows: string[][];
};

export const parseJsonProp = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const stringifyJsonProp = <T>(value: T): string => JSON.stringify(value);

export const emptyTable = (columns = 3, rows = 2): TableData => ({
  headers: Array.from({ length: columns }, (_, index) => `Column ${index + 1}`),
  rows: Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => "")
  ),
});

export const tableData = (headers: string[], rows: string[][]): TableData => ({
  headers,
  rows,
});
