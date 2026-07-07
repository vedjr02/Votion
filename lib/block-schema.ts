import { defaultBlockSchema } from "@blocknote/core";

import { CheckListItem } from "@/lib/blocks/checklist-block";

export const votionBlockSchema = {
  ...defaultBlockSchema,
  checkListItem: CheckListItem,
} as const;

export type VotionBlockSchema = typeof votionBlockSchema;
