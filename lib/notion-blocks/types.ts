export type NotionTagColor =
  | "gray"
  | "blue"
  | "red"
  | "pink"
  | "green"
  | "yellow"
  | "orange"
  | "purple";

export type NotionTag = {
  label: string;
  color: NotionTagColor;
};

export type NotionColumn = {
  id: string;
  label: string;
};

export type NotionRow = {
  id: string;
  cells: Record<string, string>;
  tags?: Record<string, NotionTag>;
};

export type NotionGroup = {
  title: string;
  rows: NotionRow[];
};

export type NotionDatabaseData = {
  title: string;
  icon?: string;
  tabs: string[];
  activeTab?: string;
  columns: NotionColumn[];
  groups: NotionGroup[];
  sumColumnId?: string;
};

export type NotionGalleryItem = {
  id: string;
  title: string;
  icon?: string;
  iconColor?: string;
  properties: { label: string; value: string }[];
};

export type NotionGalleryData = {
  title: string;
  icon?: string;
  tabs: string[];
  activeTab?: string;
  items: NotionGalleryItem[];
};

export type NotionColumnsData = {
  left: NotionDatabaseData;
  right: NotionDatabaseData;
};

export const parseJsonProp = <T>(value: string, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const stringifyJsonProp = (value: unknown) => JSON.stringify(value);
