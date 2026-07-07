import { PartialBlock } from "@blocknote/core";

import { VotionBlockSchema } from "@/lib/block-schema";

type InlineStyleFlags = {
  bold?: true;
  italic?: true;
  underline?: true;
  strike?: true;
  code?: true;
  textColor?: string;
  backgroundColor?: string;
};

const text = (value: string, styles: InlineStyleFlags = {}) => [
  { type: "text" as const, text: value, styles },
];

const defaultProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

type EditorBlockType =
  | "paragraph"
  | "heading"
  | "bulletListItem"
  | "numberedListItem"
  | "checkListItem";

export const emptyBlock = (
  type: EditorBlockType,
  props: Record<string, unknown> = {}
): PartialBlock<VotionBlockSchema> => ({
  type,
  props: {
    ...defaultProps,
    ...props,
  },
  content: [],
  children: [],
});

export const blockWithText = (
  type: EditorBlockType,
  value: string,
  props: Record<string, unknown> = {},
  styles: InlineStyleFlags = {}
): PartialBlock<VotionBlockSchema> => ({
  type,
  props: {
    ...defaultProps,
    ...props,
  },
  content: text(value, styles),
  children: [],
});

export const emptyCheckListItems = (count = 3) =>
  Array.from({ length: count }, () =>
    emptyBlock("checkListItem", { checked: false })
  );
