import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";
import {
  blockWithText,
  emptyBlock,
  emptyCheckListItems,
} from "@/lib/editor-blocks";

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
