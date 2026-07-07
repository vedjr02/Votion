import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const VotionColumnList = createReactBlockSpec({
  type: "votionColumnList",
  propSchema: {
    ...defaultProps,
  },
  containsInlineContent: false,
  render: () => <div className="votion-column-list-shell" aria-hidden />,
});
