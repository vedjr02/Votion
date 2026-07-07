import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type PageActionsStore = {
  renameDocumentId: Id<"documents"> | null;
  sidePeekDocumentId: Id<"documents"> | null;
  requestRename: (documentId: Id<"documents">) => void;
  clearRename: () => void;
  openSidePeek: (documentId: Id<"documents">) => void;
  closeSidePeek: () => void;
};

export const usePageActions = create<PageActionsStore>((set) => ({
  renameDocumentId: null,
  sidePeekDocumentId: null,
  requestRename: (documentId) => set({ renameDocumentId: documentId }),
  clearRename: () => set({ renameDocumentId: null }),
  openSidePeek: (documentId) => set({ sidePeekDocumentId: documentId }),
  closeSidePeek: () => set({ sidePeekDocumentId: null }),
}));
