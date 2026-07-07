import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import {
  emptyTable,
  parseJsonProp,
  stringifyJsonProp,
  type TableData,
} from "@/lib/blocks/votion-block-utils";

const defaultTableData = stringifyJsonProp(emptyTable());

type EditorWithUpdate = {
  updateBlock: (block: unknown, update: unknown) => void;
  isEditable: boolean;
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
    const data = parseJsonProp<TableData>(block.props.data, emptyTable());
    const { isEditable } = editor as EditorWithUpdate;

    const updateData = (next: TableData) => {
      (editor as unknown as EditorWithUpdate).updateBlock(block, {
        props: { data: stringifyJsonProp(next) },
      });
    };

    const updateHeader = (index: number, value: string) => {
      const headers = [...data.headers];
      headers[index] = value;
      updateData({ ...data, headers });
    };

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
      const rows = data.rows.map((row, rowIdx) =>
        rowIdx === rowIndex
          ? row.map((cell, colIdx) => (colIdx === colIndex ? value : cell))
          : row
      );
      updateData({ ...data, rows });
    };

    const addRow = () => {
      updateData({
        ...data,
        rows: [...data.rows, data.headers.map(() => "")],
      });
    };

    const addColumn = () => {
      updateData({
        headers: [...data.headers, `Column ${data.headers.length + 1}`],
        rows: data.rows.map((row) => [...row, ""]),
      });
    };

    const removeRow = (rowIndex: number) => {
      if (data.rows.length <= 1) return;
      updateData({
        ...data,
        rows: data.rows.filter((_, index) => index !== rowIndex),
      });
    };

    return (
      <div className="votion-table-root">
        <div className="votion-table-wrap">
          <table className="votion-table">
            <thead>
              <tr>
                {data.headers.map((header, index) => (
                  <th key={`header-${index}`}>
                    <span
                      className="votion-table-cell"
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        updateHeader(index, event.currentTarget.textContent ?? "")
                      }
                    >
                      {header}
                    </span>
                  </th>
                ))}
                {isEditable && <th className="votion-table-actions-col" />}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`}>
                      <span
                        className="votion-table-cell"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(event) =>
                          updateCell(
                            rowIndex,
                            colIndex,
                            event.currentTarget.textContent ?? ""
                          )
                        }
                      >
                        {cell}
                      </span>
                    </td>
                  ))}
                  {isEditable && (
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
        {isEditable && (
          <div className="votion-table-toolbar" contentEditable={false}>
            <button type="button" onClick={addRow}>
              + Row
            </button>
            <button type="button" onClick={addColumn}>
              + Column
            </button>
          </div>
        )}
      </div>
    );
  },
});
