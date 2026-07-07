import { Id } from "@/convex/_generated/dataModel";

type LinkContent = {
  type?: string;
  href?: string;
  text?: string;
};

type ContentBlock = {
  type?: string;
  content?: LinkContent[] | string;
  props?: {
    url?: string;
  };
  children?: ContentBlock[];
};

const DOCUMENT_LINK_PATTERN = /\/documents\/([a-z0-9]+)/gi;

export const extractLinkedDocumentIds = (content?: string): Id<"documents">[] => {
  if (!content) return [];

  const ids = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = DOCUMENT_LINK_PATTERN.exec(content)) !== null) {
    ids.add(match[1]);
  }

  try {
    const blocks = JSON.parse(content) as ContentBlock[];
    if (Array.isArray(blocks)) {
      collectLinkIdsFromBlocks(blocks, ids);
    }
  } catch {
    // Raw string scan above is enough for malformed JSON edge cases.
  }

  return Array.from(ids) as Id<"documents">[];
};

const collectLinkIdsFromBlocks = (
  blocks: ContentBlock[],
  ids: Set<string>
) => {
  for (const block of blocks) {
    if (Array.isArray(block.content)) {
      for (const item of block.content) {
        if (item.type === "link" && item.href) {
          const match = item.href.match(/\/documents\/([a-z0-9]+)/i);
          if (match?.[1]) ids.add(match[1]);
        }
      }
    }

    if (block.props?.url) {
      const match = block.props.url.match(/\/documents\/([a-z0-9]+)/i);
      if (match?.[1]) ids.add(match[1]);
    }

    if (block.children?.length) {
      collectLinkIdsFromBlocks(block.children, ids);
    }
  }
};

export const contentLinksToDocument = (
  content: string | undefined,
  documentId: Id<"documents">
): boolean => extractLinkedDocumentIds(content).includes(documentId);
