"use client";

import { useEffect, useMemo, useState } from "react";
import { File, Home } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMoveToPicker } from "@/hooks/use-move-to-picker";

const buildParentMap = (
  documents: { _id: Id<"documents">; parentDocument?: Id<"documents"> }[]
) =>
  new Map(documents.map((document) => [document._id, document.parentDocument]));

const isInvalidMoveTarget = (
  documentId: Id<"documents">,
  targetId: Id<"documents"> | null,
  parentMap: Map<Id<"documents">, Id<"documents"> | undefined>
) => {
  if (targetId === documentId) return true;

  let current: Id<"documents"> | null | undefined = targetId;

  while (current) {
    if (current === documentId) return true;
    current = parentMap.get(current) ?? null;
  }

  return false;
};

export const MoveToPicker = () => {
  const documents = useQuery(api.documents.getSearch);
  const update = useMutation(api.documents.update);
  const [isMounted, setIsMounted] = useState(false);

  const isOpen = useMoveToPicker((store) => store.isOpen);
  const documentId = useMoveToPicker((store) => store.documentId);
  const onClose = useMoveToPicker((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const parentMap = useMemo(
    () => (documents ? buildParentMap(documents) : new Map()),
    [documents]
  );

  const moveTo = (parentDocument: Id<"documents"> | null) => {
    if (!documentId) return;

    const promise = update({
      id: documentId,
      parentDocument,
    }).then(() => onClose());

    toast.promise(promise, {
      loading: "Moving page...",
      success: "Page moved",
      error: "Failed to move page",
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Move page to..." />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        <CommandGroup heading="Locations">
          <CommandItem value="workspace-root" onSelect={() => moveTo(null)}>
            <Home className="mr-2 h-4 w-4" />
            Top level
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Pages">
          {documents
            ?.filter(
              (document) =>
                documentId &&
                !isInvalidMoveTarget(documentId, document._id, parentMap)
            )
            .map((document) => (
              <CommandItem
                key={document._id}
                value={`${document._id}-${document.title}`}
                onSelect={() => moveTo(document._id)}
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
