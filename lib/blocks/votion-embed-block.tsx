import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";

import {
  getEmbedUrl,
  normalizeUrl,
} from "@/lib/embed-utils";

type EditorWithUpdate = {
  updateBlock: (block: unknown, update: unknown) => void;
  isEditable: boolean;
};

type EmbedBlock = {
  props: {
    url?: string;
  };
};

const VotionEmbedContent = ({
  block,
  editor,
}: {
  block: EmbedBlock;
  editor: EditorWithUpdate;
}) => {
  const url = block.props.url ?? "";
  const embedUrl = url ? getEmbedUrl(url) : null;
  const [draft, setDraft] = useState(url);
  const { isEditable } = editor;

  const saveUrl = (nextValue: string) => {
    const normalized = normalizeUrl(nextValue);
    editor.updateBlock(block, {
      props: { url: normalized },
    });
  };

  if (!url && isEditable) {
    return (
      <div className="votion-embed-root" contentEditable={false}>
        <input
          className="votion-embed-input"
          value={draft}
          placeholder="Paste a YouTube, Vimeo, or Loom link..."
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveUrl(draft);
            }
          }}
          onBlur={() => saveUrl(draft)}
        />
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="votion-embed-root votion-embed-fallback" contentEditable={false}>
        {isEditable ? (
          <input
            className="votion-embed-input"
            defaultValue={url}
            placeholder="Paste an embeddable link..."
            onBlur={(event) => saveUrl(event.target.value)}
          />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        )}
        <p className="votion-embed-hint">Supported: YouTube, Vimeo, Loom</p>
      </div>
    );
  }

  return (
    <div className="votion-embed-root" contentEditable={false}>
      <div className="votion-embed-frame-wrap">
        <iframe
          src={embedUrl}
          title="Embedded content"
          className="votion-embed-frame"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {isEditable && (
        <input
          className="votion-embed-input votion-embed-input-compact"
          defaultValue={url}
          onBlur={(event) => saveUrl(event.target.value)}
        />
      )}
    </div>
  );
};

export const VotionEmbed = createReactBlockSpec({
  type: "votionEmbed",
  propSchema: {
    ...defaultProps,
    url: {
      default: "",
    },
  },
  containsInlineContent: false,
  render: ({ block, editor }) => (
    <VotionEmbedContent
      block={block}
      editor={editor as unknown as EditorWithUpdate}
    />
  ),
});

export const emptyEmbedBlock = () => ({
  type: "votionEmbed" as const,
  props: {
    textAlignment: "left" as const,
    backgroundColor: "default" as const,
    textColor: "default" as const,
    url: "",
  },
  children: [],
});

export const embedBlockWithUrl = (url: string) => ({
  ...emptyEmbedBlock(),
  props: {
    ...emptyEmbedBlock().props,
    url: normalizeUrl(url),
  },
});
