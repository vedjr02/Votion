import { PartialBlock } from "@blocknote/core";

import type { VotionBlockSchema } from "@/lib/block-schema";

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

const defaultBlockProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

export const emptyToggleBlock = (
  childCount = 1
): PartialBlock<VotionBlockSchema> => ({
  type: "votionToggle",
  props: {
    ...defaultBlockProps,
    open: true,
  },
  content: [],
  children: Array.from({ length: childCount }, () => emptyBlock("paragraph")),
});

export const emptyCodeBlock = (): PartialBlock<VotionBlockSchema> => ({
  type: "votionCode",
  props: {
    ...defaultBlockProps,
    language: "plain",
  },
  content: [],
  children: [],
});

export const emptySmallTextBlock = (): PartialBlock<VotionBlockSchema> => ({
  type: "votionSmallText",
  props: defaultBlockProps,
  content: [],
  children: [],
});
