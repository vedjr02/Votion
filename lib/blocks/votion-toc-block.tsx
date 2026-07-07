import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { useEffect, useReducer } from "react";

import { collectHeadings } from "@/lib/toc-utils";

type EditorWithNavigation = {
  topLevelBlocks: unknown[];
  onEditorContentChange: (callback: () => void) => void;
  getBlock: (id: string) => unknown;
  setTextCursorPosition: (block: unknown, placement?: "start" | "end") => void;
  focus: () => void;
};

const VotionTocView = ({ editor }: { editor: EditorWithNavigation }) => {
  const [, refresh] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    return editor.onEditorContentChange(() => refresh());
  }, [editor]);

  const headings = collectHeadings(editor.topLevelBlocks as Parameters<typeof collectHeadings>[0]);

  const scrollToHeading = (id: string) => {
    const block = editor.getBlock(id);
    if (!block) return;

    editor.setTextCursorPosition(block, "start");
    editor.focus();
  };

  return (
    <nav className="votion-toc" contentEditable={false}>
      <p className="votion-toc-label">Table of contents</p>
      {headings.length === 0 ? (
        <p className="votion-toc-empty">
          Add headings to this page to build an outline.
        </p>
      ) : (
        <ul className="votion-toc-list">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className="votion-toc-item"
              data-level={heading.level}
            >
              <button
                type="button"
                className="votion-toc-link"
                onClick={() => scrollToHeading(heading.id)}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export const VotionToc = createReactBlockSpec({
  type: "votionToc",
  propSchema: {
    ...defaultProps,
  },
  containsInlineContent: false,
  render: ({ editor }) => <VotionTocView editor={editor as EditorWithNavigation} />,
});

export const emptyTocBlock = () => ({
  type: "votionToc" as const,
  props: {
    textAlignment: "left" as const,
    backgroundColor: "default" as const,
    textColor: "default" as const,
  },
  children: [],
});
