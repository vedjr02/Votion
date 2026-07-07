"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePageLinkPicker } from "@/hooks/use-page-link-picker";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const PageLinkPicker = () => {
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const isOpen = usePageLinkPicker((store) => store.isOpen);
  const editor = usePageLinkPicker((store) => store.editor);
  const onClose = usePageLinkPicker((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const insertPageLink = (document: {
    _id: Id<"documents">;
    title: string;
    icon?: string;
  }) => {
    if (!editor) return;

    const currentBlock = editor.getTextCursorPosition().block;
    const pageLinkBlock = {
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
    };

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

    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Link to a page..." />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              onSelect={() => insertPageLink(document)}
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
