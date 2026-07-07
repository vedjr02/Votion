"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { usePageActions } from "@/hooks/use-page-actions";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const SidePeekPanel = () => {
  const documentId = usePageActions((store) => store.sidePeekDocumentId);
  const closeSidePeek = usePageActions((store) => store.closeSidePeek);
  const update = useMutation(api.documents.update);

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : "skip"
  );

  const editorKey = useMemo(
    () => (documentId ? `${documentId}-${document?.updatedAt ?? 0}` : "closed"),
    [document?.updatedAt, documentId]
  );

  if (!documentId) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 z-[99990] h-full w-[min(480px,42vw)] border-l bg-background shadow-2xl",
        "flex flex-col"
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="min-w-0">
          {document === undefined ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            <p className="truncate text-sm font-medium">
              {document?.icon ? `${document.icon} ` : ""}
              {document?.title ?? "Untitled"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button asChild size="icon" variant="ghost" className="h-8 w-8">
            <Link href={`/documents/${documentId}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={closeSidePeek}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {document === undefined && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {document && (
          <div className={cn(document.isSmallText && "votion-page-small-text")}>
            <Editor
              key={editorKey}
              initialContent={document.content}
              editable={!document.isLocked}
              onChange={(content) => {
                if (document.isLocked) return;
                update({ id: documentId, content });
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
