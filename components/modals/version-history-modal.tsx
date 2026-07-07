"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useVersionHistory } from "@/hooks/use-version-history";

const formatVersionDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const VersionHistoryModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = useVersionHistory((store) => store.isOpen);
  const documentId = useVersionHistory((store) => store.documentId);
  const onClose = useVersionHistory((store) => store.onClose);

  const versions = useQuery(
    api.documents.getVersions,
    documentId ? { documentId } : "skip"
  );
  const restoreVersion = useMutation(api.documents.restoreVersion);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onRestore = (versionId: Id<"documentVersions">) => {
    const promise = restoreVersion({ versionId }).then(() => {
      onClose();
      window.location.reload();
    });

    toast.promise(promise, {
      loading: "Restoring version...",
      success: "Page restored to selected version",
      error: "Failed to restore version",
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Page history
          </DialogTitle>
          <DialogDescription>
            Restore a previous version of this page. Votion keeps your last 20 edits.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[360px] overflow-y-auto space-y-2">
          {versions === undefined && (
            <p className="text-sm text-muted-foreground">Loading versions...</p>
          )}
          {versions?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No previous versions yet. Keep editing and versions will appear here.
            </p>
          )}
          {versions?.map((version, index) => (
            <div
              key={version._id}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {index === 0 ? "Latest saved version" : `Version ${versions.length - index}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatVersionDate(version.createdAt)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRestore(version._id)}
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Restore
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
