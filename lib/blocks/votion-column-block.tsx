import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const VotionColumn = createReactBlockSpec({
  type: "votionColumn",
  propSchema: {
    ...defaultProps,
  },
  containsInlineContent: false,
  render: () => <div className="votion-column-shell" />,
});
