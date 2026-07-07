"use client";

import { useConvex } from "convex/react";
import { FileArchive, FileUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useImportPage } from "@/hooks/use-import-page";
import { buildPagePackageZip } from "@/lib/page-transfer";

export const WorkspaceTransferActions = () => {
  const convex = useConvex();

  const onExportWorkspace = async () => {
    try {
      await toast.promise(
        (async () => {
          const pages = await convex.query(api.documents.getWorkspaceExport, {});
          await buildPagePackageZip(pages, "Votion workspace");
        })(),
        {
          loading: "Exporting workspace...",
          success: "Workspace exported as ZIP",
          error: "Failed to export workspace",
        }
      );
    } catch {
      return;
    }
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <h3 className="text-sm font-medium">Import & export</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Export all pages as a ZIP package, or import a Votion export or Notion CSV
          database exports back into your workspace.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onExportWorkspace}>
          <FileArchive className="h-4 w-4 mr-2" />
          Export all pages
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => useImportPage.getState().onOpenWorkspace()}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Import ZIP or CSV
        </Button>
      </div>
    </div>
  );
};
