"use client";

import {
  ArrowDownUp,
  ChevronDown,
  Filter,
  LayoutGrid,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  Kanban,
} from "lucide-react";

import type { TableColumn, TableData } from "@/lib/blocks/votion-block-utils";
import {
  createColumn,
  createEmptyRow,
  defaultDatabaseViewTabs,
  getActiveViewTab,
} from "@/lib/blocks/votion-database-utils";

type DatabaseToolbarProps = {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
};

export const DatabaseToolbar = ({
  data,
  editable,
  onUpdate,
}: DatabaseToolbarProps) => {
  const viewTabs = data.viewTabs ?? defaultDatabaseViewTabs();
  const activeTab = getActiveViewTab(data);
  const selectColumns = data.columns.filter((column) => column.type === "select");

  const setViewTab = (tabId: string) => {
    const tab = viewTabs.find((item) => item.id === tabId);
    if (!tab) return;

    onUpdate({
      ...data,
      activeViewTabId: tab.id,
      view: tab.view,
      showFilterPanel: false,
      showSortPanel: false,
    });
  };

  const addRow = () => {
    onUpdate({
      ...data,
      rows: [...data.rows, createEmptyRow(data)],
    });
  };

  const addColumn = (type: TableColumn["type"] = "text") => {
    const column = createColumn(data, type);
    onUpdate({
      ...data,
      columns: [...data.columns, column],
      rows: data.rows.map((row) => ({ ...row, [column.id]: "" })),
      groupByColumnId: data.groupByColumnId ?? column.id,
    });
  };

  return (
    <div className="votion-db-toolbar" contentEditable={false}>
      <div className="votion-db-view-tabs">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              (data.activeViewTabId ?? activeTab.id) === tab.id ? "active" : undefined
            }
            onClick={() => setViewTab(tab.id)}
          >
            {tab.icon ? `${tab.icon} ` : ""}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="votion-db-toolbar-actions">
        <div className="votion-db-icon-group">
          <button
            type="button"
            className={data.view === "table" ? "active" : undefined}
            title="Table view"
            onClick={() => onUpdate({ ...data, view: "table" })}
          >
            <Table2 size={15} />
          </button>
          <button
            type="button"
            className={data.view === "board" ? "active" : undefined}
            title="Board view"
            onClick={() =>
              onUpdate({
                ...data,
                view: "board",
                groupByColumnId:
                  data.groupByColumnId ??
                  selectColumns[0]?.id ??
                  data.columns[0]?.id,
              })
            }
          >
            <Kanban size={15} />
          </button>
          <button
            type="button"
            className={data.view === "gallery" ? "active" : undefined}
            title="Gallery view"
            onClick={() =>
              onUpdate({
                ...data,
                view: "gallery",
                galleryCardColumnId:
                  data.galleryCardColumnId ?? data.columns[0]?.id,
              })
            }
          >
            <LayoutGrid size={15} />
          </button>
        </div>

        <div className="votion-db-icon-group">
          <button
            type="button"
            className={data.showFilterPanel ? "active" : undefined}
            title="Filter"
            onClick={() =>
              onUpdate({
                ...data,
                showFilterPanel: !data.showFilterPanel,
                showSortPanel: false,
              })
            }
          >
            <Filter size={15} />
          </button>
          <button
            type="button"
            className={data.showSortPanel ? "active" : undefined}
            title="Sort"
            onClick={() =>
              onUpdate({
                ...data,
                showSortPanel: !data.showSortPanel,
                showFilterPanel: false,
              })
            }
          >
            <ArrowDownUp size={15} />
          </button>
          <button
            type="button"
            className={data.showSearch ? "active" : undefined}
            title="Search"
            onClick={() =>
              onUpdate({
                ...data,
                showSearch: !data.showSearch,
              })
            }
          >
            <Search size={15} />
          </button>
          <button
            type="button"
            title="Properties"
            onClick={() => addColumn("text")}
            disabled={!editable}
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {editable && (
          <div className="votion-db-new-wrap">
            <button type="button" className="votion-db-new" onClick={addRow}>
              <Plus size={15} />
              New
              <ChevronDown size={14} />
            </button>
            <div className="votion-db-new-menu">
              <button type="button" onClick={addRow}>
                New row
              </button>
              <button type="button" onClick={() => addColumn("text")}>
                New column
              </button>
              <button type="button" onClick={() => addColumn("checkbox")}>
                New checkbox
              </button>
              <button type="button" onClick={() => addColumn("select")}>
                New select
              </button>
              <button type="button" onClick={() => addColumn("date")}>
                New date
              </button>
            </div>
          </div>
        )}
      </div>

      {data.showSearch && (
        <div className="votion-db-panel">
          <Search size={14} className="text-muted-foreground" />
          <input
            type="search"
            value={data.filterText ?? ""}
            placeholder="Search in database..."
            onChange={(event) =>
              onUpdate({ ...data, filterText: event.target.value })
            }
          />
        </div>
      )}

      {data.showFilterPanel && (
        <div className="votion-db-panel">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {activeTab.filterPreset && activeTab.filterPreset !== "all"
              ? `Showing ${activeTab.label.toLowerCase()}`
              : "Use the view tabs above for quick filters"}
          </span>
        </div>
      )}

      {data.showSortPanel && (
        <div className="votion-db-panel votion-db-sort-panel">
          <ArrowDownUp size={14} className="text-muted-foreground" />
          <select
            value={data.sortColumnId ?? ""}
            onChange={(event) =>
              onUpdate({
                ...data,
                sortColumnId: event.target.value || undefined,
              })
            }
          >
            <option value="">Sort by...</option>
            {data.columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
          <select
            value={data.sortDirection ?? "asc"}
            onChange={(event) =>
              onUpdate({
                ...data,
                sortDirection: event.target.value as "asc" | "desc",
              })
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      )}

      {data.view === "board" && selectColumns.length > 0 && editable && (
        <div className="votion-db-panel">
          <span className="text-sm text-muted-foreground">Group by</span>
          <select
            className="votion-table-group-by"
            value={data.groupByColumnId}
            onChange={(event) =>
              onUpdate({ ...data, groupByColumnId: event.target.value })
            }
          >
            {selectColumns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
