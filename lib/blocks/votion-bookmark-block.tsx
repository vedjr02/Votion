import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { getDomainFromUrl, normalizeUrl } from "@/lib/embed-utils";

type EditorWithUpdate = {
  updateBlock: (block: unknown, update: unknown) => void;
  isEditable: boolean;
};

type BookmarkBlock = {
  props: {
    url?: string;
    title?: string;
    description?: string;
  };
};

const VotionBookmarkContent = ({
  block,
  editor,
}: {
  block: BookmarkBlock;
  editor: EditorWithUpdate;
}) => {
  const url = block.props.url ?? "";
  const title = block.props.title ?? "";
  const description = block.props.description ?? "";
  const [draftUrl, setDraftUrl] = useState(url);
  const { isEditable } = editor;

  const updateProps = (next: {
    url?: string;
    title?: string;
    description?: string;
  }) => {
    editor.updateBlock(block, {
      props: next,
    });
  };

  const saveUrl = (value: string) => {
    const normalized = normalizeUrl(value);
    updateProps({
      url: normalized,
      title: title || getDomainFromUrl(normalized),
    });
  };

  if (!url && isEditable) {
    return (
      <div className="votion-bookmark-root" contentEditable={false}>
        <input
          className="votion-bookmark-input"
          value={draftUrl}
          placeholder="Paste any link to create a bookmark..."
          onChange={(event) => setDraftUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveUrl(draftUrl);
            }
          }}
          onBlur={() => saveUrl(draftUrl)}
        />
      </div>
    );
  }

  const displayTitle = title || getDomainFromUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="votion-bookmark-card"
      contentEditable={false}
    >
      <div className="votion-bookmark-body">
        {isEditable ? (
          <>
            <input
              className="votion-bookmark-title-input"
              defaultValue={displayTitle}
              onClick={(event) => event.preventDefault()}
              onBlur={(event) =>
                updateProps({ title: event.target.value.trim() })
              }
            />
            <input
              className="votion-bookmark-description-input"
              defaultValue={description}
              placeholder="Add a description..."
              onClick={(event) => event.preventDefault()}
              onBlur={(event) =>
                updateProps({ description: event.target.value.trim() })
              }
            />
            <input
              className="votion-bookmark-url-input"
              defaultValue={url}
              onClick={(event) => event.preventDefault()}
              onBlur={(event) => saveUrl(event.target.value)}
            />
          </>
        ) : (
          <>
            <p className="votion-bookmark-title">{displayTitle}</p>
            {description && (
              <p className="votion-bookmark-description">{description}</p>
            )}
            <p className="votion-bookmark-url">{getDomainFromUrl(url)}</p>
          </>
        )}
      </div>
      <div className="votion-bookmark-icon">
        <ExternalLink className="h-4 w-4" />
      </div>
    </a>
  );
};

export const VotionBookmark = createReactBlockSpec({
  type: "votionBookmark",
  propSchema: {
    ...defaultProps,
    url: { default: "" },
    title: { default: "" },
    description: { default: "" },
  },
  containsInlineContent: false,
  render: ({ block, editor }) => (
    <VotionBookmarkContent
      block={block}
      editor={editor as unknown as EditorWithUpdate}
    />
  ),
});

export const emptyBookmarkBlock = () => ({
  type: "votionBookmark" as const,
  props: {
    textAlignment: "left" as const,
    backgroundColor: "default" as const,
    textColor: "default" as const,
    url: "",
    title: "",
    description: "",
  },
  children: [],
});
