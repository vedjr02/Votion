import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import { NotionDatabaseView } from "@/lib/blocks/notion-ui";
import {
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

export const NotionDatabase = createReactBlockSpec({
  type: "notionDatabase",
  propSchema: {
    ...defaultProps,
    data: {
      default: stringifyJsonProp(emptyDatabase),
    },
  },
  containsInlineContent: false,
  render: ({ block }) => {
    const data = parseJsonProp<NotionDatabaseData>(
      block.props.data,
      emptyDatabase
    );

    return (
      <div className="notion-block-root" contentEditable={false}>
        <NotionDatabaseView data={data} />
      </div>
    );
  },
});
