"use client";

import type { ColumnType, TableColumn, TableData } from "@/lib/blocks/votion-block-utils";
import {
  createColumn,
  createEmptyRow,
  getActiveViewTab,
  getBoardGroups,
  getCardTitle,
  getCheckboxColumns,
  getDetailColumns,
  getFilteredRowEntries,
  isTruthy,
  parseFlexibleDate,
  sortRowEntries,
} from "@/lib/blocks/votion-database-utils";

const columnTypes: { value: ColumnType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
  { value: "select", label: "Select" },
  { value: "date", label: "Date" },
];

export const TableCellInput = ({
  column,
  value,
  editable,
  onChange,
  variant = "default",
}: {
  column: TableColumn;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
  variant?: "default" | "gallery-button";
}) => {
  if (variant === "gallery-button" && column.type === "checkbox") {
    return (
      <button
        type="button"
        className={`votion-gallery-habit-btn${isTruthy(value) ? " checked" : ""}`}
        disabled={!editable}
        onClick={() => onChange(isTruthy(value) ? "false" : "true")}
      >
        <span className="votion-gallery-habit-check">
          {isTruthy(value) ? "✓" : ""}
        </span>
        <span>{column.name}</span>
      </button>
    );
  }

  if (!editable) {
    if (column.type === "checkbox") {
      return <span>{isTruthy(value) ? "☑" : "☐"}</span>;
    }

    return <span>{value}</span>;
  }

  if (column.type === "checkbox") {
    return (
      <input
        type="checkbox"
        className="votion-table-checkbox"
        checked={isTruthy(value)}
        onChange={(event) => onChange(event.target.checked ? "true" : "false")}
      />
    );
  }

  if (column.type === "select") {
    const options = column.options ?? [];

    return (
      <select
        className="votion-table-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "date") {
    return (
      <input
        type="date"
        className="votion-table-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (column.type === "number") {
    return (
      <input
        type="number"
        className="votion-table-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <span
      className="votion-table-cell"
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.textContent ?? "")}
    >
      {value}
    </span>
  );
};

const getVisibleRows = (data: TableData) => {
  const activeTab = getActiveViewTab(data);
  const filtered = getFilteredRowEntries(data, activeTab.filterPreset);
  return sortRowEntries(data, filtered);
};

export const DatabaseTableView = ({
  data,
  editable,
  onUpdate,
}: {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
}) => {
  const visibleRows = getVisibleRows(data);

  const updateHeader = (index: number, name: string) => {
    const columns = [...data.columns];
    columns[index] = { ...columns[index], name };
    onUpdate({ ...data, columns });
  };

  const updateColumnType = (index: number, type: ColumnType) => {
    const columns = [...data.columns];
    columns[index] = {
      ...columns[index],
      type,
      options:
        type === "select"
          ? columns[index].options?.length
            ? columns[index].options
            : ["Not started", "In progress", "Done"]
          : undefined,
    };
    onUpdate({ ...data, columns });
  };

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  const addColumn = () => {
    const column = createColumn(data, "text");
    onUpdate({
      ...data,
      columns: [...data.columns, column],
      rows: data.rows.map((row) => ({ ...row, [column.id]: "" })),
    });
  };

  const removeRow = (rowIndex: number) => {
    if (data.rows.length <= 1) return;
    onUpdate({
      ...data,
      rows: data.rows.filter((_, index) => index !== rowIndex),
    });
  };

  return (
    <>
      <div className="votion-table-wrap votion-table-wrap-wide">
        <table className="votion-table votion-table-wide">
          <thead>
            <tr>
              {data.columns.map((column, index) => (
                <th key={column.id}>
                  <span
                    className="votion-table-cell votion-table-header-name"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      updateHeader(index, event.currentTarget.textContent ?? "")
                    }
                  >
                    {column.name}
                  </span>
                  {editable && (
                    <select
                      className="votion-table-column-type"
                      value={column.type}
                      onChange={(event) =>
                        updateColumnType(index, event.target.value as ColumnType)
                      }
                    >
                      {columnTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
              {editable && <th className="votion-table-actions-col" />}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(({ row, rowIndex }) => (
              <tr key={`row-${rowIndex}`}>
                {data.columns.map((column) => (
                  <td key={`${rowIndex}-${column.id}`}>
                    <TableCellInput
                      column={column}
                      value={row[column.id] ?? ""}
                      editable={editable}
                      onChange={(value) => updateCell(rowIndex, column.id, value)}
                    />
                  </td>
                ))}
                {editable && (
                  <td className="votion-table-actions-col">
                    <button
                      type="button"
                      className="votion-table-row-remove"
                      onClick={() => removeRow(rowIndex)}
                      aria-label="Remove row"
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editable && (
        <div className="votion-table-toolbar">
          <button type="button" onClick={() => onUpdate({ ...data, rows: [...data.rows, createEmptyRow(data)] })}>
            + Row
          </button>
          <button type="button" onClick={addColumn}>
            + Column
          </button>
        </div>
      )}
    </>
  );
};

export const DatabaseBoardView = ({
  data,
  editable,
  onUpdate,
}: {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
}) => {
  const groupColumn =
    data.columns.find((column) => column.id === data.groupByColumnId) ??
    data.columns.find((column) => column.type === "select") ??
    data.columns[0];

  if (!groupColumn) {
    return (
      <p className="votion-board-empty">
        Add a select column to use board view.
      </p>
    );
  }

  const groups = getBoardGroups(data, groupColumn);
  const detailColumns = getDetailColumns(data, groupColumn.id);
  const filteredRows = getVisibleRows(data);

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  const addCard = (groupValue: string) => {
    onUpdate({
      ...data,
      rows: [
        ...data.rows,
        createEmptyRow(data, {
          [groupColumn.id]: groupValue === "No status" ? "" : groupValue,
        }),
      ],
    });
  };

  return (
    <div className="votion-board" contentEditable={false}>
      <div className="votion-board-columns">
        {groups.map((group) => {
          const cards = filteredRows.filter(
            ({ row }) => (row[groupColumn.id]?.trim() || "No status") === group
          );

          return (
            <div key={group} className="votion-board-column">
              <div className="votion-board-column-header">
                <span>{group}</span>
                <span className="votion-board-count">{cards.length}</span>
              </div>
              <div className="votion-board-cards">
                {cards.map(({ row, rowIndex }) => (
                  <div key={`${group}-${rowIndex}`} className="votion-board-card">
                    <p className="votion-board-card-title">
                      {getCardTitle(data, row)}
                    </p>
                    <div className="votion-board-card-fields">
                      {detailColumns.map((column) => (
                        <label key={column.id} className="votion-board-field">
                          <span>{column.name}</span>
                          <TableCellInput
                            column={column}
                            value={row[column.id] ?? ""}
                            editable={editable}
                            onChange={(value) =>
                              updateCell(rowIndex, column.id, value)
                            }
                          />
                        </label>
                      ))}
                      {getCheckboxColumns(data).map((column) => (
                        <TableCellInput
                          key={column.id}
                          column={column}
                          value={row[column.id] ?? ""}
                          editable={editable}
                          variant="gallery-button"
                          onChange={(value) =>
                            updateCell(rowIndex, column.id, value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {editable && (
                <button
                  type="button"
                  className="votion-board-add-card"
                  onClick={() => addCard(group)}
                >
                  + New card
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DatabaseGalleryView = ({
  data,
  editable,
  onUpdate,
}: {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
}) => {
  const checkboxColumns = getCheckboxColumns(data);
  const detailColumns = getDetailColumns(data);
  const visibleRows = getVisibleRows(data);

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  const addCard = () => {
    onUpdate({
      ...data,
      rows: [...data.rows, createEmptyRow(data)],
    });
  };

  return (
    <div className="votion-gallery" contentEditable={false}>
      <div className="votion-gallery-grid">
        {visibleRows.map(({ row, rowIndex }) => (
          <div key={`gallery-${rowIndex}`} className="votion-gallery-card">
            <div className="votion-gallery-card-header">
              <span
                className="votion-gallery-card-date"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(event) => {
                  const titleColumn =
                    data.columns.find(
                      (column) => column.id === data.galleryCardColumnId
                    ) ?? data.columns[0];
                  if (!titleColumn) return;
                  updateCell(
                    rowIndex,
                    titleColumn.id,
                    event.currentTarget.textContent?.replace(/^@/, "") ?? ""
                  );
                }}
              >
                {getCardTitle(data, row)}
              </span>
            </div>
            <div className="votion-gallery-card-body">
              {checkboxColumns.map((column) => (
                <TableCellInput
                  key={column.id}
                  column={column}
                  value={row[column.id] ?? ""}
                  editable={editable}
                  variant="gallery-button"
                  onChange={(value) => updateCell(rowIndex, column.id, value)}
                />
              ))}
              {detailColumns.map((column) => (
                <label key={column.id} className="votion-gallery-meta">
                  <span>{column.name}</span>
                  <TableCellInput
                    column={column}
                    value={row[column.id] ?? ""}
                    editable={editable}
                    onChange={(value) => updateCell(rowIndex, column.id, value)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        {editable && (
          <button type="button" className="votion-gallery-new-card" onClick={addCard}>
            + New
          </button>
        )}
      </div>
    </div>
  );
};

const getTitleColumn = (data: TableData) => {
  const titleColumn =
    (data.galleryCardColumnId
      ? data.columns.find((column) => column.id === data.galleryCardColumnId)
      : undefined) ??
    data.columns.find((column) => column.name.toLowerCase() === "name") ??
    data.columns.find((column) => column.type === "text") ??
    data.columns[0];

  return titleColumn;
};

const getDateColumn = (data: TableData) => {
  return (
    (data.calendarDateColumnId
      ? data.columns.find((column) => column.id === data.calendarDateColumnId)
      : undefined) ??
    data.columns.find((column) => column.name.toLowerCase() === "date") ??
    data.columns.find((column) => column.type === "date")
  );
};

type DatabaseViewProps = {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
};

export const DatabaseListView = ({ data, editable, onUpdate }: DatabaseViewProps) => {
  const activeTab = getActiveViewTab(data);
  const titleColumn = getTitleColumn(data);
  const detailColumns = getDetailColumns(data, data.groupByColumnId);
  const entries = sortRowEntries(
    data,
    getFilteredRowEntries(data, activeTab.filterPreset)
  );

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  const addRow = () => {
    onUpdate({
      ...data,
      rows: [...data.rows, createEmptyRow(data)],
    });
  };

  return (
    <div className="votion-list-view" contentEditable={false}>
      {entries.map(({ row, rowIndex }) => (
        <div key={`list-${rowIndex}`} className="votion-list-row">
          <div className="votion-list-row-main">
            <span className="votion-list-title">
              {titleColumn ? row[titleColumn.id]?.trim() || "Untitled" : "Untitled"}
            </span>
            <div className="votion-list-meta">
              {detailColumns.slice(0, 3).map((column) => (
                <span key={column.id} className="votion-list-meta-item">
                  {column.name}: {row[column.id] || "—"}
                </span>
              ))}
            </div>
          </div>
          {editable && (
            <div className="votion-list-row-fields">
              {data.columns.slice(0, 4).map((column) => (
                <label key={column.id} className="votion-list-field">
                  <span>{column.name}</span>
                  <TableCellInput
                    column={column}
                    value={row[column.id] ?? ""}
                    editable={editable}
                    onChange={(value) => updateCell(rowIndex, column.id, value)}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      {editable && (
        <button type="button" className="votion-list-new" onClick={addRow}>
          + New
        </button>
      )}
    </div>
  );
};

export const DatabaseFeedView = ({ data, editable, onUpdate }: DatabaseViewProps) => {
  const activeTab = getActiveViewTab(data);
  const titleColumn = getTitleColumn(data);
  const detailColumns = getDetailColumns(data, data.groupByColumnId);
  const entries = sortRowEntries(
    data,
    getFilteredRowEntries(data, activeTab.filterPreset)
  );

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  const addRow = () => {
    onUpdate({
      ...data,
      rows: [...data.rows, createEmptyRow(data)],
    });
  };

  return (
    <div className="votion-feed-view" contentEditable={false}>
      {entries.map(({ row, rowIndex }) => (
        <article key={`feed-${rowIndex}`} className="votion-feed-card">
          <h4>{titleColumn ? row[titleColumn.id]?.trim() || "Untitled" : "Untitled"}</h4>
          <div className="votion-feed-body">
            {detailColumns.map((column) => (
              <p key={column.id}>
                <strong>{column.name}:</strong>{" "}
                {editable ? (
                  <TableCellInput
                    column={column}
                    value={row[column.id] ?? ""}
                    editable={editable}
                    onChange={(value) => updateCell(rowIndex, column.id, value)}
                  />
                ) : (
                  row[column.id] || "—"
                )}
              </p>
            ))}
          </div>
        </article>
      ))}
      {editable && (
        <button type="button" className="votion-feed-new" onClick={addRow}>
          + New
        </button>
      )}
    </div>
  );
};

export const DatabaseDashboardView = ({ data }: { data: TableData }) => {
  const entries = getFilteredRowEntries(data);
  const checkboxColumns = getCheckboxColumns(data);
  const completedRows = entries.filter(({ row }) =>
    checkboxColumns.length > 0
      ? checkboxColumns.every((column) => isTruthy(row[column.id] ?? ""))
      : false
  ).length;

  const cards = [
    { label: "Total rows", value: String(entries.length) },
    { label: "Columns", value: String(data.columns.length) },
    {
      label: "Completed",
      value: checkboxColumns.length > 0 ? String(completedRows) : "—",
    },
    {
      label: "Completion rate",
      value:
        checkboxColumns.length > 0 && entries.length > 0
          ? `${Math.round((completedRows / entries.length) * 100)}%`
          : "—",
    },
  ];

  return (
    <div className="votion-dashboard-view" contentEditable={false}>
      {cards.map((card) => (
        <div key={card.label} className="votion-dashboard-card">
          <p>{card.label}</p>
          <strong>{card.value}</strong>
        </div>
      ))}
    </div>
  );
};

export const DatabaseCalendarView = ({ data, editable, onUpdate }: DatabaseViewProps) => {
  const dateColumn = getDateColumn(data);
  const titleColumn = getTitleColumn(data);
  const entries = sortRowEntries(data, getFilteredRowEntries(data));

  if (!dateColumn) {
    return (
      <p className="votion-board-empty" contentEditable={false}>
        Add a date column to use calendar view.
      </p>
    );
  }

  const grouped = new Map<string, { row: Record<string, string>; rowIndex: number }[]>();

  entries.forEach(({ row, rowIndex }) => {
    const parsed = parseFlexibleDate(row[dateColumn.id] ?? "");
    const key = parsed
      ? parsed.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "No date";
    const bucket = grouped.get(key) ?? [];
    bucket.push({ row, rowIndex });
    grouped.set(key, bucket);
  });

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  return (
    <div className="votion-calendar-view" contentEditable={false}>
      {Array.from(grouped.entries()).map(([day, items]) => (
        <div key={day} className="votion-calendar-day">
          <div className="votion-calendar-day-header">{day}</div>
          {items.map(({ row, rowIndex }) => (
            <div key={`${day}-${rowIndex}`} className="votion-calendar-item">
              <span>{titleColumn ? row[titleColumn.id]?.trim() || "Untitled" : "Untitled"}</span>
              {editable && (
                <TableCellInput
                  column={dateColumn}
                  value={row[dateColumn.id] ?? ""}
                  editable={editable}
                  onChange={(value) => updateCell(rowIndex, dateColumn.id, value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const DatabaseTimelineView = ({ data, editable, onUpdate }: DatabaseViewProps) => {
  const dateColumn = getDateColumn(data);
  const titleColumn = getTitleColumn(data);
  const entries = sortRowEntries(data, getFilteredRowEntries(data)).sort((left, right) => {
    if (!dateColumn) return 0;
    const leftDate = parseFlexibleDate(left.row[dateColumn.id] ?? "")?.getTime() ?? 0;
    const rightDate = parseFlexibleDate(right.row[dateColumn.id] ?? "")?.getTime() ?? 0;
    return leftDate - rightDate;
  });

  if (!dateColumn) {
    return (
      <p className="votion-board-empty" contentEditable={false}>
        Add a date column to use timeline view.
      </p>
    );
  }

  const updateCell = (rowIndex: number, columnId: string, value: string) => {
    const rows = data.rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onUpdate({ ...data, rows });
  };

  return (
    <div className="votion-timeline-view" contentEditable={false}>
      {entries.map(({ row, rowIndex }) => (
        <div key={`timeline-${rowIndex}`} className="votion-timeline-row">
          <div className="votion-timeline-date">
            {row[dateColumn.id]?.trim() || "No date"}
          </div>
          <div className="votion-timeline-bar">
            <span>{row[titleColumn.id]?.trim() || "Untitled"}</span>
            {editable && (
              <TableCellInput
                column={dateColumn}
                value={row[dateColumn.id] ?? ""}
                editable={editable}
                onChange={(value) => updateCell(rowIndex, dateColumn.id, value)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
