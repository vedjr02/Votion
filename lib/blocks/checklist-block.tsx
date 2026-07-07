import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, InlineContent } from "@blocknote/react";

export const CheckListItem = createReactBlockSpec({
  type: "checkListItem",
  propSchema: {
    ...defaultProps,
    checked: {
      default: false,
      values: [true, false],
    },
  },
  containsInlineContent: true,
  render: ({ block, editor }) => (
    <div className="votion-checklist-item flex w-full items-start gap-2">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary"
        checked={block.props.checked}
        disabled={!editor.isEditable}
        contentEditable={false}
        onChange={() => {
          (
            editor as unknown as {
              updateBlock: (b: unknown, u: unknown) => void;
            }
          ).updateBlock(block, {
            props: { checked: !block.props.checked },
          });
        }}
      />
      <div
        className={
          block.props.checked ? "flex-1 opacity-60 line-through" : "flex-1"
        }
      >
        <InlineContent />
      </div>
    </div>
  ),
});
