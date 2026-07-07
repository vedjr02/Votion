import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, InlineContent } from "@blocknote/react";

type EditorWithUpdate = {
  updateBlock: (block: unknown, update: unknown) => void;
  isEditable: boolean;
};

export const VotionToggle = createReactBlockSpec({
  type: "votionToggle",
  propSchema: {
    ...defaultProps,
    open: {
      default: true,
      values: [true, false],
    },
  },
  containsInlineContent: true,
  render: ({ block, editor }) => {
    const { isEditable } = editor as EditorWithUpdate;
    const isOpen = block.props.open;

    return (
      <div
        className="votion-toggle flex w-full items-start gap-1.5"
        data-open={isOpen ? "true" : "false"}
      >
        <button
          type="button"
          className="votion-toggle-chevron"
          contentEditable={false}
          disabled={!isEditable}
          aria-expanded={isOpen}
          onClick={() => {
            (editor as unknown as EditorWithUpdate).updateBlock(block, {
              props: { open: !isOpen },
            });
          }}
        >
          {isOpen ? "▾" : "▸"}
        </button>
        <div className="votion-toggle-title min-w-0 flex-1">
          <InlineContent />
        </div>
      </div>
    );
  },
});
