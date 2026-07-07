type InlineContent = {
  type?: string;
  text?: string;
};

export type TocBlock = {
  id?: string;
  type?: string;
  content?: InlineContent[] | string;
  props?: {
    level?: number;
    data?: string;
  };
  children?: TocBlock[];
};

export type TocHeading = {
  id: string;
  level: number;
  text: string;
};

export const inlineToPlainText = (content?: InlineContent[] | string) => {
  if (!content) return "";
  if (typeof content === "string") return content;

  return content
    .map((item) => (item.type === "text" && item.text ? item.text : ""))
    .join("");
};

export const collectHeadings = (blocks: TocBlock[]): TocHeading[] => {
  const headings: TocHeading[] = [];

  const walk = (items: TocBlock[]) => {
    for (const block of items) {
      if (block.type === "heading" && block.id) {
        const text = inlineToPlainText(block.content).trim();

        if (text) {
          headings.push({
            id: block.id,
            level: block.props?.level ?? 1,
            text,
          });
        }
      }

      if (block.children?.length) {
        walk(block.children);
      }
    }
  };

  walk(blocks);
  return headings;
};
