"use client";

import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { votionBlockSchema } from "@/lib/block-schema";
import { getVotionSlashMenuItems } from "@/lib/slash-menu-items";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const parseInitialContent = (initialContent?: string): PartialBlock[] | undefined => {
  if (!initialContent) return undefined;

  try {
    const parsed = JSON.parse(initialContent) as PartialBlock[];
    if (!Array.isArray(parsed)) return undefined;

    return parsed.map((block) => ({
      ...block,
      children: block.children ?? [],
    }));
  } catch {
    return undefined;
  }
};

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const editor = useBlockNote(
    {
      blockSchema: votionBlockSchema,
      editable,
      initialContent: parseInitialContent(initialContent),
      slashMenuItems: getVotionSlashMenuItems(),
      onEditorContentChange: (editor) => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
      },
      uploadFile: handleUpload,
    },
    [editable]
  );

  return (
    <div className="votion-editor">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
