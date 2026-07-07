"use client";

import {
  Lock,
  Maximize2,
  Minimize2,
  Type,
  Unlock,
  History,
} from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageMenuImportExport } from "@/components/page-menu-import-export";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useVersionHistory } from "@/hooks/use-version-history";

interface PageMenuExtendedItemsProps {
  document: Doc<"documents">;
}

export const PageMenuExtendedItems = ({ document }: PageMenuExtendedItemsProps) => {
  const update = useMutation(api.documents.update);

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

  return (
    <>
      <PageMenuImportExport document={document} />
      <DropdownMenuItem onClick={() => useVersionHistory.getState().onOpen(document._id)}>
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
    </>
  );
};
