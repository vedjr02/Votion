"use client";

import { useEffect, useState } from "react";
import { File, Link2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { usePageLinkPicker } from "@/hooks/use-page-link-picker";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { VotionBlockSchema } from "@/lib/block-schema";
import { BlockNoteEditor } from "@blocknote/core";
import { PLACEHOLDER_TITLE } from "@/lib/templates";

const buildPageLinkBlock = (document: {
  _id: Id<"documents">;
  title: string;
  icon?: string;
}) => ({
  type: "paragraph" as const,
  props: {
    textAlignment: "left" as const,
    backgroundColor: "default" as const,
    textColor: "default" as const,
  },
  content: [
    {
      type: "link" as const,
      href: `/documents/${document._id}`,
      content: [
        {
          type: "text" as const,
          text: document.icon
            ? `${document.icon} ${document.title}`
            : document.title,
          styles: {},
        },
      ],
    },
  ],
  children: [],
});

const insertPageLink = (
  editor: BlockNoteEditor<VotionBlockSchema>,
  document: {
    _id: Id<"documents">;
    title: string;
    icon?: string;
  }
) => {
  const currentBlock = editor.getTextCursorPosition().block;
  const pageLinkBlock = buildPageLinkBlock(document);

  const isSlashBlock =
    currentBlock.content !== undefined &&
    (currentBlock.content.length === 0 ||
      (currentBlock.content.length === 1 &&
        currentBlock.content[0].type === "text" &&
        currentBlock.content[0].text === "/"));

  if (isSlashBlock) {
    editor.updateBlock(currentBlock, pageLinkBlock);
  } else {
    editor.insertBlocks([pageLinkBlock], currentBlock, "after");
  }
};

export const PageLinkPicker = () => {
  const documents = useQuery(api.documents.getSearch);
  const create = useMutation(api.documents.create);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isOpen = usePageLinkPicker((store) => store.isOpen);
  const editor = usePageLinkPicker((store) => store.editor);
  const parentDocumentId = usePageLinkPicker((store) => store.parentDocumentId);
  const onClose = usePageLinkPicker((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelect = (document: {
    _id: Id<"documents">;
    title: string;
    icon?: string;
  }) => {
    if (!editor) return;
    insertPageLink(editor, document);
    onClose();
  };

  const handleCreateSubpage = async () => {
    if (!editor || isCreating) return;

    setIsCreating(true);

    try {
      const newDocumentId = await create({
        title: PLACEHOLDER_TITLE,
        parentDocument: parentDocumentId ?? undefined,
      });

      insertPageLink(editor, {
        _id: newDocumentId,
        title: PLACEHOLDER_TITLE,
      });
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Link to a page..." />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            value="create-new-subpage"
            onSelect={handleCreateSubpage}
            disabled={isCreating}
          >
            <Link2 className="mr-2 h-4 w-4" />
            {isCreating ? "Creating subpage..." : "Create new subpage"}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              onSelect={() => handleSelect(document)}
            >
              {document.icon ? (
                <span className="mr-2 text-[18px]">{document.icon}</span>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
