import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type ImportMarkdownStore = {
  isOpen: boolean;
  documentId: Id<"documents"> | null;
  onOpen: (documentId: Id<"documents">) => void;
  onClose: () => void;
};

export const useImportMarkdown = create<ImportMarkdownStore>((set) => ({
  isOpen: false,
  documentId: null,
  onOpen: (documentId) => set({ isOpen: true, documentId }),
  onClose: () => set({ isOpen: false, documentId: null }),
}));
