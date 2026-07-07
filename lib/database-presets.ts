import { PartialBlock } from "@blocknote/core";

import type { VotionBlockSchema } from "@/lib/block-schema";
import {
  galleryTable,
  kanbanTable,
  stringifyJsonProp,
  tableData,
  withDatabaseView,
  type TableData,
  type TableView,
} from "@/lib/blocks/votion-block-utils";

const baseProps = {
  textAlignment: "left" as const,
  backgroundColor: "default" as const,
  textColor: "default" as const,
};

export const databaseBlock = (data: TableData): PartialBlock<VotionBlockSchema> => ({
  type: "votionTable",
  props: {
    ...baseProps,
    data: stringifyJsonProp(data),
  },
  children: [],
});

const notionDefaultRows = () => [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export const inlineDatabaseData = (): TableData =>
  tableData(["Name", "Tags", "Date"], notionDefaultRows());

export const taskBoardData = (): TableData =>
  kanbanTable(
    ["Name", "Status", "Due date", "Priority"],
    [
      ["New task", "Not started", "", "Medium"],
      ["", "In progress", "", ""],
      ["", "Done", "", ""],
    ],
    "Status"
  );

export const habitTrackerData = (): TableData => {
  const today = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return galleryTable(
    ["Date", "✍️ Journal", "🏃 Exercise", "😴 Sleep", "🧘 Mindfulness"],
    [
      [today, "false", "false", "false", "false"],
      ["", "false", "false", "false", "false"],
      ["", "false", "false", "false", "false"],
    ]
  );
};

export const projectTrackerData = (): TableData =>
  kanbanTable(
    ["Project", "Status", "Owner", "Due date"],
    [
      ["Website redesign", "In progress", "", ""],
      ["Q2 roadmap", "Not started", "", ""],
      ["", "Done", "", ""],
    ],
    "Status"
  );

export const createDatabasePreset = (view: TableView): TableData => {
  if (view === "board") {
    return taskBoardData();
  }

  if (view === "gallery") {
    return habitTrackerData();
  }

  if (view === "calendar" || view === "timeline") {
    return withDatabaseView(
      tableData(
        ["Name", "Date", "Tags"],
        [
          ["", "", ""],
          ["", "", ""],
        ]
      ),
      view
    );
  }

  if (view === "feed") {
    return withDatabaseView(
      tableData(
        ["Title", "Date", "Summary"],
        [
          ["", "", ""],
          ["", "", ""],
        ]
      ),
      "feed"
    );
  }

  if (view === "list") {
    return withDatabaseView(
      tableData(
        ["Name", "Tags", "Date"],
        notionDefaultRows()
      ),
      "list"
    );
  }

  if (view === "dashboard") {
    return withDatabaseView(
      tableData(
        ["Metric", "Target", "Actual", "Done"],
        [
          ["Tasks completed", "10", "0", "false"],
          ["Hours focused", "20", "0", "false"],
        ]
      ),
      "dashboard"
    );
  }

  return withDatabaseView(inlineDatabaseData(), view === "table" ? "table" : view);
};

export const createDatabaseBlock = (view: TableView = "table") =>
  databaseBlock(createDatabasePreset(view));
