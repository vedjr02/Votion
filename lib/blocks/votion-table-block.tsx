import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import { DatabaseToolbar } from "@/lib/blocks/votion-database-toolbar";
import {
  DatabaseBoardView,
  DatabaseCalendarView,
  DatabaseDashboardView,
  DatabaseFeedView,
  DatabaseGalleryView,
  DatabaseListView,
  DatabaseTableView,
  DatabaseTimelineView,
} from "@/lib/blocks/votion-database-views";
import {
  emptyTable,
  normalizeTableData,
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
    const data = normalizeTableData(block.props.data, emptyTable());
    const { isEditable } = editor as EditorWithUpdate;

    if (data.columns.length === 0) {
      return (
        <div className="votion-table-root">
          <p className="votion-board-empty">This table has no columns yet.</p>
        </div>
      );
    }

    const updateData = (next: TableData) => {
      (editor as unknown as EditorWithUpdate).updateBlock(block, {
        props: { data: stringifyJsonProp(next) },
      });
    };

    return (
      <div className="votion-table-root votion-database-root">
        <DatabaseToolbar
          data={data}
          editable={isEditable}
          onUpdate={updateData}
        />

        {data.view === "gallery" ? (
          <DatabaseGalleryView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : data.view === "board" ? (
          <DatabaseBoardView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : data.view === "list" ? (
          <DatabaseListView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : data.view === "feed" ? (
          <DatabaseFeedView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : data.view === "dashboard" ? (
          <DatabaseDashboardView data={data} />
        ) : data.view === "calendar" ? (
          <DatabaseCalendarView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : data.view === "timeline" ? (
          <DatabaseTimelineView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        ) : (
          <DatabaseTableView
            data={data}
            editable={isEditable}
            onUpdate={updateData}
          />
        )}
      </div>
    );
  },
});
