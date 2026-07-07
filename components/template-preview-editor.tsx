"use client";

import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { votionBlockSchema, VotionBlockSchema } from "@/lib/block-schema";

interface TemplatePreviewEditorProps {
  content: PartialBlock<VotionBlockSchema>[];
}

export const TemplatePreviewEditor = ({
  content,
}: TemplatePreviewEditorProps) => {
  const { resolvedTheme } = useTheme();

  const editor = useBlockNote({
    blockSchema: votionBlockSchema,
    editable: false,
    initialContent: content,
  });

  return (
    <div className="votion-editor votion-template-preview pointer-events-none select-none">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};
