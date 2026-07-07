type BlockContent = {
  type?: string;
  text?: string;
  href?: string;
};

type SearchBlock = {
  type?: string;
  content?: BlockContent[] | string;
  props?: {
    data?: string;
    checked?: boolean;
  };
  children?: SearchBlock[];
};

const inlineText = (content?: BlockContent[] | string): string => {
  if (!content) return "";
  if (typeof content === "string") return content;

  return content
    .map((item) => {
      if (item.type === "text" && item.text) return item.text;
      if (item.type === "link" && item.href) return item.href;
      return "";
    })
    .join(" ");
};

const tableText = (dataProp?: string): string => {
  if (!dataProp) return "";

  try {
    const data = JSON.parse(dataProp) as {
      headers?: string[];
      rows?: string[][];
    };

    return [
      ...(data.headers ?? []),
      ...(data.rows ?? []).flat(),
    ].join(" ");
  } catch {
    return "";
  }
};

export const extractPlainTextFromBlocks = (blocks: SearchBlock[]): string =>
  blocks
    .map((block) => {
      const parts = [inlineText(block.content)];

      if (block.type === "votionTable") {
        parts.push(tableText(block.props?.data));
      }

      if (block.type === "checkListItem" && block.props?.checked) {
        parts.push("done");
      }

      if (block.children?.length) {
        parts.push(extractPlainTextFromBlocks(block.children));
      }

      return parts.join(" ");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

export const extractPlainTextFromContent = (content?: string): string => {
  if (!content) return "";

  try {
    const blocks = JSON.parse(content) as SearchBlock[];
    if (!Array.isArray(blocks)) return "";
    return extractPlainTextFromBlocks(blocks);
  } catch {
    return "";
  }
};

export const getDocumentSearchValue = (document: {
  title: string;
  content?: string;
}) => {
  const body = extractPlainTextFromContent(document.content);
  return `${document.title} ${body}`.toLowerCase();
};

export const getContentSnippet = (
  content: string | undefined,
  query: string,
  maxLength = 72
): string | null => {
  const plain = extractPlainTextFromContent(content);
  if (!plain) return null;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return plain.slice(0, maxLength);

  const index = plain.toLowerCase().indexOf(normalizedQuery);
  if (index === -1) return plain.slice(0, maxLength);

  const start = Math.max(0, index - 20);
  const end = Math.min(plain.length, index + normalizedQuery.length + 40);
  const snippet = plain.slice(start, end).trim();

  return `${start > 0 ? "…" : ""}${snippet}${end < plain.length ? "…" : ""}`;
};
