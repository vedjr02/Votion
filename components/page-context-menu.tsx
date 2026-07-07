"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  EyeOff,
  Files,
  Link2,
  PanelRightOpen,
  Pencil,
  RefreshCw,
  Star,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageMenuExtendedItems } from "@/components/page-menu-extended-items";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMoveToPicker } from "@/hooks/use-move-to-picker";
import { useOrigin } from "@/hooks/use-origin";
import { usePageActions } from "@/hooks/use-page-actions";
import { formatPageTimestamp } from "@/lib/page-stats";

type PageContextMenuDocument = Pick<
  Doc<"documents">,
  | "_id"
  | "title"
  | "isFavorite"
  | "isHiddenFromRecent"
  | "isPublished"
  | "updatedAt"
  | "_creationTime"
>;

interface PageContextMenuProps {
  documentId: Id<"documents">;
  document?: PageContextMenuDocument | null;
  trigger: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  onArchived?: () => void;
  extraContent?: ReactNode;
  includeExtendedItems?: boolean;
}

export const PageContextMenu = ({
  documentId,
  document: documentProp,
  trigger,
  align = "start",
  side = "right",
  onArchived,
  extraContent,
  includeExtendedItems,
}: PageContextMenuProps) => {
  const router = useRouter();
  const origin = useOrigin();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const fetchedDocument = useQuery(
    api.documents.getById,
    open && !documentProp ? { documentId } : "skip"
  );

  const document = documentProp ?? fetchedDocument;

  const archive = useMutation(api.documents.archive);
  const update = useMutation(api.documents.update);
  const duplicate = useMutation(api.documents.duplicate);

  const pageUrl = `${origin}/documents/${documentId}`;

  const onCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied to clipboard");
  };

  const onToggleFavorite = () => {
    if (!document) return;

    const promise = update({
      id: documentId,
      isFavorite: !document.isFavorite,
    });

    toast.promise(promise, {
      loading: "Updating favorite...",
      success: document.isFavorite
        ? "Removed from favorites"
        : "Added to favorites",
      error: "Failed to update favorite.",
    });
  };

  const onRemoveFromRecents = () => {
    const promise = update({
      id: documentId,
      isHiddenFromRecent: true,
    });

    toast.promise(promise, {
      loading: "Updating recents...",
      success: "Removed from Recents",
      error: "Failed to update recents.",
    });
  };

  const onDuplicate = () => {
    const promise = duplicate({ id: documentId }).then((newDocumentId) => {
      router.push(`/documents/${newDocumentId}`);
    });

    toast.promise(promise, {
      loading: "Duplicating page...",
      success: "Page duplicated!",
      error: "Failed to duplicate page.",
    });
  };

  const onRename = () => {
    usePageActions.getState().requestRename(documentId);
    router.push(`/documents/${documentId}`);
    setOpen(false);
  };

  const onMoveTo = () => {
    useMoveToPicker.getState().onOpen(documentId);
    setOpen(false);
  };

  const onArchive = () => {
    const promise = archive({ id: documentId }).then(() => {
      onArchived?.();
    });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Moved to trash",
      error: "Failed to move page to trash.",
    });
  };

  const onTurnIntoWiki = () => {
    const promise = update({
      id: documentId,
      isPublished: true,
    }).then(() => {
      toast.success("Page published as a wiki", {
        description: "Anyone with the link can view this page.",
        action: {
          label: "Open preview",
          onClick: () => window.open(`${origin}/preview/${documentId}`, "_blank"),
        },
      });
    });

    toast.promise(promise, {
      loading: "Publishing page...",
      error: "Failed to publish page.",
    });
  };

  const onOpenInNewTab = () => {
    window.open(pageUrl, "_blank", "noopener,noreferrer");
  };

  const onOpenInSidePeek = () => {
    usePageActions.getState().openSidePeek(documentId);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72"
        align={align}
        side={side}
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Page
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={onToggleFavorite} disabled={!document}>
          <Star className="h-4 w-4 mr-2" />
          {document?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRemoveFromRecents}>
          <EyeOff className="h-4 w-4 mr-2" />
          Remove from Recents
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Files className="h-4 w-4 mr-2" />
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
          <Pencil className="h-4 w-4 mr-2" />
          Rename
          <DropdownMenuShortcut>⌘⇧R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMoveTo}>
          <ArrowRight className="h-4 w-4 mr-2" />
          Move to
          <DropdownMenuShortcut>⌘⇧P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Move to Trash
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onTurnIntoWiki}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Turn into wiki
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onOpenInNewTab}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in new tab
          <DropdownMenuShortcut>⌘⇧↩</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenInSidePeek}>
          <PanelRightOpen className="h-4 w-4 mr-2" />
          Open in side peek
          <DropdownMenuShortcut>⌥Click</DropdownMenuShortcut>
        </DropdownMenuItem>

        {extraContent}

        {includeExtendedItems && document && (
          <>
            <DropdownMenuSeparator />
            <PageMenuExtendedItems document={document as Doc<"documents">} />
          </>
        )}

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-0.5">
          <p>Last edited by {user?.fullName ?? "You"}</p>
          {document && (
            <p>
              {formatPageTimestamp(document.updatedAt ?? document._creationTime)}
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
