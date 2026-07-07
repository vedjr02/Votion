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
import {
  blockWithText,
  emptyBlock,
  emptyCheckListItems,
} from "@/lib/editor-blocks";
import {
  defaultColumnLayout,
  defaultTableLayout,
} from "@/lib/template-blocks";

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
      insertOrUpdateBlock(editor, emptyBlock("paragraph")),
  },
  {
    name: "Title",
    aliases: ["title", "h1", "large", "heading 1"],
    group: "Basic blocks",
    icon: <Heading1 size={18} />,
    hint: "Large page title",
    execute: (editor) =>
      insertOrUpdateBlock(editor, emptyBlock("heading", { level: 1 })),
  },
  {
    name: "Heading 2",
    aliases: ["h2", "heading2", "section"],
    group: "Headings",
    icon: <Heading2 size={18} />,
    hint: "Medium section heading",
    execute: (editor) =>
      insertOrUpdateBlock(editor, emptyBlock("heading", { level: 2 })),
  },
  {
    name: "Heading 3",
    aliases: ["h3", "heading3", "subsection"],
    group: "Headings",
    icon: <Heading3 size={18} />,
    hint: "Small subsection heading",
    execute: (editor) =>
      insertOrUpdateBlock(editor, emptyBlock("heading", { level: 3 })),
  },
  {
    name: "To-do list",
    aliases: ["todo", "to-do", "checkbox", "task"],
    group: "Lists",
    icon: <CheckSquare size={18} />,
    hint: "Track tasks with checkboxes",
    execute: (editor) =>
      insertMultipleBlocks(editor, emptyCheckListItems(3)),
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
        emptyBlock("heading", { level: 3 }),
        emptyBlock("bulletListItem"),
        emptyBlock("bulletListItem"),
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
        emptyBlock("bulletListItem"),
        emptyBlock("bulletListItem"),
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
        emptyBlock("numberedListItem"),
        emptyBlock("numberedListItem"),
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
        emptyBlock("paragraph", { backgroundColor: "gray" })
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
        blockWithText("paragraph", "────────────", {
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
      insertOrUpdateBlock(
        editor,
        emptyBlock("paragraph", { backgroundColor: "gray" })
      ),
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
        emptyBlock("paragraph", { backgroundColor: "blue" })
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
        emptyBlock("paragraph", { backgroundColor: "yellow" })
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
        emptyBlock("paragraph", { backgroundColor: "green" })
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
        emptyBlock("paragraph", { backgroundColor: "red" })
      ),
  },
  {
    name: "Table",
    aliases: ["table", "grid", "database", "rows"],
    group: "Advanced blocks",
    icon: <Table size={18} />,
    hint: "Insert an editable table",
    execute: (editor) =>
      insertOrUpdateBlock(editor, defaultTableLayout()),
  },
  {
    name: "2 columns",
    aliases: ["columns", "2col", "split"],
    group: "Advanced blocks",
    icon: <Columns size={18} />,
    hint: "Side-by-side editable columns",
    execute: (editor) =>
      insertOrUpdateBlock(editor, defaultColumnLayout()),
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
        emptyBlock("paragraph", {
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
    execute: (editor) => insertOrUpdateBlock(editor, emptyBlock("paragraph")),
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

      insertOrUpdateBlock(
        editor,
        blockWithText("paragraph", `📅 ${today}`)
      );
    },
  },
  {
    name: "Small text",
    aliases: ["small", "caption", "label"],
    group: "Text styles",
    icon: <Type size={18} />,
    hint: "Smaller supporting text",
    execute: (editor) =>
      insertOrUpdateBlock(editor, emptyBlock("paragraph")),
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
        emptyBlock("paragraph", { backgroundColor: "blue" })
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
        emptyBlock("paragraph", { backgroundColor: "gray" })
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
        emptyBlock("paragraph", { backgroundColor: "gray" })
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
        emptyBlock("paragraph", { backgroundColor: "gray" }),
        emptyBlock("paragraph"),
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
        emptyBlock("paragraph", { backgroundColor: "gray" })
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
        emptyBlock("paragraph", {
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
    execute: (editor) => insertOrUpdateBlock(editor, emptyBlock("paragraph")),
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
        emptyBlock("paragraph", { backgroundColor: "yellow" })
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
    execute: (editor) => insertOrUpdateBlock(editor, emptyBlock("paragraph")),
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
