"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { Lock } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Backlinks } from "@/components/backlinks";
import { PageComments } from "@/components/page-comments";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLinkPicker } from "@/hooks/use-page-link-picker";
import { cn } from "@/lib/utils";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);
  const touchRecent = useMutation(api.documents.touchRecent);

  useEffect(() => {
    usePageLinkPicker.getState().setParentDocumentId(params.documentId);
  }, [params.documentId]);

  useEffect(() => {
    touchRecent({ id: params.documentId }).catch(() => undefined);
  }, [params.documentId, touchRecent]);

  const onChange = (content: string) => {
    if (document?.isLocked) return;

    update({
      id: params.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <Breadcrumbs document={document} />
      {document.isLocked && (
        <div className="mx-12 mt-3 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border rounded-md px-3 py-2 max-w-fit">
          <Lock className="h-4 w-4" />
          This page is locked. Unlock it from the menu to edit.
        </div>
      )}
      <div
        className={cn(
          "mx-auto",
          document.isFullWidth
            ? "max-w-[1100px] px-8"
            : "md:max-w-3xl lg:max-w-4xl"
        )}
      >
        <Toolbar initialData={document} />
        <div className={cn(document.isSmallText && "votion-page-small-text")}>
          <Editor
            onChange={onChange}
            initialContent={document.content}
            editable={!document.isLocked}
          />
        </div>
        <Backlinks documentId={params.documentId} />
        <PageComments documentId={params.documentId} isLocked={document.isLocked} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
