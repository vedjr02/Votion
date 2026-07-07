import { defaultBlockSchema } from "@blocknote/core";

import { CheckListItem } from "@/lib/blocks/checklist-block";
import { VotionColumn } from "@/lib/blocks/votion-column-block";
import { VotionColumnList } from "@/lib/blocks/votion-column-list-block";
import { VotionDivider } from "@/lib/blocks/votion-divider-block";
import { VotionTable } from "@/lib/blocks/votion-table-block";

export const votionBlockSchema = {
  ...defaultBlockSchema,
  checkListItem: CheckListItem,
  votionTable: VotionTable,
  votionColumnList: VotionColumnList,
  votionColumn: VotionColumn,
  votionDivider: VotionDivider,
} as const;

export type VotionBlockSchema = typeof votionBlockSchema;
