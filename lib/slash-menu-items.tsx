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
  File,
  Film,
  GanttChart,
  Heading1,
  Heading2,
  Heading3,
  Kanban,
  LayoutDashboard,
  LayoutGrid,
  Lightbulb,
  List,
  ListOrdered,
  ListTree,
  Minus,
  Newspaper,
  PlusSquare,
  Quote,
  Smile,
  Sparkles,
  Table,
  Table2,
  Text,
  Type,
} from "lucide-react";

import { VotionBlockSchema, votionBlockSchema } from "@/lib/block-schema";
import { emptyBookmarkBlock } from "@/lib/blocks/votion-bookmark-block";
import { emptyEmbedBlock } from "@/lib/blocks/votion-embed-block";
import { DATABASE_VIEW_OPTIONS } from "@/lib/blocks/votion-database-view-options";
import type { TableView } from "@/lib/blocks/votion-block-utils";
import {
  createDatabaseBlock,
  databaseBlock,
  habitTrackerData,
  projectTrackerData,
  taskBoardData,
} from "@/lib/database-presets";
import { usePageLinkPicker } from "@/hooks/use-page-link-picker";
import {
  blockWithText,
  emptyBlock,
  emptyCheckListItems,
  emptyCodeBlock,
  emptySmallTextBlock,
  emptyToggleBlock,
} from "@/lib/editor-blocks";
import {
  defaultColumnLayout,
  defaultThreeColumnLayout,
} from "@/lib/template-blocks";
import { emptyTocBlock } from "@/lib/blocks/votion-toc-block";

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

const calloutBlock = (
  color: "blue" | "yellow" | "green" | "red",
  icon: string
) =>
  blockWithText("paragraph", `${icon} `, { backgroundColor: color });

const databaseViewIcons: Record<TableView, JSX.Element> = {
  table: <Table2 size={18} />,
  board: <Kanban size={18} />,
  gallery: <LayoutGrid size={18} />,
  list: <List size={18} />,
  feed: <Newspaper size={18} />,
  dashboard: <LayoutDashboard size={18} />,
  calendar: <Calendar size={18} />,
  timeline: <GanttChart size={18} />,
  map: <LayoutGrid size={18} />,
  chart: <Table size={18} />,
};

const databaseViewAliases: Record<TableView, string[]> = {
  table: ["table view", "grid", "spreadsheet", "rows"],
  board: ["board view", "kanban", "pipeline", "status"],
  gallery: ["gallery view", "cards", "card view"],
  list: ["list view", "compact"],
  feed: ["feed view", "blog", "posts"],
  dashboard: ["dashboard view", "stats", "metrics"],
  calendar: ["calendar view", "schedule", "dates"],
  timeline: ["timeline view", "gantt", "roadmap"],
  map: ["map view", "location"],
  chart: ["chart view", "bar chart", "graph"],
};

const databaseSlashMenuItems: ReactSlashMenuItem<VotionBlockSchema>[] = [
  {
    name: "Database",
    aliases: ["database", "db", "inline database", "data"],
    group: "Database",
    icon: <Table2 size={18} />,
    hint: "Inline database with table, board, and gallery views",
    execute: (editor) =>
      insertOrUpdateBlock(editor, createDatabaseBlock("table")),
  },
  ...DATABASE_VIEW_OPTIONS.filter((option) => option.implemented).map(
    (option) => ({
      name: option.label,
      aliases: databaseViewAliases[option.id],
      group: "Database",
      icon: databaseViewIcons[option.id],
      hint: `Create a database in ${option.label.toLowerCase()}`,
      execute: (editor: BlockNoteEditor<VotionBlockSchema>) =>
        insertOrUpdateBlock(editor, createDatabaseBlock(option.id)),
    })
  ),
  {
    name: "Task board",
    aliases: ["tasks", "task database", "project tasks", "todo board"],
    group: "Database",
    icon: <Kanban size={18} />,
    hint: "Kanban board with status, due date, and priority",
    execute: (editor) =>
      insertOrUpdateBlock(editor, databaseBlock(taskBoardData())),
  },
  {
    name: "Habit tracker",
    aliases: ["habits", "habit database", "daily habits", "streak"],
    group: "Database",
    icon: <LayoutGrid size={18} />,
    hint: "Gallery cards with daily habit checkboxes",
    execute: (editor) =>
      insertOrUpdateBlock(editor, databaseBlock(habitTrackerData())),
  },
  {
    name: "Project tracker",
    aliases: ["projects", "project board", "roadmap board"],
    group: "Database",
    icon: <LayoutDashboard size={18} />,
    hint: "Board grouped by project status",
    execute: (editor) =>
      insertOrUpdateBlock(editor, databaseBlock(projectTrackerData())),
  },
];

const customSlashMenuItems: ReactSlashMenuItem<VotionBlockSchema>[] = [
  ...databaseSlashMenuItems,
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
    name: "Toggle",
    aliases: ["toggle", "accordion", "dropdown", "toggle list"],
    group: "Lists",
    icon: <ChevronRight size={18} />,
    hint: "Collapsible section with nested blocks",
    execute: (editor) =>
      insertOrUpdateBlock(editor, emptyToggleBlock(2)),
  },
  {
    name: "New subpage",
    aliases: ["subpage", "child page", "nested page"],
    group: "Basic blocks",
    icon: <PlusSquare size={18} />,
    hint: "Create a child page and link to it",
    execute: (editor) => {
      usePageLinkPicker.getState().onOpen(editor);
    },
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
      insertOrUpdateBlock(editor, {
        type: "votionDivider",
        props: {
          textAlignment: "left",
          backgroundColor: "default",
          textColor: "default",
        },
        children: [],
      }),
  },
  {
    name: "Code",
    aliases: ["code", "codeblock", "snippet", "pre"],
    group: "Basic blocks",
    icon: <Code2 size={18} />,
    hint: "Monospace code block",
    execute: (editor) => insertOrUpdateBlock(editor, emptyCodeBlock()),
  },
  {
    name: "Callout",
    aliases: ["callout", "info", "note", "tip"],
    group: "Basic blocks",
    icon: <Lightbulb size={18} />,
    hint: "Highlight important information",
    execute: (editor) =>
      insertOrUpdateBlock(editor, calloutBlock("blue", "💡")),
  },
  {
    name: "Warning",
    aliases: ["warning", "alert", "caution"],
    group: "Basic blocks",
    icon: <AlertTriangle size={18} />,
    hint: "Call out a warning",
    execute: (editor) =>
      insertOrUpdateBlock(editor, calloutBlock("yellow", "⚠️")),
  },
  {
    name: "Success",
    aliases: ["success", "done", "check"],
    group: "Basic blocks",
    icon: <Sparkles size={18} />,
    hint: "Highlight a success or win",
    execute: (editor) =>
      insertOrUpdateBlock(editor, calloutBlock("green", "✅")),
  },
  {
    name: "Error",
    aliases: ["error", "danger", "important"],
    group: "Basic blocks",
    icon: <AlertCircle size={18} />,
    hint: "Highlight an error or blocker",
    execute: (editor) =>
      insertOrUpdateBlock(editor, calloutBlock("red", "🚨")),
  },
  {
    name: "Table of contents",
    aliases: ["toc", "contents", "outline", "index"],
    group: "Advanced blocks",
    icon: <ListTree size={18} />,
    hint: "Auto-generated outline from headings",
    execute: (editor) => insertOrUpdateBlock(editor, emptyTocBlock()),
  },
  {
    name: "3 columns",
    aliases: ["3col", "three columns", "triple"],
    group: "Advanced blocks",
    icon: <Columns size={18} />,
    hint: "Three side-by-side columns like Notion",
    execute: (editor) =>
      insertOrUpdateBlock(editor, defaultThreeColumnLayout()),
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
    name: "Embed",
    aliases: ["embed", "iframe", "youtube", "video"],
    group: "Media",
    icon: <Film size={18} />,
    hint: "Embed YouTube, Vimeo, or Loom",
    execute: (editor) => insertOrUpdateBlock(editor, emptyEmbedBlock()),
  },
  {
    name: "Bookmark",
    aliases: ["bookmark", "web", "link preview", "url"],
    group: "Media",
    icon: <Bookmark size={18} />,
    hint: "Save a link as a bookmark card",
    execute: (editor) => insertOrUpdateBlock(editor, emptyBookmarkBlock()),
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
      insertOrUpdateBlock(editor, emptySmallTextBlock()),
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
    hint: "Insert an emoji",
    execute: (editor) =>
      insertOrUpdateBlock(editor, blockWithText("paragraph", "✨ ")),
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

export const getBaseSlashMenuItems = () => getDefaultSlashMenuItems();
