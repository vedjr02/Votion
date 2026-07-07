"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { FileUp, Upload } from "lucide-react";
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
import { Id } from "@/convex/_generated/dataModel";
import {
  ImportPageFormat,
  ImportPageMode,
  useImportPage,
} from "@/hooks/use-import-page";
import { csvToTableData, mergeImportedCsv, parseCsv, parseCsvImport } from "@/lib/import-csv";
import { mergeImportedMarkdown } from "@/lib/import-markdown";
import {
  parseMarkdownImport,
  parsePagePackageZip,
  readTextFile,
} from "@/lib/page-transfer";

export const ImportPageModal = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<ImportPageMode>("append");
  const [format, setFormat] = useState<ImportPageFormat>("auto");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{
    rows: number;
    columns: number;
    headers: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = useImportPage((store) => store.isOpen);
  const documentId = useImportPage((store) => store.documentId);
  const workspaceMode = useImportPage((store) => store.workspaceMode);
  const defaultMode = useImportPage((store) => store.defaultMode);
  const defaultFormat = useImportPage((store) => store.defaultFormat);
  const onClose = useImportPage((store) => store.onClose);

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : "skip"
  );
  const update = useMutation(api.documents.update);
  const importPages = useMutation(api.documents.importPages);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMarkdown("");
      setMode("append");
      setFormat("auto");
      setSelectedFile(null);
      setCsvPreview(null);
      return;
    }

    setMode(defaultMode);
    setFormat(defaultFormat);
  }, [defaultFormat, defaultMode, isOpen]);

  const resolvedFormat = useMemo((): ImportPageFormat => {
    if (format !== "auto") return format;
    if (selectedFile?.name.endsWith(".csv")) return "csv";
    if (selectedFile?.name.endsWith(".zip")) return "markdown";
    return "markdown";
  }, [format, selectedFile]);

  const isZipImport = selectedFile?.name.endsWith(".zip");
  const isCsvImport = resolvedFormat === "csv";

  const onPickFile = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setSelectedFile(file);

    if (file.name.endsWith(".csv")) {
      const text = await readTextFile(file);
      setMarkdown(text);
      const matrix = parseCsv(text);
      setCsvPreview({
        rows: Math.max(0, matrix.length - 1),
        columns: matrix[0]?.length ?? 0,
        headers: matrix[0]?.map((header) => header.trim()) ?? [],
      });
      setFormat("csv");
      return;
    }

    setCsvPreview(null);

    if (
      file.name.endsWith(".md") ||
      file.type.includes("markdown") ||
      (file.type.includes("text") && !file.name.endsWith(".csv"))
    ) {
      const text = await readTextFile(file);
      setMarkdown(text);
      setFormat("markdown");
    }
  };

  const importZip = async (file: File, parentDocument?: Id<"documents">) => {
    const parsed = await parsePagePackageZip(file);
    const result = await importPages({
      pages: parsed.pages,
      parentDocument,
      rootIndex: parsed.rootIndex,
    });

    onClose();
    router.push(workspaceMode ? "/documents" : `/documents/${result.rootId}`);
  };

  const onImport = async () => {
    try {
      if (workspaceMode) {
        if (!selectedFile) {
          toast.error("Choose a .zip or .csv file to import");
          return;
        }

        if (selectedFile.name.endsWith(".zip") || selectedFile.name.endsWith(".csv")) {
          if (selectedFile.name.endsWith(".csv")) {
            const csvText = await readTextFile(selectedFile);
            const parsed = parseCsvImport(csvText, selectedFile.name);
            const result = await importPages({
              pages: [
                {
                  title: parsed.title,
                  icon: parsed.icon,
                  content: parsed.content,
                },
              ],
              rootIndex: 0,
            });

            onClose();
            router.push(`/documents/${result.rootId}`);
            toast.success("CSV database imported");
            return;
          }

          await toast.promise(importZip(selectedFile), {
            loading: "Importing workspace pages...",
            success: "Workspace imported",
            error: "Failed to import workspace",
          });
          return;
        }

        toast.error("Workspace import supports .zip or .csv files");
        return;
      }

      if (!documentId) return;

      if (selectedFile?.name.endsWith(".zip")) {
        await toast.promise(importZip(selectedFile, documentId), {
          loading: "Importing page package...",
          success: "Pages imported",
          error: "Failed to import page package",
        });
        return;
      }

      const source = markdown.trim();
      if (!source) return;

      if (isCsvImport) {
        const databaseTitle =
          selectedFile?.name.replace(/\.csv$/i, "") ?? "Imported database";

        if (mode === "new-page") {
          const parsed = parseCsvImport(source, databaseTitle);
          const result = await importPages({
            pages: [
              {
                title: parsed.title,
                icon: parsed.icon,
                content: parsed.content,
              },
            ],
            parentDocument: documentId,
            rootIndex: 0,
          });

          onClose();
          router.push(`/documents/${result.rootId}`);
          toast.success("CSV imported as a new database page");
          return;
        }

        const nextContent = mergeImportedCsv(
          document?.content,
          source,
          mode === "replace" ? "replace" : "append",
          { databaseTitle }
        );

        await update({
          id: documentId,
          content: nextContent,
        });

        onClose();
        window.location.reload();
        toast.success("CSV database imported");
        return;
      }

      if (mode === "new-page") {
        const parsed = parseMarkdownImport(source, "Imported page");
        const result = await importPages({
          pages: [
            {
              title: parsed.title,
              content: parsed.content,
            },
          ],
          parentDocument: documentId,
          rootIndex: 0,
        });

        onClose();
        router.push(`/documents/${result.rootId}`);
        toast.success("Imported as a new subpage");
        return;
      }

      const nextContent = mergeImportedMarkdown(document?.content, source, mode);
      await update({
        id: documentId,
        content: nextContent,
      });

      onClose();
      window.location.reload();
      toast.success("Markdown imported");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
    }
  };

  if (!isMounted) {
    return null;
  }

  const canImport =
    isZipImport || isCsvImport
      ? Boolean(selectedFile || markdown.trim())
      : !workspaceMode && Boolean(markdown.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            {workspaceMode ? "Import workspace" : "Import"}
          </DialogTitle>
          <DialogDescription>
            {workspaceMode
              ? "Import a Votion ZIP export or Notion CSV exports (.csv). CSV files become fully editable databases with the right column types."
              : "Import Markdown, Notion CSV databases, or Votion ZIP packages. CSV imports map Status, Tags, Dates, Checkboxes, and Numbers automatically."}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,.csv,.zip,text/markdown,text/plain,text/csv,application/zip"
          className="hidden"
          onChange={onFileSelected}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onPickFile}>
            <Upload className="h-4 w-4 mr-2" />
            Choose file
          </Button>
          {selectedFile && (
            <span className="text-sm text-muted-foreground self-center">
              {selectedFile.name}
            </span>
          )}
        </div>

        {csvPreview && (
          <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
            <p className="font-medium">CSV preview</p>
            <p className="text-muted-foreground">
              {csvPreview.rows} rows · {csvPreview.columns} columns
            </p>
            <p className="text-muted-foreground truncate">
              {csvPreview.headers.slice(0, 6).join(" · ")}
              {csvPreview.headers.length > 6 ? " · …" : ""}
            </p>
            {csvPreview.rows > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Detected view:{" "}
                {(() => {
                  try {
                    return csvToTableData(markdown).view;
                  } catch {
                    return "table";
                  }
                })()}
              </p>
            )}
          </div>
        )}

        {!workspaceMode && !isZipImport && !isCsvImport && (
          <textarea
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            placeholder={"# Notes\n\n- Task one\n- Task two\n\n```\ncode here\n```"}
            className="min-h-[240px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}

        {!workspaceMode && !isZipImport && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "append" ? "default" : "outline"}
              onClick={() => setMode("append")}
            >
              {isCsvImport ? "Add database to page" : "Append to page"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "replace" ? "default" : "outline"}
              onClick={() => setMode("replace")}
            >
              Replace page
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "new-page" ? "default" : "outline"}
              onClick={() => setMode("new-page")}
            >
              {isCsvImport ? "New database page" : "Import as subpage"}
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onImport} disabled={!canImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
