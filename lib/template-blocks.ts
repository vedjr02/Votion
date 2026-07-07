import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";
import {
  blockWithText,
  emptyBlock,
  emptyCheckListItems,
} from "@/lib/editor-blocks";
import type {
  NotionColumnsData,
  NotionDatabaseData,
  NotionGalleryData,
} from "@/lib/notion-blocks/types";
import { stringifyJsonProp } from "@/lib/notion-blocks/types";

export type TemplateBlock = PartialBlock<VotionBlockSchema>;
export type TemplateContent = TemplateBlock[];

const text = (value: string) => [
  { type: "text" as const, text: value, styles: {} },
];

const baseProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

export const h1 = (value: string): TemplateBlock => ({
  type: "heading",
  props: { ...baseProps, level: 1 },
  content: text(value),
  children: [],
});

export const h2 = (value: string): TemplateBlock => ({
  type: "heading",
  props: { ...baseProps, level: 2 },
  content: text(value),
  children: [],
});

export const h3 = (value: string): TemplateBlock => ({
  type: "heading",
  props: { ...baseProps, level: 3 },
  content: text(value),
  children: [],
});

export const p = (value: string): TemplateBlock => ({
  type: "paragraph",
  props: baseProps,
  content: text(value),
  children: [],
});

export const bullet = (value: string): TemplateBlock => ({
  type: "bulletListItem",
  props: baseProps,
  content: text(value),
  children: [],
});

export const numbered = (value: string): TemplateBlock => ({
  type: "numberedListItem",
  props: baseProps,
  content: text(value),
  children: [],
});

export const checkList = (): TemplateBlock =>
  emptyBlock("checkListItem", { checked: false });

export const checkLists = (count: number) => emptyCheckListItems(count);

export const callout = (
  color: "blue" | "yellow" | "green" | "red" | "gray",
  value = ""
): TemplateBlock =>
  value
    ? blockWithText("paragraph", value, { backgroundColor: color })
    : emptyBlock("paragraph", { backgroundColor: color });

export const quote = (value = ""): TemplateBlock => callout("gray", value);

export const divider = (): TemplateBlock =>
  blockWithText("paragraph", "────────────", {
    textAlignment: "center",
    backgroundColor: "default",
  });

export const tableRow = (...cells: string[]): TemplateBlock =>
  blockWithText("paragraph", `| ${cells.join(" | ")} |`, {}, { code: true });

export const tableSep = (columns: number): TemplateBlock =>
  tableRow(...Array.from({ length: columns }, () => "---"));

export const table = (
  headers: string[],
  rows: string[][] = []
): TemplateContent => [
  tableRow(...headers),
  tableSep(headers.length),
  ...rows.map((row) =>
    tableRow(...headers.map((_, index) => row[index] ?? ""))
  ),
];

export const tableWithEmptyRows = (
  headers: string[],
  emptyRows = 4
): TemplateContent => [
  ...table(
    headers,
    Array.from({ length: emptyRows }, () => headers.map(() => ""))
  ),
];

export const twoColumns = (
  leftTitle: string,
  rightTitle: string,
  leftRows: string[] = [""],
  rightRows: string[] = [""]
): TemplateContent => {
  const rowCount = Math.max(leftRows.length, rightRows.length, 1);

  return [
    h3("Two columns"),
    tableRow(leftTitle, rightTitle),
    tableSep(2),
    ...Array.from({ length: rowCount }, (_, index) =>
      tableRow(leftRows[index] ?? "", rightRows[index] ?? "")
    ),
  ];
};

export const section = (
  title: string,
  blocks: TemplateContent,
  level: 1 | 2 | 3 = 2
): TemplateContent => {
  const heading =
    level === 1 ? h1(title) : level === 3 ? h3(title) : h2(title);

  return [heading, ...blocks];
};

export const labeledField = (label: string): TemplateBlock => bullet(`${label}`);

export const notionGallery = (data: NotionGalleryData): TemplateBlock => ({
  type: "notionGallery",
  props: { ...baseProps, data: stringifyJsonProp(data) },
  children: [],
});

export const notionDatabase = (data: NotionDatabaseData): TemplateBlock => ({
  type: "notionDatabase",
  props: { ...baseProps, data: stringifyJsonProp(data) },
  children: [],
});

export const notionColumns = (data: NotionColumnsData): TemplateBlock => ({
  type: "notionColumns",
  props: { ...baseProps, data: stringifyJsonProp(data) },
  children: [],
});

const columnId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || "col";

export const simpleDatabase = (
  title: string,
  columns: string[],
  rows: string[][],
  options?: {
    icon?: string;
    tabs?: string[];
    groupTitle?: string;
    sumColumn?: string;
  }
): TemplateBlock => {
  const cols = columns.map((label) => ({ id: columnId(label), label }));

  return notionDatabase({
    title,
    icon: options?.icon,
    tabs: options?.tabs ?? ["All"],
    activeTab: options?.tabs?.[0],
    columns: cols,
    sumColumnId: options?.sumColumn ? columnId(options.sumColumn) : undefined,
    groups: [
      {
        title: options?.groupTitle ?? title,
        rows: rows.map((cells, index) => ({
          id: `${columnId(title)}-${index}`,
          cells: Object.fromEntries(
            cols.map((col, columnIndex) => [col.id, cells[columnIndex] ?? ""])
          ),
        })),
      },
    ],
  });
};

export const simpleColumns = (
  leftTitle: string,
  rightTitle: string,
  columns: string[],
  leftRows: string[][],
  rightRows: string[][],
  options?: { leftIcon?: string; rightIcon?: string }
): TemplateBlock =>
  notionColumns({
    left: {
      title: leftTitle,
      icon: options?.leftIcon,
      tabs: ["All"],
      columns: columns.map((label) => ({ id: columnId(label), label })),
      groups: [
        {
          title: leftTitle,
          rows: leftRows.map((cells, index) => ({
            id: `left-${index}`,
            cells: Object.fromEntries(
              columns.map((label, columnIndex) => [
                columnId(label),
                cells[columnIndex] ?? "",
              ])
            ),
          })),
        },
      ],
    },
    right: {
      title: rightTitle,
      icon: options?.rightIcon,
      tabs: ["All"],
      columns: columns.map((label) => ({ id: columnId(label), label })),
      groups: [
        {
          title: rightTitle,
          rows: rightRows.map((cells, index) => ({
            id: `right-${index}`,
            cells: Object.fromEntries(
              columns.map((label, columnIndex) => [
                columnId(label),
                cells[columnIndex] ?? "",
              ])
            ),
          })),
        },
      ],
    },
  });
