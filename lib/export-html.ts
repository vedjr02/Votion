import { collectHeadings, inlineToPlainText, TocBlock } from "@/lib/toc-utils";
import {
  getTableHeaders,
  getTableRows,
  normalizeTableData,
} from "@/lib/blocks/votion-block-utils";

type BlockContent = {
  type?: string;
  text?: string;
  href?: string;
  styles?: Record<string, boolean>;
};

type Block = TocBlock & {
  content?: BlockContent[] | string;
  props?: TocBlock["props"] & {
    checked?: boolean;
    data?: string;
    open?: boolean;
    url?: string;
    title?: string;
    description?: string;
    backgroundColor?: string;
  };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const inlineToHtml = (content?: BlockContent[] | string) => {
  if (!content) return "";
  if (typeof content === "string") return escapeHtml(content);

  return content
    .map((item) => {
      if (item.type === "link" && item.href) {
        const label = escapeHtml(item.text ?? item.href);
        return `<a href="${escapeHtml(item.href)}">${label}</a>`;
      }

      if (item.type !== "text" || !item.text) return "";

      let text = escapeHtml(item.text);
      if (item.styles?.bold) text = `<strong>${text}</strong>`;
      if (item.styles?.italic) text = `<em>${text}</em>`;
      if (item.styles?.code) text = `<code>${text}</code>`;
      if (item.styles?.strike) text = `<s>${text}</s>`;
      return text;
    })
    .join("");
};

const tableToHtml = (dataProp?: string) => {
  if (!dataProp) return "";

  try {
    const data = normalizeTableData(dataProp);
    const headers = getTableHeaders(data);
    const rows = getTableRows(data);
    if (headers.length === 0) return "";

    const headerCells = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
    const bodyRows = rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell) => `<td>${escapeHtml(cell)}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  } catch {
    return "";
  }
};

const tocToHtml = (headings: ReturnType<typeof collectHeadings>) => {
  if (headings.length === 0) {
    return `<section class="toc"><p><em>Table of contents</em></p></section>`;
  }

  const items = headings
    .map(
      (heading) =>
        `<li data-level="${heading.level}"><a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a></li>`
    )
    .join("");

  return `<section class="toc"><h2>Table of contents</h2><ul>${items}</ul></section>`;
};

const blockToHtml = (block: Block, headings: ReturnType<typeof collectHeadings>): string => {
  const text = inlineToHtml(block.content as BlockContent[] | string | undefined);
  const children = block.children?.length
    ? blocksToHtml(block.children, headings)
    : "";
  const idAttr = block.type === "heading" && block.id ? ` id="${escapeHtml(block.id)}"` : "";

  switch (block.type) {
    case "heading": {
      const level = block.props?.level ?? 1;
      return `<h${level}${idAttr}>${text}</h${level}>${children}`;
    }
    case "bulletListItem":
      return `<ul><li>${text}${children}</li></ul>`;
    case "numberedListItem":
      return `<ol><li>${text}${children}</li></ol>`;
    case "checkListItem": {
      const checked = block.props?.checked ? " checked" : "";
      return `<ul class="checklist"><li><input type="checkbox"${checked} disabled /> ${text}${children}</li></ul>`;
    }
    case "votionToggle":
      return `<details${block.props?.open ? " open" : ""}><summary>${text || "Toggle"}</summary>${children}</details>`;
    case "votionCode":
      return `<pre><code>${text}</code></pre>${children}`;
    case "votionSmallText":
      return `<p class="small">${text}</p>${children}`;
    case "votionEmbed":
      return block.props?.url
        ? `<p><a href="${escapeHtml(block.props.url)}">Embed: ${escapeHtml(block.props.url)}</a></p>${children}`
        : children;
    case "votionBookmark": {
      const url = block.props?.url;
      const title = block.props?.title || url || "Bookmark";
      return url
        ? `<p><a href="${escapeHtml(url)}">${escapeHtml(title)}</a></p>${children}`
        : children;
    }
    case "votionDivider":
      return `<hr />${children}`;
    case "votionTable":
      return `${tableToHtml(block.props?.data)}${children}`;
    case "votionToc":
      return `${tocToHtml(headings)}${children}`;
    case "votionColumnList":
    case "votionColumn":
      return `<div class="columns">${children}</div>`;
    case "paragraph": {
      if (!text) return children;
      if (block.props?.backgroundColor && block.props.backgroundColor !== "default") {
        return `<blockquote class="callout callout-${escapeHtml(block.props.backgroundColor)}">${text}</blockquote>${children}`;
      }
      return `<p>${text}</p>${children}`;
    }
    default:
      return text ? `<p>${text}</p>${children}` : children;
  }
};

const blocksToHtml = (blocks: Block[], headings: ReturnType<typeof collectHeadings>) =>
  blocks.map((block) => blockToHtml(block, headings)).join("\n");

export const exportDocumentToHtml = (title: string, content?: string): string => {
  let body = "";

  if (content) {
    try {
      const blocks = JSON.parse(content) as Block[];
      const headings = collectHeadings(blocks);
      body = blocksToHtml(blocks, headings);
    } catch {
      body = "";
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #37352f; }
    h1, h2, h3 { line-height: 1.25; }
    blockquote.callout { border-radius: 4px; padding: 0.75rem 1rem; margin: 0.75rem 0; border: 1px solid rgba(55,53,47,.09); background: rgba(55,53,47,.03); }
    .toc ul { list-style: none; padding-left: 0; }
    .toc li[data-level="2"] { padding-left: 1rem; }
    .toc li[data-level="3"] { padding-left: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { border: 1px solid rgba(55,53,47,.16); padding: 0.5rem; text-align: left; }
    pre { background: rgba(55,53,47,.04); padding: 0.75rem; border-radius: 4px; overflow-x: auto; }
    .small { font-size: 0.875rem; color: rgba(55,53,47,.65); }
    .columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>`;
};

export const downloadHtmlFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.html`;
  link.click();
  URL.revokeObjectURL(url);
};
