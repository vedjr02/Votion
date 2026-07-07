import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  GanttChart,
  Kanban,
  LayoutDashboard,
  LayoutGrid,
  List,
  Map,
  Newspaper,
  Table2,
} from "lucide-react";

import type { TableView } from "@/lib/blocks/votion-block-utils";

export type DatabaseViewOption = {
  id: TableView;
  label: string;
  icon: LucideIcon;
  implemented: boolean;
  isNew?: boolean;
  disabled?: boolean;
};

export const DATABASE_VIEW_OPTIONS: DatabaseViewOption[] = [
  { id: "table", label: "Table view", icon: Table2, implemented: true },
  { id: "board", label: "Board view", icon: Kanban, implemented: true },
  { id: "gallery", label: "Gallery view", icon: LayoutGrid, implemented: true },
  { id: "list", label: "List view", icon: List, implemented: true },
  { id: "feed", label: "Feed view", icon: Newspaper, implemented: true },
  {
    id: "dashboard",
    label: "Dashboard view",
    icon: LayoutDashboard,
    implemented: true,
    isNew: true,
  },
  { id: "calendar", label: "Calendar view", icon: Calendar, implemented: true },
  { id: "timeline", label: "Timeline view", icon: GanttChart, implemented: true },
  { id: "map", label: "Map view", icon: Map, implemented: false, isNew: true },
  {
    id: "chart",
    label: "Vertical bar chart",
    icon: BarChart3,
    implemented: false,
    disabled: true,
  },
];

export const getDatabaseViewOption = (view: TableView) =>
  DATABASE_VIEW_OPTIONS.find((option) => option.id === view) ??
  DATABASE_VIEW_OPTIONS[0];
