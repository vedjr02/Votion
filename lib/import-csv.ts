import { PartialBlock } from "@blocknote/core";

import type { VotionBlockSchema } from "@/lib/block-schema";
import {
  kanbanTable,
  normalizeTableData,
  stringifyJsonProp,
  tableData,
  type ColumnType,
  type TableColumn,
  type TableData,
  type TableView,
} from "@/lib/blocks/votion-block-utils";
import { parseFlexibleDate } from "@/lib/blocks/votion-database-utils";
import { sanitizePageFilename } from "@/lib/page-filename";

export type CsvImportOptions = {
  view?: TableView;
  databaseTitle?: string;
};

const NOTION_STATUS_OPTIONS = [
  "Not started",
  "In progress",
  "Done",
  "Blocked",
  "To do",
  "Doing",
  "Complete",
  "Completed",
];

const NOTION_PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

const CHECKBOX_TRUE = new Set([
  "yes",
  "y",
  "true",
  "1",
  "checked",
  "done",
  "complete",
  "completed",
  "✓",
  "✔",
]);

const CHECKBOX_FALSE = new Set(["no", "n", "false", "0", "unchecked", ""]);

const NOTION_HEADER_HINTS: Record<ColumnType, RegExp[]> = {
  text: [],
  number: [/number/i, /amount/i, /price/i, /cost/i, /qty/i, /quantity/i, /progress/i, /total/i, /sum/i],
  checkbox: [/checkbox/i, /^done$/i, /^complete$/i, /^checked$/i],
  select: [
    /^status$/i,
    /^stage$/i,
    /^state$/i,
    /^priority$/i,
    /^tags?$/i,
    /multi-?select/i,
    /^category$/i,
    /^type$/i,
    /^select$/i,
    /^owner$/i,
    /^assignee$/i,
  ],
  date: [
    /date/i,
    /^due$/i,
    /^deadline$/i,
    /^when$/i,
    /created/i,
    /edited/i,
    /last edited/i,
  ],
};

const NOTION_TEXT_HEADERS =
  /^(name|title|url|link|website|email|phone|description|notes|summary|person|people|files|relation|rollup|formula|text)$/i;

export const parseCsv = (input: string): string[][] => {
  const text = input.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let index = 0;
  let inQuotes = false;

  while (index < text.length) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 2;
          continue;
        }
        inQuotes = false;
        index += 1;
        continue;
      }

      cell += char;
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      index += 1;
      continue;
    }

    if (char === ",") {
      row.push(cell);
      cell = "";
      index += 1;
      continue;
    }

    if (char === "\n") {
      row.push(cell);
      cell = "";
      if (row.some((value) => value.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      index += 1;
      continue;
    }

    cell += char;
    index += 1;
  }

  row.push(cell);
  if (row.some((value) => value.trim().length > 0)) {
    rows.push(row);
  }

  return rows;
};

const uniqueNonEmpty = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const looksLikeCheckboxColumn = (values: string[]) => {
  const sample = values.filter((value) => value.trim().length > 0);
  if (sample.length === 0) return false;

  return sample.every((value) => {
    const lower = value.trim().toLowerCase();
    return CHECKBOX_TRUE.has(lower) || CHECKBOX_FALSE.has(lower);
  });
};

const looksLikeNumberColumn = (values: string[]) => {
  const sample = values.filter((value) => value.trim().length > 0);
  if (sample.length === 0) return false;

  return sample.filter((value) => !Number.isNaN(parseNumber(value))).length >=
    Math.ceil(sample.length * 0.7);
};

const looksLikeDateColumn = (values: string[]) => {
  const sample = values.filter((value) => value.trim().length > 0);
  if (sample.length === 0) return false;

  return (
    sample.filter((value) => parseFlexibleDate(value) !== null).length >=
    Math.ceil(sample.length * 0.5)
  );
};

const looksLikeSelectColumn = (name: string, values: string[]) => {
  const lower = name.toLowerCase();
  if (/(tag|status|priority|stage|state|category|type|select|owner|assignee)/i.test(lower)) {
    return true;
  }

  const unique = uniqueNonEmpty(values);
  return unique.length > 1 && unique.length <= 24;
};

const parseNumber = (value: string) => {
  const cleaned = value.replace(/[$€£,\s]/g, "").replace(/[^\d.-]/g, "");
  if (!cleaned) return Number.NaN;
  return Number(cleaned);
};

const normalizeDateValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const parsed = parseFlexibleDate(trimmed);
  if (!parsed) return trimmed.replace(/^@/, "");

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeCheckboxValue = (value: string) => {
  const lower = value.trim().toLowerCase();
  if (!lower) return "false";
  return CHECKBOX_TRUE.has(lower) ? "true" : "false";
};

const normalizeSelectValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.includes(",")) {
    return trimmed.split(",")[0]?.trim() ?? trimmed;
  }

  return trimmed;
};

export const inferNotionColumnType = (
  name: string,
  values: string[]
): Omit<TableColumn, "id"> => {
  const trimmedName = name.trim() || "Column";
  const lower = trimmedName.toLowerCase();

  if (NOTION_TEXT_HEADERS.test(trimmedName) && !/date/i.test(trimmedName)) {
    return { name: trimmedName, type: "text" };
  }

  for (const [type, patterns] of Object.entries(NOTION_HEADER_HINTS) as [
    ColumnType,
    RegExp[],
  ][]) {
    if (patterns.some((pattern) => pattern.test(trimmedName))) {
      if (type === "select") {
        const discovered = uniqueNonEmpty(values);
        if (/priority/i.test(trimmedName)) {
          return {
            name: trimmedName,
            type: "select",
            options: Array.from(new Set([...NOTION_PRIORITY_OPTIONS, ...discovered])),
          };
        }
        if (/status|stage|state/i.test(trimmedName)) {
          return {
            name: trimmedName,
            type: "select",
            options: Array.from(new Set([...NOTION_STATUS_OPTIONS, ...discovered])),
          };
        }
        return {
          name: trimmedName,
          type: "select",
          options: discovered.length > 0 ? discovered : NOTION_STATUS_OPTIONS,
        };
      }

      if (type === "checkbox") {
        return { name: trimmedName, type: "checkbox" };
      }

      if (type === "date") {
        return { name: trimmedName, type: "date" };
      }

      if (type === "number") {
        return { name: trimmedName, type: "number" };
      }
    }
  }

  if (looksLikeCheckboxColumn(values)) {
    return { name: trimmedName, type: "checkbox" };
  }

  if (looksLikeDateColumn(values)) {
    return { name: trimmedName, type: "date" };
  }

  if (looksLikeNumberColumn(values)) {
    return { name: trimmedName, type: "number" };
  }

  if (looksLikeSelectColumn(trimmedName, values)) {
    const options = uniqueNonEmpty(values);
    return {
      name: trimmedName,
      type: "select",
      options: options.length > 0 ? options : NOTION_STATUS_OPTIONS,
    };
  }

  if (lower === "name" || lower === "title") {
    return { name: trimmedName, type: "text" };
  }

  return { name: trimmedName, type: "text" };
};

const normalizeCellValue = (value: string, column: TableColumn) => {
  switch (column.type) {
    case "checkbox":
      return normalizeCheckboxValue(value);
    case "date":
      return normalizeDateValue(value);
    case "number": {
      const parsed = parseNumber(value);
      return Number.isNaN(parsed) ? value.trim() : String(parsed);
    }
    case "select":
      return normalizeSelectValue(value);
    default:
      return value.trim();
  }
};

const pickDefaultView = (columns: TableColumn[]): TableView => {
  const statusColumn = columns.find((column) =>
    /status|stage|state/i.test(column.name)
  );
  const dateColumn = columns.find(
    (column) =>
      column.type === "date" ||
      /date|due|deadline/i.test(column.name.toLowerCase())
  );
  const checkboxCount = columns.filter((column) => column.type === "checkbox").length;

  if (statusColumn) return "board";
  if (checkboxCount >= 3 && dateColumn) return "gallery";
  if (dateColumn) return "calendar";
  return "table";
};

export const csvToTableData = (
  csvText: string,
  options?: CsvImportOptions
): TableData => {
  const matrix = parseCsv(csvText);
  if (matrix.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = matrix[0].map((header, index) => header.trim() || `Column ${index + 1}`);
  const body = matrix.slice(1);

  const columnValues = headers.map((_, columnIndex) =>
    body.map((row) => row[columnIndex] ?? "")
  );

  const columns: TableColumn[] = headers.map((header, index) => ({
    id: `col-${index + 1}`,
    ...inferNotionColumnType(header, columnValues[index] ?? []),
  }));

  const rows = body.map((row) =>
    Object.fromEntries(
      columns.map((column, index) => [
        column.id,
        normalizeCellValue(row[index] ?? "", column),
      ])
    )
  );

  const base = normalizeTableData({
    columns,
    rows,
    view: options?.view ?? pickDefaultView(columns),
  });

  const statusColumn = base.columns.find((column) =>
    /status|stage|state/i.test(column.name)
  );
  const dateColumn =
    base.columns.find((column) => column.type === "date") ??
    base.columns.find((column) => /date|due/i.test(column.name.toLowerCase()));

  if (base.view === "board" && statusColumn) {
    return kanbanTable(
      base.columns.map((column) => column.name),
      rows.map((row) => base.columns.map((column) => row[column.id] ?? "")),
      statusColumn.name
    );
  }

  return {
    ...base,
    groupByColumnId: statusColumn?.id ?? base.groupByColumnId,
    galleryCardColumnId: dateColumn?.id ?? base.galleryCardColumnId,
    calendarDateColumnId: dateColumn?.id ?? base.calendarDateColumnId,
  };
};

const baseBlockProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

export const csvToDatabaseBlock = (
  csvText: string,
  options?: CsvImportOptions
): PartialBlock<VotionBlockSchema> => ({
  type: "votionTable",
  props: {
    ...baseBlockProps,
    data: stringifyJsonProp(csvToTableData(csvText, options)),
  },
  children: [],
});

export const csvToPageContent = (
  csvText: string,
  options?: CsvImportOptions
): string => {
  const blocks: PartialBlock<VotionBlockSchema>[] = [];

  if (options?.databaseTitle) {
    blocks.push({
      type: "heading",
      props: { ...baseBlockProps, level: 2 },
      content: [{ type: "text", text: options.databaseTitle, styles: {} }],
      children: [],
    });
  }

  blocks.push(
    csvToDatabaseBlock(csvText, {
      ...options,
      databaseTitle: undefined,
    })
  );

  return JSON.stringify(blocks, null, 2);
};

export const parseCsvImport = (
  csvText: string,
  filename = "Imported database"
) => {
  const title =
    sanitizePageFilename(filename.replace(/\.csv$/i, "")) || "Imported database";

  return {
    title,
    content: csvToPageContent(csvText, { databaseTitle: title }),
    icon: "📊",
  };
};

export const mergeImportedCsv = (
  existingContent: string | undefined,
  csvText: string,
  mode: "replace" | "append",
  options?: CsvImportOptions
): string => {
  const importedBlocks = JSON.parse(
    csvToPageContent(csvText, options)
  ) as PartialBlock<VotionBlockSchema>[];

  if (mode === "replace" || !existingContent) {
    return JSON.stringify(importedBlocks, null, 2);
  }

  try {
    const existing = JSON.parse(existingContent) as PartialBlock<VotionBlockSchema>[];
    if (!Array.isArray(existing)) {
      return JSON.stringify(importedBlocks, null, 2);
    }

    return JSON.stringify(
      [
        ...existing,
        {
          type: "votionDivider",
          props: baseBlockProps,
          children: [],
        },
        ...importedBlocks,
      ],
      null,
      2
    );
  } catch {
    return JSON.stringify(importedBlocks, null, 2);
  }
};

export const tableDataToCsv = (data: TableData): string => {
  const headers = data.columns.map((column) => column.name);
  const escapeCell = (value: string) => {
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const lines = [
    headers.map(escapeCell).join(","),
    ...data.rows.map((row) =>
      data.columns
        .map((column) => {
          const raw = row[column.id] ?? "";
          if (column.type === "checkbox") {
            return normalizeCheckboxValue(raw) === "true" ? "Yes" : "No";
          }
          return raw;
        })
        .map(escapeCell)
        .join(",")
    ),
  ];

  return lines.join("\n");
};

export const exportContentDatabasesToCsv = (content?: string) => {
  if (!content) return [];

  try {
    const blocks = JSON.parse(content) as Array<{
      type?: string;
      props?: { data?: string };
    }>;

    if (!Array.isArray(blocks)) return [];

    return blocks
      .filter((block) => block.type === "votionTable" && block.props?.data)
      .map((block, index) => {
        const data = normalizeTableData(block.props!.data!);
        return {
          name: `database-${index + 1}.csv`,
          csv: tableDataToCsv(data),
        };
      });
  } catch {
    return [];
  }
};

export const downloadCsvFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
