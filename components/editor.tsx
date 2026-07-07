"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { votionBlockSchema, VotionBlockSchema } from "@/lib/block-schema";
import { emptyBlock } from "@/lib/editor-blocks";
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

const blockHasText = (block: { content?: unknown }) => {
  if (!Array.isArray(block.content) || block.content.length === 0) {
    return false;
  }

  return block.content.some(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "text" in item &&
      typeof item.text === "string" &&
      item.text.length > 0
  );
};

const handleCheckListEnter = (editor: BlockNoteEditor<VotionBlockSchema>) => {
  const cursor = editor.getTextCursorPosition();
  if (cursor.block.type !== "checkListItem") {
    return false;
  }

  const currentBlock = cursor.block;

  if (!blockHasText(currentBlock)) {
    editor.insertBlocks(
      [emptyBlock("checkListItem", { checked: false })],
      currentBlock,
      "after"
    );
  } else {
    editor.insertBlocks(
      [emptyBlock("checkListItem", { checked: false })],
      currentBlock,
      "after"
    );
  }

  const nextBlock = editor.getTextCursorPosition().nextBlock;
  if (nextBlock) {
    editor.setTextCursorPosition(nextBlock, "start");
  }

  return true;
};

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const router = useRouter();

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

  useEffect(() => {
    if (!editable) return;

    const view = editor._tiptapEditor.view;
    const dom = view.dom;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;

      const handled = handleCheckListEnter(
        editor as BlockNoteEditor<VotionBlockSchema>
      );
      if (handled) {
        event.preventDefault();
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor?.href) return;

      try {
        const url = new URL(anchor.href);
        if (!url.pathname.startsWith("/documents/")) return;

        event.preventDefault();
        router.push(`${url.pathname}${url.search}${url.hash}`);
      } catch {
        return;
      }
    };

    dom.addEventListener("keydown", onKeyDown);
    dom.addEventListener("click", onClick);

    return () => {
      dom.removeEventListener("keydown", onKeyDown);
      dom.removeEventListener("click", onClick);
    };
  }, [editor, editable, router]);

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
