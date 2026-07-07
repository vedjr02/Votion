import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type MoveToPickerStore = {
  isOpen: boolean;
  documentId: Id<"documents"> | null;
  onOpen: (documentId: Id<"documents">) => void;
  onClose: () => void;
};

export const useMoveToPicker = create<MoveToPickerStore>((set) => ({
  isOpen: false,
  documentId: null,
  onOpen: (documentId) => set({ isOpen: true, documentId }),
  onClose: () => set({ isOpen: false, documentId: null }),
}));
