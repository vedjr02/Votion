type BlockContent = {
  type?: string;
  text?: string;
  styles?: Record<string, boolean>;
};

type Block = {
  type?: string;
  content?: BlockContent[] | string;
  props?: {
    level?: number;
  };
  children?: Block[];
};

const inlineToMarkdown = (content?: BlockContent[] | string) => {
  if (!content) return "";
  if (typeof content === "string") return content;

  return content
    .map((item) => {
      if (item.type !== "text" || !item.text) return "";
      let text = item.text;
      if (item.styles?.bold) text = `**${text}**`;
      if (item.styles?.italic) text = `*${text}*`;
      if (item.styles?.code) text = `\`${text}\``;
      if (item.styles?.strike) text = `~~${text}~~`;
      return text;
    })
    .join("");
};

const blockToMarkdown = (block: Block, depth = 0): string => {
  const text = inlineToMarkdown(block.content);
  const indent = "  ".repeat(depth);

  switch (block.type) {
    case "heading": {
      const level = block.props?.level ?? 1;
      return `${"#".repeat(level)} ${text}\n`;
    }
    case "bulletListItem":
      return `${indent}- ${text}\n`;
    case "numberedListItem":
      return `${indent}1. ${text}\n`;
    case "paragraph":
      return text ? `${text}\n\n` : "\n";
    default:
      return text ? `${text}\n\n` : "";
  }
};

export const exportDocumentToMarkdown = (
  title: string,
  content?: string
): string => {
  let body = "";

  if (content) {
    try {
      const blocks = JSON.parse(content) as Block[];
      body = blocks.map((block) => blockToMarkdown(block)).join("");
    } catch {
      body = "";
    }
  }

  return `# ${title}\n\n${body}`.trim();
};

export const downloadMarkdownFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.md`;
  link.click();
  URL.revokeObjectURL(url);
};
