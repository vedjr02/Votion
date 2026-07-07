"use client";

import { useConvex } from "convex/react";
import {
  Download,
  FileArchive,
  FileCode2,
  FileDown,
  FileSpreadsheet,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { exportDocumentToPdf } from "@/lib/export-pdf";
import {
  downloadHtmlFile,
  exportDocumentToHtml,
} from "@/lib/export-html";
import {
  downloadMarkdownFile,
  exportDocumentToMarkdown,
} from "@/lib/export-markdown";
import { useImportPage } from "@/hooks/use-import-page";
import { downloadCsvFile, exportContentDatabasesToCsv } from "@/lib/import-csv";
import { buildPagePackageZip } from "@/lib/page-transfer";

interface PageMenuImportExportProps {
  document: Doc<"documents">;
}

export const PageMenuImportExport = ({ document }: PageMenuImportExportProps) => {
  const convex = useConvex();

  const onExportMarkdown = () => {
    const markdown = exportDocumentToMarkdown(document.title, document.content);
    downloadMarkdownFile(document.title, markdown);
    toast.success("Page exported as Markdown");
  };

  const onExportHtml = () => {
    const html = exportDocumentToHtml(document.title, document.content);
    downloadHtmlFile(document.title, html);
    toast.success("Page exported as HTML");
  };

  const onExportPdf = () => {
    try {
      exportDocumentToPdf(document.title, document.content);
      toast.success("PDF export opened — choose Save as PDF in the print dialog");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export PDF"
      );
    }
  };

  const onExportZip = async () => {
    try {
      await toast.promise(
        (async () => {
          const pages = await convex.query(api.documents.getExportTree, {
            documentId: document._id,
          });
          await buildPagePackageZip(pages, document.title);
        })(),
        {
          loading: "Exporting page and subpages...",
          success: "Page package exported",
          error: "Failed to export page package",
        }
      );
    } catch {
      return;
    }
  };

  const onExportCsv = () => {
    const databases = exportContentDatabasesToCsv(document.content);

    if (databases.length === 0) {
      toast.error("This page has no databases to export as CSV");
      return;
    }

    databases.forEach((entry, index) => {
      const baseName =
        databases.length === 1
          ? document.title
          : `${document.title}-database-${index + 1}`;
      downloadCsvFile(baseName, entry.csv);
    });

    toast.success(
      databases.length === 1
        ? "Database exported as CSV"
        : `${databases.length} databases exported as CSV`
    );
  };

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Download className="h-4 w-4 mr-2" />
          Export
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-56">
          <DropdownMenuItem onClick={onExportMarkdown}>
            <FileDown className="h-4 w-4 mr-2" />
            Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportHtml}>
            <FileCode2 className="h-4 w-4 mr-2" />
            HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPdf}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportZip}>
            <FileArchive className="h-4 w-4 mr-2" />
            Page + subpages (ZIP)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportCsv}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Databases (CSV)
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FileUp className="h-4 w-4 mr-2" />
          Import
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-56">
          <DropdownMenuItem
            onClick={() =>
              useImportPage.getState().onOpen(document._id, {
                defaultMode: "append",
              })
            }
          >
            Markdown or ZIP
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              useImportPage.getState().onOpen(document._id, {
                defaultMode: "append",
                defaultFormat: "csv",
              })
            }
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV (Notion database)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              useImportPage.getState().onOpen(document._id, {
                defaultMode: "new-page",
              })
            }
          >
            Import as subpage
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};
