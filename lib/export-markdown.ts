type BlockContent = {
  type?: string;
  text?: string;
  href?: string;
  styles?: Record<string, boolean>;
};

type Block = {
  type?: string;
  content?: BlockContent[] | string;
  props?: {
    level?: number;
    checked?: boolean;
    data?: string;
    open?: boolean;
  };
  children?: Block[];
};

const inlineToMarkdown = (content?: BlockContent[] | string) => {
  if (!content) return "";
  if (typeof content === "string") return content;

  return content
    .map((item) => {
      if (item.type === "link" && item.href) {
        const label = item.text ?? item.href;
        return `[${label}](${item.href})`;
      }

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

const tableToMarkdown = (dataProp?: string) => {
  if (!dataProp) return "";

  try {
    const data = JSON.parse(dataProp) as {
      headers?: string[];
      rows?: string[][];
    };

    const headers = data.headers ?? [];
    const rows = data.rows ?? [];
    if (headers.length === 0) return "";

    const headerRow = `| ${headers.join(" | ")} |`;
    const separator = `| ${headers.map(() => "---").join(" | ")} |`;
    const body = rows.map((row) => `| ${headers.map((_, i) => row[i] ?? "").join(" | ")} |`);

    return [headerRow, separator, ...body, ""].join("\n");
  } catch {
    return "";
  }
};

const blocksToMarkdown = (blocks: Block[], depth = 0): string =>
  blocks
    .map((block) => blockToMarkdown(block, depth))
    .filter(Boolean)
    .join("");

const blockToMarkdown = (block: Block, depth = 0): string => {
  const text = inlineToMarkdown(block.content);
  const indent = "  ".repeat(depth);
  const children = block.children?.length
    ? blocksToMarkdown(block.children, depth + 1)
    : "";

  switch (block.type) {
    case "heading": {
      const level = block.props?.level ?? 1;
      return `${"#".repeat(level)} ${text}\n\n${children}`;
    }
    case "bulletListItem":
      return `${indent}- ${text}\n${children}`;
    case "numberedListItem":
      return `${indent}1. ${text}\n${children}`;
    case "checkListItem": {
      const mark = block.props?.checked ? "x" : " ";
      return `${indent}- [${mark}] ${text}\n${children}`;
    }
    case "votionToggle":
      return `<details>\n<summary>${text || "Toggle"}</summary>\n\n${children}\n</details>\n\n`;
    case "votionCode":
      return `\`\`\`\n${text}\n\`\`\`\n\n${children}`;
    case "votionSmallText":
      return `*${text}*\n\n${children}`;
    case "votionDivider":
      return `---\n\n${children}`;
    case "votionTable":
      return `${tableToMarkdown(block.props?.data)}${children}`;
    case "votionColumnList":
    case "votionColumn":
      return children;
    case "image":
      return `![image](${text || "image"})\n\n${children}`;
    case "paragraph": {
      if (!text) return children;
      return `${text}\n\n${children}`;
    }
    default:
      return text ? `${text}\n\n${children}` : children;
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
      body = blocksToMarkdown(blocks);
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
