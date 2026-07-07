"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Download,
  FileUp,
  History,
  Link2,
  Lock,
  FolderInput,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Star,
  Trash,
  Unlock,
  Files,
  Type,
} from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrigin } from "@/hooks/use-origin";
import {
  downloadMarkdownFile,
  exportDocumentToMarkdown,
} from "@/lib/export-markdown";
import { useImportMarkdown } from "@/hooks/use-import-markdown";
import { useMoveToPicker } from "@/hooks/use-move-to-picker";
import { useVersionHistory } from "@/hooks/use-version-history";

interface MenuProps {
  document: Doc<"documents">;
}

export const Menu = ({ document }: MenuProps) => {
  const router = useRouter();
  const origin = useOrigin();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);
  const update = useMutation(api.documents.update);
  const duplicate = useMutation(api.documents.duplicate);

  const pageUrl = `${origin}/documents/${document._id}`;

  const onArchive = () => {
    const promise = archive({ id: document._id }).then(() => {
      router.push("/documents");
    });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Page moved to trash!",
      error: "Failed to delete page.",
    });
  };

  const onDuplicate = () => {
    const promise = duplicate({ id: document._id }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Duplicating page...",
      success: "Page duplicated!",
      error: "Failed to duplicate page.",
    });
  };

  const onToggleFavorite = () => {
    const promise = update({
      id: document._id,
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

  const onToggleLock = () => {
    const promise = update({
      id: document._id,
      isLocked: !document.isLocked,
    });

    toast.promise(promise, {
      loading: "Updating lock...",
      success: document.isLocked ? "Page unlocked" : "Page locked",
      error: "Failed to update lock.",
    });
  };

  const onToggleFullWidth = () => {
    const promise = update({
      id: document._id,
      isFullWidth: !document.isFullWidth,
    });

    toast.promise(promise, {
      loading: "Updating layout...",
      success: document.isFullWidth
        ? "Switched to default width"
        : "Switched to full width",
      error: "Failed to update layout.",
    });
  };

  const onToggleSmallText = () => {
    const promise = update({
      id: document._id,
      isSmallText: !document.isSmallText,
    });

    toast.promise(promise, {
      loading: "Updating typography...",
      success: document.isSmallText
        ? "Switched to default text size"
        : "Switched to small text",
      error: "Failed to update typography.",
    });
  };

  const onMoveToRoot = () => {
    const promise = update({
      id: document._id,
      parentDocument: null,
    });

    toast.promise(promise, {
      loading: "Moving page...",
      success: "Moved to top level",
      error: "Failed to move page.",
    });
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied to clipboard");
  };

  const onExportMarkdown = () => {
    const markdown = exportDocumentToMarkdown(document.title, document.content);
    downloadMarkdownFile(document.title, markdown);
    toast.success("Page exported as Markdown");
  };

  const onOpenVersionHistory = () => {
    useVersionHistory.getState().onOpen(document._id);
  };

  const onOpenMoveTo = () => {
    useMoveToPicker.getState().onOpen(document._id);
  };

  const onOpenImportMarkdown = () => {
    useImportMarkdown.getState().onOpen(document._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onToggleFavorite}>
          <Star className="h-4 w-4 mr-2" />
          {document.isFavorite ? "Remove from favorites" : "Add to favorites"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Files className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportMarkdown}>
          <Download className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenImportMarkdown}>
          <FileUp className="h-4 w-4 mr-2" />
          Import Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenVersionHistory}>
          <History className="h-4 w-4 mr-2" />
          Page history
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onToggleFullWidth}>
          {document.isFullWidth ? (
            <Minimize2 className="h-4 w-4 mr-2" />
          ) : (
            <Maximize2 className="h-4 w-4 mr-2" />
          )}
          {document.isFullWidth ? "Default width" : "Full width"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleSmallText}>
          <Type className="h-4 w-4 mr-2" />
          {document.isSmallText ? "Default text size" : "Small text"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleLock}>
          {document.isLocked ? (
            <Unlock className="h-4 w-4 mr-2" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          {document.isLocked ? "Unlock page" : "Lock page"}
        </DropdownMenuItem>
        {document.parentDocument && (
          <DropdownMenuItem onClick={onMoveToRoot}>
            <Copy className="h-4 w-4 mr-2" />
            Move to top level
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onOpenMoveTo}>
          <FolderInput className="h-4 w-4 mr-2" />
          Move to...
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Move to trash
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2 space-y-1">
          <p>Last edited by: {user?.fullName}</p>
          {document.isLocked && (
            <p className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Locked
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
