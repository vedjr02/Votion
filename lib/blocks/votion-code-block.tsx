import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, InlineContent } from "@blocknote/react";

export const VotionCode = createReactBlockSpec({
  type: "votionCode",
  propSchema: {
    ...defaultProps,
    language: {
      default: "plain",
    },
  },
  containsInlineContent: true,
  render: () => (
    <pre className="votion-code-block">
      <code>
        <InlineContent />
      </code>
    </pre>
  ),
});
