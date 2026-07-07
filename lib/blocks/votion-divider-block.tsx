import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const VotionDivider = createReactBlockSpec({
  type: "votionDivider",
  propSchema: {
    ...defaultProps,
  },
  containsInlineContent: false,
  render: () => <hr className="votion-divider-block" contentEditable={false} />,
});
