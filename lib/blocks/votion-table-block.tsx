import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import {
  emptyTable,
  normalizeTableData,
  stringifyJsonProp,
  type ColumnType,
  type TableColumn,
  type TableData,
} from "@/lib/blocks/votion-block-utils";

const defaultTableData = stringifyJsonProp(emptyTable());

type EditorWithUpdate = {
  updateBlock: (block: unknown, update: unknown) => void;
  isEditable: boolean;
};

const columnTypes: { value: ColumnType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
  { value: "select", label: "Select" },
  { value: "date", label: "Date" },
];

const isTruthy = (value: string) =>
  value === "true" || value === "1" || value.toLowerCase() === "yes";

const getCardTitle = (data: TableData, row: Record<string, string>) => {
  const nameColumn =
    data.columns.find((column) => column.name.toLowerCase() === "name") ??
    data.columns.find((column) => column.type === "text");

  return nameColumn ? row[nameColumn.id]?.trim() || "Untitled" : "Untitled";
};

const getBoardGroups = (data: TableData, groupColumn: TableColumn) => {
  const optionSet = new Set(groupColumn.options ?? []);
  for (const row of data.rows) {
    const value = row[groupColumn.id]?.trim();
    if (value) optionSet.add(value);
  }

  const groups = Array.from(optionSet);
  if (groups.length === 0) {
    groups.push("No status");
  }

  return groups;
};

const TableCellInput = ({
  column,
  value,
  editable,
  onChange,
}: {
  column: TableColumn;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}) => {
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

const TableView = ({
  data,
  editable,
  onUpdate,
}: {
  data: TableData;
  editable: boolean;
  onUpdate: (next: TableData) => void;
}) => {
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

  const addRow = () => {
    onUpdate({
      ...data,
      rows: [
        ...data.rows,
        Object.fromEntries(data.columns.map((column) => [column.id, ""])),
      ],
    });
  };

  const addColumn = () => {
    const nextIndex = data.columns.length + 1;
    const column: TableColumn = {
      id: `col-${nextIndex}-${Date.now()}`,
      name: `Column ${nextIndex}`,
      type: "text",
    };

    onUpdate({
      ...data,
      columns: [...data.columns, column],
      rows: data.rows.map((row) => ({ ...row, [column.id]: "" })),
      groupByColumnId: data.groupByColumnId ?? column.id,
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
      <div className="votion-table-wrap">
        <table className="votion-table">
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
            {data.rows.map((row, rowIndex) => (
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
                      contentEditable={false}
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
        <div className="votion-table-toolbar" contentEditable={false}>
          <button type="button" onClick={addRow}>
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

const BoardView = ({
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
  const detailColumns = data.columns.filter(
    (column) => column.id !== groupColumn.id
  );

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
        Object.fromEntries([
          ...data.columns.map((column) => [column.id, ""]),
          [groupColumn.id, groupValue === "No status" ? "" : groupValue],
        ]),
      ],
    });
  };

  return (
    <div className="votion-board" contentEditable={false}>
      {groups.map((group) => {
        const cards = data.rows.filter(
          (row) => (row[groupColumn.id]?.trim() || "No status") === group
        );

        return (
          <div key={group} className="votion-board-column">
            <div className="votion-board-column-header">
              <span>{group}</span>
              <span className="votion-board-count">{cards.length}</span>
            </div>
            <div className="votion-board-cards">
              {cards.map((row) => {
                const rowIndex = data.rows.indexOf(row);

                return (
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
                    </div>
                  </div>
                );
              })}
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
  );
};

export const VotionTable = createReactBlockSpec({
  type: "votionTable",
  propSchema: {
    ...defaultProps,
    data: {
      default: defaultTableData,
    },
  },
  containsInlineContent: false,
  render: ({ block, editor }) => {
    const data = normalizeTableData(block.props.data, emptyTable());
    const { isEditable } = editor as EditorWithUpdate;

    const updateData = (next: TableData) => {
      (editor as unknown as EditorWithUpdate).updateBlock(block, {
        props: { data: stringifyJsonProp(next) },
      });
    };

    const selectColumns = data.columns.filter((column) => column.type === "select");

    return (
      <div className="votion-table-root">
        <div className="votion-table-view-tabs" contentEditable={false}>
          <button
            type="button"
            className={data.view === "table" ? "active" : undefined}
            onClick={() => updateData({ ...data, view: "table" })}
          >
            Table
          </button>
          <button
            type="button"
            className={data.view === "board" ? "active" : undefined}
            onClick={() =>
              updateData({
                ...data,
                view: "board",
                groupByColumnId:
                  data.groupByColumnId ??
                  selectColumns[0]?.id ??
                  data.columns[0]?.id,
              })
            }
          >
            Board
          </button>
          {data.view === "board" && selectColumns.length > 0 && isEditable && (
            <select
              className="votion-table-group-by"
              value={data.groupByColumnId}
              onChange={(event) =>
                updateData({ ...data, groupByColumnId: event.target.value })
              }
            >
              {selectColumns.map((column) => (
                <option key={column.id} value={column.id}>
                  Group by {column.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {data.view === "board" ? (
          <BoardView data={data} editable={isEditable} onUpdate={updateData} />
        ) : (
          <TableView data={data} editable={isEditable} onUpdate={updateData} />
        )}
      </div>
    );
  },
});
