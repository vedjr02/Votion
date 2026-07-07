import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

import { NotionGalleryView } from "@/lib/blocks/notion-ui";
import {
  NotionGalleryData,
  parseJsonProp,
  stringifyJsonProp,
} from "@/lib/notion-blocks/types";

const emptyGallery: NotionGalleryData = {
  title: "Gallery",
  tabs: ["All"],
  items: [],
};

export const NotionGallery = createReactBlockSpec({
  type: "notionGallery",
  propSchema: {
    ...defaultProps,
    data: {
      default: stringifyJsonProp(emptyGallery),
    },
  },
  containsInlineContent: false,
  render: ({ block }) => {
    const data = parseJsonProp<NotionGalleryData>(block.props.data, emptyGallery);

    return (
      <div className="notion-block-root" contentEditable={false}>
        <NotionGalleryView data={data} />
      </div>
    );
  },
});
