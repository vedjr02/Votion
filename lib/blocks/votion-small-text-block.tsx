import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, InlineContent } from "@blocknote/react";

export const VotionSmallText = createReactBlockSpec({
  type: "votionSmallText",
  propSchema: {
    ...defaultProps,
  },
  containsInlineContent: true,
  render: () => (
    <div className="votion-small-text">
      <InlineContent />
    </div>
  ),
});
