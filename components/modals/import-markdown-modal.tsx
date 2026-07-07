"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useImportMarkdown } from "@/hooks/use-import-markdown";
import { mergeImportedMarkdown } from "@/lib/import-markdown";

export const ImportMarkdownModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<"replace" | "append">("append");

  const isOpen = useImportMarkdown((store) => store.isOpen);
  const documentId = useImportMarkdown((store) => store.documentId);
  const onClose = useImportMarkdown((store) => store.onClose);

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : "skip"
  );
  const update = useMutation(api.documents.update);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMarkdown("");
      setMode("append");
    }
  }, [isOpen]);

  const onImport = () => {
    if (!documentId || !markdown.trim()) return;

    const nextContent = mergeImportedMarkdown(
      document?.content,
      markdown,
      mode
    );

    const promise = update({
      id: documentId,
      content: nextContent,
    }).then(() => {
      onClose();
      window.location.reload();
    });

    toast.promise(promise, {
      loading: "Importing markdown...",
      success: "Markdown imported",
      error: "Failed to import markdown",
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import Markdown
          </DialogTitle>
          <DialogDescription>
            Paste Markdown to convert it into Votion blocks. Supports headings, lists, quotes, code, and dividers.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder={"# Notes\n\n- Task one\n- Task two\n\n```\ncode here\n```"}
          className="min-h-[240px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "append" ? "default" : "outline"}
            onClick={() => setMode("append")}
          >
            Append to page
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "replace" ? "default" : "outline"}
            onClick={() => setMode("replace")}
          >
            Replace page
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onImport} disabled={!markdown.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
