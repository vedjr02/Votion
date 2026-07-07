"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PLACEHOLDER_TITLE } from "@/lib/templates";
import { useMoveToPicker } from "@/hooks/use-move-to-picker";
import { usePageActions } from "@/hooks/use-page-actions";

export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const params = useParams();
  const create = useMutation(api.documents.create);
  const duplicate = useMutation(api.documents.duplicate);

  const documentId = params.documentId as Id<"documents"> | undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isMeta && event.key.toLowerCase() === "k" && event.shiftKey) {
        event.preventDefault();
        router.push("/templates");
        return;
      }

      if (isMeta && event.key.toLowerCase() === "n") {
        event.preventDefault();
        const promise = create({ title: PLACEHOLDER_TITLE }).then((newDocumentId) =>
          router.push(`/documents/${newDocumentId}`)
        );

        toast.promise(promise, {
          loading: "Creating a new page...",
          success: "New page created!",
          error: "Failed to create page.",
        });
        return;
      }

      if (isMeta && event.key.toLowerCase() === "p" && !event.shiftKey) {
        event.preventDefault();
        window.print();
        return;
      }

      if (!documentId || isTyping) {
        return;
      }

      if (isMeta && event.key.toLowerCase() === "d") {
        event.preventDefault();
        const promise = duplicate({ id: documentId }).then((newDocumentId) => {
          router.push(`/documents/${newDocumentId}`);
        });

        toast.promise(promise, {
          loading: "Duplicating page...",
          success: "Page duplicated!",
          error: "Failed to duplicate page.",
        });
        return;
      }

      if (isMeta && event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        usePageActions.getState().requestRename(documentId);
        return;
      }

      if (isMeta && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        useMoveToPicker.getState().onOpen(documentId);
        return;
      }

      if (isMeta && event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        window.open(
          `${window.location.origin}/documents/${documentId}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [create, duplicate, documentId, router]);
};
