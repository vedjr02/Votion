import {
  BlockNoteEditor,
  PartialBlock,
  getDefaultSlashMenuItems,
} from "@blocknote/core";
import {
  ReactSlashMenuItem,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import {
  AlertCircle,
  AlertTriangle,
  AtSign,
  Bookmark,
  Calendar,
  CheckSquare,
  ChevronRight,
  Code2,
  Columns,
  Copy,
  File,
  FileText,
  Film,
  GitBranch,
  Heading1,
  Heading2,
  Heading3,
  Info,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Minus,
  MousePointerClick,
  Quote,
  Sigma,
  Smile,
  Sparkles,
  Table,
  Text,
  Type,
  Youtube,
} from "lucide-react";

import { VotionBlockSchema, votionBlockSchema } from "@/lib/block-schema";
import { usePageLinkPicker } from "@/hooks/use-page-link-picker";

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

const block = (
  type:
    | "paragraph"
    | "heading"
    | "bulletListItem"
    | "numberedListItem"
    | "checkListItem",
  content: ReturnType<typeof text>,
  props: Record<string, unknown> = {}
): PartialBlock<VotionBlockSchema> => ({
  type,
  props: {
    textAlignment: "left",
    backgroundColor: "default",
    textColor: "default",
    ...props,
  },
  content,
  children: [],
});

const isSlashBlock = (editor: BlockNoteEditor<VotionBlockSchema>) => {
  const currentBlock = editor.getTextCursorPosition().block;

  if (currentBlock.content === undefined) {
    return false;
  }

  return (
    currentBlock.content.length === 0 ||
    (currentBlock.content.length === 1 &&
      currentBlock.content[0].type === "text" &&
      currentBlock.content[0].text === "/")
  );
};

const insertOrUpdateBlock = (
  editor: BlockNoteEditor<VotionBlockSchema>,
  nextBlock: PartialBlock<VotionBlockSchema>
) => {
  const currentBlock = editor.getTextCursorPosition().block;

  if (currentBlock.content === undefined) {
    throw new Error("Slash menu used in a block without inline content.");
  }

  if (isSlashBlock(editor)) {
    editor.updateBlock(currentBlock, nextBlock);
    return currentBlock;
  }

  editor.insertBlocks([nextBlock], currentBlock, "after");
  const next = editor.getTextCursorPosition().nextBlock;
  if (next) {
    editor.setTextCursorPosition(next);
  }
  return currentBlock;
};

const insertMultipleBlocks = (
  editor: BlockNoteEditor<VotionBlockSchema>,
  blocks: PartialBlock<VotionBlockSchema>[]
) => {
  if (blocks.length === 0) return;

  const anchor = insertOrUpdateBlock(editor, blocks[0]);

  if (blocks.length > 1) {
    editor.insertBlocks(blocks.slice(1), anchor, "after");
  }
};

const customSlashMenuItems: ReactSlashMenuItem<VotionBlockSchema>[] = [
  {
    name: "Text",
    aliases: ["text", "plain"],
    group: "Basic blocks",
    icon: <Text size={18} />,
    hint: "Plain text paragraph",
    execute: (editor) =>
      insertOrUpdateBlock(editor, block("paragraph", text("Start writing..."))),
  },
  {
    name: "Title",
    aliases: ["title", "h1", "large", "heading 1"],
    group: "Basic blocks",
    icon: <Heading1 size={18} />,
    hint: "Large page title",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("heading", text("Title"), { level: 1 })
      ),
  },
  {
    name: "Heading 2",
    aliases: ["h2", "heading2", "section"],
    group: "Headings",
    icon: <Heading2 size={18} />,
    hint: "Medium section heading",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("heading", text("Heading 2"), { level: 2 })
      ),
  },
  {
    name: "Heading 3",
    aliases: ["h3", "heading3", "subsection"],
    group: "Headings",
    icon: <Heading3 size={18} />,
    hint: "Small subsection heading",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("heading", text("Heading 3"), { level: 3 })
      ),
  },
  {
    name: "To-do list",
    aliases: ["todo", "to-do", "checkbox", "task"],
    group: "Lists",
    icon: <CheckSquare size={18} />,
    hint: "Track tasks with checkboxes",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("checkListItem", text("First task"), { checked: false }),
        block("checkListItem", text("Second task"), { checked: false }),
        block("checkListItem", text("Third task"), { checked: false }),
      ]),
  },
  {
    name: "Page link",
    aliases: ["page", "link page", "subpage", "mention page", "doc"],
    group: "Basic blocks",
    icon: <File size={18} />,
    hint: "Link to another page in Votion",
    execute: (editor) => {
      usePageLinkPicker.getState().onOpen(editor);
    },
  },
  {
    name: "Toggle list",
    aliases: ["toggle", "accordion", "dropdown"],
    group: "Lists",
    icon: <ChevronRight size={18} />,
    hint: "Collapsible section with hidden content",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("heading", text("▸ Toggle heading"), { level: 3 }),
        block("bulletListItem", text("Hidden detail or sub-item")),
        block("bulletListItem", text("Another nested point")),
      ]),
  },
  {
    name: "Bulleted list",
    aliases: ["ul", "bullet", "unordered"],
    group: "Lists",
    icon: <List size={18} />,
    hint: "Create a simple bulleted list",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("bulletListItem", text("List item")),
        block("bulletListItem", text("List item")),
      ]),
  },
  {
    name: "Numbered list",
    aliases: ["ol", "numbered", "ordered", "1."],
    group: "Lists",
    icon: <ListOrdered size={18} />,
    hint: "Create a numbered list",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("numberedListItem", text("List item")),
        block("numberedListItem", text("List item")),
      ]),
  },
  {
    name: "Quote",
    aliases: ["quote", "blockquote", "callout-quote"],
    group: "Basic blocks",
    icon: <Quote size={18} />,
    hint: "Capture a quote or citation",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("Quote text here"), {
          backgroundColor: "gray",
        })
      ),
  },
  {
    name: "Divider",
    aliases: ["divider", "hr", "line", "separator", "---"],
    group: "Basic blocks",
    icon: <Minus size={18} />,
    hint: "Visually divide blocks",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("────────────"), {
          textAlignment: "center",
          backgroundColor: "default",
        })
      ),
  },
  {
    name: "Code",
    aliases: ["code", "codeblock", "snippet", "pre"],
    group: "Basic blocks",
    icon: <Code2 size={18} />,
    hint: "Capture a code snippet",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("paragraph", text("// Write your code here", { code: true }), {
          backgroundColor: "gray",
        }),
        block("paragraph", text("console.log('Hello, Votion');", { code: true }), {
          backgroundColor: "gray",
        }),
      ]),
  },
  {
    name: "Callout",
    aliases: ["callout", "info", "note", "tip"],
    group: "Basic blocks",
    icon: <Lightbulb size={18} />,
    hint: "Highlight important information",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("💡 Useful tip or important note"), {
          backgroundColor: "blue",
        })
      ),
  },
  {
    name: "Warning",
    aliases: ["warning", "alert", "caution"],
    group: "Basic blocks",
    icon: <AlertTriangle size={18} />,
    hint: "Call out a warning",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("⚠️ Warning message"), {
          backgroundColor: "yellow",
        })
      ),
  },
  {
    name: "Success",
    aliases: ["success", "done", "check"],
    group: "Basic blocks",
    icon: <Sparkles size={18} />,
    hint: "Highlight a success or win",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("✅ Success message"), {
          backgroundColor: "green",
        })
      ),
  },
  {
    name: "Error",
    aliases: ["error", "danger", "important"],
    group: "Basic blocks",
    icon: <AlertCircle size={18} />,
    hint: "Highlight an error or blocker",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("⛔ Error or blocker"), {
          backgroundColor: "red",
        })
      ),
  },
  {
    name: "Table",
    aliases: ["table", "grid", "database", "rows"],
    group: "Advanced blocks",
    icon: <Table size={18} />,
    hint: "Insert a simple table layout",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("paragraph", text("| Column 1 | Column 2 | Column 3 |", { code: true })),
        block("paragraph", text("| --- | --- | --- |", { code: true })),
        block("paragraph", text("| Value | Value | Value |", { code: true })),
        block("paragraph", text("| Value | Value | Value |", { code: true })),
      ]),
  },
  {
    name: "2 columns",
    aliases: ["columns", "2col", "split"],
    group: "Advanced blocks",
    icon: <Columns size={18} />,
    hint: "Side-by-side content layout",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("heading", text("Left column"), { level: 3 }),
        block("paragraph", text("Content for the left side")),
        block("heading", text("Right column"), { level: 3 }),
        block("paragraph", text("Content for the right side")),
      ]),
  },
  {
    name: "Equation",
    aliases: ["equation", "math", "formula", "latex"],
    group: "Advanced blocks",
    icon: <Sigma size={18} />,
    hint: "Write a math formula",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("E = mc²"), {
          textAlignment: "center",
          backgroundColor: "gray",
        })
      ),
  },
  {
    name: "Link",
    aliases: ["link", "url", "bookmark", "web"],
    group: "Advanced blocks",
    icon: <Link2 size={18} />,
    hint: "Add a link or bookmark",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("🔗 Paste a link here"))
      ),
  },
  {
    name: "Today",
    aliases: ["date", "today", "now", "calendar"],
    group: "Advanced blocks",
    icon: <Calendar size={18} />,
    hint: "Insert today's date",
    execute: (editor) => {
      const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      insertOrUpdateBlock(editor, block("paragraph", text(`📅 ${today}`)));
    },
  },
  {
    name: "Small text",
    aliases: ["small", "caption", "label"],
    group: "Text styles",
    icon: <Type size={18} />,
    hint: "Smaller supporting text",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("Small text"), {
          textAlignment: "left",
        })
      ),
  },
  {
    name: "Info box",
    aliases: ["info", "help", "question"],
    group: "Text styles",
    icon: <Info size={18} />,
    hint: "Blue info callout",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("ℹ️ Information"), {
          backgroundColor: "blue",
        })
      ),
  },
  {
    name: "Embed",
    aliases: ["embed", "iframe", "youtube", "video"],
    group: "Media",
    icon: <Youtube size={18} />,
    hint: "Embed a video, map, or web page",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("📺 Paste an embed URL (YouTube, Figma, etc.)"), {
          backgroundColor: "gray",
        })
      ),
  },
  {
    name: "Video",
    aliases: ["video", "mp4", "movie"],
    group: "Media",
    icon: <Film size={18} />,
    hint: "Upload or link a video file",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("🎬 Paste a video link or upload from the toolbar"), {
          backgroundColor: "gray",
        })
      ),
  },
  {
    name: "Bookmark",
    aliases: ["bookmark", "web", "preview"],
    group: "Media",
    icon: <Bookmark size={18} />,
    hint: "Save a link with preview",
    execute: (editor) =>
      insertMultipleBlocks(editor, [
        block("paragraph", text("🔖 Bookmark title"), { backgroundColor: "gray" }),
        block("paragraph", text("https://example.com")),
      ]),
  },
  {
    name: "File",
    aliases: ["file", "attachment", "upload", "pdf"],
    group: "Media",
    icon: <FileText size={18} />,
    hint: "Upload a file or PDF",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("📎 Drag a file here or use the image upload in / menu"), {
          backgroundColor: "gray",
        })
      ),
  },
  {
    name: "Button",
    aliases: ["button", "cta", "action"],
    group: "Advanced blocks",
    icon: <MousePointerClick size={18} />,
    hint: "Add a clickable button label",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("▶ Click me"), {
          textAlignment: "center",
          backgroundColor: "blue",
        })
      ),
  },
  {
    name: "Breadcrumb",
    aliases: ["breadcrumb", "nav", "path"],
    group: "Advanced blocks",
    icon: <GitBranch size={18} />,
    hint: "Show navigation path",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("Home › Section › Page"))
      ),
  },
  {
    name: "Synced block",
    aliases: ["synced", "sync", "reuse"],
    group: "Advanced blocks",
    icon: <Copy size={18} />,
    hint: "Reusable content block",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("🔗 Synced content — edit once, update everywhere"), {
          backgroundColor: "yellow",
        })
      ),
  },
  {
    name: "Mention",
    aliases: ["mention", "@", "person", "user"],
    group: "Inline",
    icon: <AtSign size={18} />,
    hint: "Mention a person or page",
    execute: (editor) => {
      usePageLinkPicker.getState().onOpen(editor);
    },
  },
  {
    name: "Emoji",
    aliases: ["emoji", "icon", "smile"],
    group: "Inline",
    icon: <Smile size={18} />,
    hint: "Pick an emoji",
    execute: (editor) =>
      insertOrUpdateBlock(
        editor,
        block("paragraph", text("😀 🎉 ✨ 📝 🚀"))
      ),
  },
];

export const getVotionSlashMenuItems = (): ReactSlashMenuItem<VotionBlockSchema>[] => {
  const defaultItems = getDefaultReactSlashMenuItems(votionBlockSchema);
  const defaultNames = new Set(defaultItems.map((item) => item.name.toLowerCase()));

  const filteredCustomItems = customSlashMenuItems.filter(
    (item) => !defaultNames.has(item.name.toLowerCase())
  );

  return [...defaultItems, ...filteredCustomItems] as ReactSlashMenuItem<VotionBlockSchema>[];
};

export const getVotionSlashMenuItemCount = () => getVotionSlashMenuItems().length;

// Useful for tests or docs
export const getBaseSlashMenuItems = () => getDefaultSlashMenuItems();
