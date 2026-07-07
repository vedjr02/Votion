import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import { NotionDatabaseView } from "@/lib/blocks/notion-ui";
import {
  NotionColumnsData,
  NotionDatabaseData,
  parseJsonProp,
  stringifyJsonProp,
} from "@/lib/notion-blocks/types";

const emptyDatabase: NotionDatabaseData = {
  title: "Database",
  tabs: ["All"],
  columns: [],
  groups: [],
};

const emptyColumns: NotionColumnsData = {
  left: emptyDatabase,
  right: emptyDatabase,
};

export const NotionColumns = createReactBlockSpec({
  type: "notionColumns",
  propSchema: {
    ...defaultProps,
    data: {
      default: stringifyJsonProp(emptyColumns),
    },
  },
  containsInlineContent: false,
  render: ({ block }) => {
    const data = parseJsonProp<NotionColumnsData>(block.props.data, emptyColumns);

    return (
      <div className="notion-block-root notion-columns-root" contentEditable={false}>
        <div className="notion-columns-grid">
          <NotionDatabaseView data={data.left} compact />
          <NotionDatabaseView data={data.right} compact />
        </div>
      </div>
    );
  },
});
