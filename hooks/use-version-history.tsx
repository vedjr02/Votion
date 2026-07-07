import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type VersionHistoryStore = {
  isOpen: boolean;
  documentId: Id<"documents"> | null;
  onOpen: (documentId: Id<"documents">) => void;
  onClose: () => void;
};

export const useVersionHistory = create<VersionHistoryStore>((set) => ({
  isOpen: false,
  documentId: null,
  onOpen: (documentId) => set({ isOpen: true, documentId }),
  onClose: () => set({ isOpen: false, documentId: null }),
}));
