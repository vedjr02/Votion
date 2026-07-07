import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

export type ImportPageMode = "append" | "replace" | "new-page";
export type ImportPageFormat = "auto" | "markdown" | "csv";

type ImportPageStore = {
  isOpen: boolean;
  documentId: Id<"documents"> | null;
  workspaceMode: boolean;
  defaultMode: ImportPageMode;
  defaultFormat: ImportPageFormat;
  onOpen: (
    documentId: Id<"documents">,
    options?: { defaultMode?: ImportPageMode; defaultFormat?: ImportPageFormat }
  ) => void;
  onOpenWorkspace: () => void;
  onClose: () => void;
};

export const useImportPage = create<ImportPageStore>((set) => ({
  isOpen: false,
  documentId: null,
  workspaceMode: false,
  defaultMode: "append",
  defaultFormat: "auto",
  onOpen: (documentId, options) =>
    set({
      isOpen: true,
      documentId,
      workspaceMode: false,
      defaultMode: options?.defaultMode ?? "append",
      defaultFormat: options?.defaultFormat ?? "auto",
    }),
  onOpenWorkspace: () =>
    set({
      isOpen: true,
      documentId: null,
      workspaceMode: true,
      defaultMode: "new-page",
      defaultFormat: "auto",
    }),
  onClose: () =>
    set({
      isOpen: false,
      documentId: null,
      workspaceMode: false,
      defaultMode: "append",
      defaultFormat: "auto",
    }),
}));

/** @deprecated Use useImportPage */
export const useImportMarkdown = useImportPage;
