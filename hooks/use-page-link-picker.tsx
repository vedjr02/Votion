import { BlockNoteEditor } from "@blocknote/core";
import { create } from "zustand";

import { VotionBlockSchema } from "@/lib/block-schema";

type PageLinkPickerStore = {
  isOpen: boolean;
  editor: BlockNoteEditor<VotionBlockSchema> | null;
  onOpen: (editor: BlockNoteEditor<VotionBlockSchema>) => void;
  onClose: () => void;
};

export const usePageLinkPicker = create<PageLinkPickerStore>((set) => ({
  isOpen: false,
  editor: null,
  onOpen: (editor) => set({ isOpen: true, editor }),
  onClose: () => set({ isOpen: false, editor: null }),
}));
