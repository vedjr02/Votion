import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";
import {
  stringifyJsonProp,
  tableData,
  type TableData,
} from "@/lib/blocks/votion-block-utils";
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

export const tableBlock = (data: TableData): TemplateBlock => ({
  type: "votionTable",
  props: { ...baseProps, data: stringifyJsonProp(data) },
  children: [],
});

export const table = (
  headers: string[],
  rows: string[][] = []
): TemplateBlock => tableBlock(tableData(headers, rows));

export const tableWithEmptyRows = (
  headers: string[],
  emptyRows = 4
): TemplateBlock =>
  table(
    headers,
    Array.from({ length: emptyRows }, () => headers.map(() => ""))
  );

export const columns = (
  left: TemplateContent,
  right: TemplateContent
): TemplateBlock => ({
  type: "votionColumnList",
  props: baseProps,
  children: [
    {
      type: "votionColumn",
      props: baseProps,
      children: left.map((block) => ({ ...block, children: block.children ?? [] })),
    },
    {
      type: "votionColumn",
      props: baseProps,
      children: right.map((block) => ({ ...block, children: block.children ?? [] })),
    },
  ],
});

export const twoColumns = (
  leftTitle: string,
  rightTitle: string,
  leftRows: string[] = [""],
  rightRows: string[] = [""]
): TemplateBlock =>
  columns(
    [h3(leftTitle), ...leftRows.map((row) => (row ? p(row) : p("")))],
    [h3(rightTitle), ...rightRows.map((row) => (row ? p(row) : p("")))]
  );

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

export const defaultColumnLayout = (): TemplateBlock =>
  columns(
    [h3("Column 1"), emptyBlock("paragraph")],
    [h3("Column 2"), emptyBlock("paragraph")]
  );

export const defaultTableLayout = (): TemplateBlock =>
  table(
    ["Column 1", "Column 2", "Column 3"],
    [
      ["", "", ""],
      ["", "", ""],
    ]
  );
