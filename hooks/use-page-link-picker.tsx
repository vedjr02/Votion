import { BlockNoteEditor } from "@blocknote/core";
import { create } from "zustand";

import { Id } from "@/convex/_generated/dataModel";
import { VotionBlockSchema } from "@/lib/block-schema";

type PageLinkPickerStore = {
  isOpen: boolean;
  editor: BlockNoteEditor<VotionBlockSchema> | null;
  parentDocumentId: Id<"documents"> | null;
  onOpen: (editor: BlockNoteEditor<VotionBlockSchema>) => void;
  onClose: () => void;
  setParentDocumentId: (documentId: Id<"documents"> | null) => void;
};

export const usePageLinkPicker = create<PageLinkPickerStore>((set) => ({
  isOpen: false,
  editor: null,
  parentDocumentId: null,
  onOpen: (editor) => set({ isOpen: true, editor }),
  onClose: () => set({ isOpen: false, editor: null }),
  setParentDocumentId: (documentId) => set({ parentDocumentId: documentId }),
}));
