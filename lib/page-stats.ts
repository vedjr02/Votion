import { inlineToPlainText, TocBlock } from "@/lib/toc-utils";
import {
  getTableHeaders,
  getTableRows,
  normalizeTableData,
} from "@/lib/blocks/votion-block-utils";

export type PageStats = {
  words: number;
  characters: number;
  blocks: number;
};

const countWords = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  return trimmed.split(/\s+/).filter(Boolean).length;
};

const walkBlocks = (
  blocks: TocBlock[],
  onText: (text: string) => void,
  onBlock: () => void
) => {
  for (const block of blocks) {
    onBlock();

    if (Array.isArray(block.content)) {
      const text = inlineToPlainText(block.content);
      if (text.trim()) {
        onText(text);
      }
    }

    if (block.type === "votionTable" && block.props && "data" in block.props) {
      try {
        const data = normalizeTableData(String(block.props.data));

        for (const header of getTableHeaders(data)) {
          if (header.trim()) onText(header);
        }

        for (const row of getTableRows(data)) {
          for (const cell of row) {
            if (cell.trim()) onText(cell);
          }
        }
      } catch {
        // Ignore invalid table data.
      }
    }

    if (block.children?.length) {
      walkBlocks(block.children, onText, onBlock);
    }
  }
};

export const getPageStats = (content?: string): PageStats => {
  if (!content) {
    return { words: 0, characters: 0, blocks: 0 };
  }

  try {
    const blocks = JSON.parse(content) as TocBlock[];
    if (!Array.isArray(blocks)) {
      return { words: 0, characters: 0, blocks: 0 };
    }

    let words = 0;
    let characters = 0;
    let blockCount = 0;

    walkBlocks(
      blocks,
      (text) => {
        words += countWords(text);
        characters += text.replace(/\s+/g, "").length;
      },
      () => {
        blockCount += 1;
      }
    );

    return { words, characters, blocks: blockCount };
  } catch {
    return { words: 0, characters: 0, blocks: 0 };
  }
};

export const formatPageTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
