import { PartialBlock } from "@blocknote/core";

import type { VotionBlockSchema } from "@/lib/block-schema";

const text = (value: string) => [
  { type: "text" as const, text: value, styles: {} },
];

const baseProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

const paragraph = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "paragraph",
  props: baseProps,
  content: text(value),
  children: [],
});

const heading = (
  level: 1 | 2 | 3,
  value: string
): PartialBlock<VotionBlockSchema> => ({
  type: "heading",
  props: { ...baseProps, level },
  content: text(value),
  children: [],
});

const bullet = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "bulletListItem",
  props: baseProps,
  content: text(value),
  children: [],
});

const numbered = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "numberedListItem",
  props: baseProps,
  content: text(value),
  children: [],
});

const checkList = (
  value: string,
  checked: boolean
): PartialBlock<VotionBlockSchema> => ({
  type: "checkListItem",
  props: { ...baseProps, checked },
  content: text(value),
  children: [],
});

const codeBlock = (value: string): PartialBlock<VotionBlockSchema> => ({
  type: "votionCode",
  props: { ...baseProps, language: "plain" },
  content: text(value),
  children: [],
});

const divider = (): PartialBlock<VotionBlockSchema> => ({
  type: "votionDivider",
  props: baseProps,
  children: [],
});

export const markdownToBlocks = (
  markdown: string
): PartialBlock<VotionBlockSchema>[] => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: PartialBlock<VotionBlockSchema>[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(codeBlock(codeLines.join("\n")));
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      blocks.push(divider());
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(heading(3, line.slice(4).trim()));
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(heading(2, line.slice(3).trim()));
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(heading(1, line.slice(2).trim()));
      index += 1;
      continue;
    }

    if (/^- \[ \] /.test(line)) {
      blocks.push(checkList(line.replace(/^- \[ \] /, ""), false));
      index += 1;
      continue;
    }

    if (/^- \[x\] /i.test(line)) {
      blocks.push(checkList(line.replace(/^- \[x\] /i, ""), true));
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      blocks.push(bullet(line.slice(2).trim()));
      index += 1;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      blocks.push(numbered(line.replace(/^\d+\.\s/, "").trim()));
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({
        type: "paragraph",
        props: { ...baseProps, backgroundColor: "gray" },
        content: text(line.slice(2).trim()),
        children: [],
      });
      index += 1;
      continue;
    }

    blocks.push(paragraph(line.trim()));
    index += 1;
  }

  return blocks.length > 0 ? blocks : [paragraph("")];
};

export const mergeImportedMarkdown = (
  existingContent: string | undefined,
  markdown: string,
  mode: "replace" | "append"
): string => {
  const importedBlocks = markdownToBlocks(markdown);

  if (mode === "replace" || !existingContent) {
    return JSON.stringify(importedBlocks, null, 2);
  }

  try {
    const existing = JSON.parse(existingContent) as PartialBlock<VotionBlockSchema>[];
    if (!Array.isArray(existing)) {
      return JSON.stringify(importedBlocks, null, 2);
    }

    return JSON.stringify([...existing, divider(), ...importedBlocks], null, 2);
  } catch {
    return JSON.stringify(importedBlocks, null, 2);
  }
};
