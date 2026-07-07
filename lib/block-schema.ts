import { defaultBlockSchema } from "@blocknote/core";

import { CheckListItem } from "@/lib/blocks/checklist-block";
import { VotionBookmark } from "@/lib/blocks/votion-bookmark-block";
import { VotionCode } from "@/lib/blocks/votion-code-block";
import { VotionColumn } from "@/lib/blocks/votion-column-block";
import { VotionColumnList } from "@/lib/blocks/votion-column-list-block";
import { VotionDivider } from "@/lib/blocks/votion-divider-block";
import { VotionEmbed } from "@/lib/blocks/votion-embed-block";
import { VotionSmallText } from "@/lib/blocks/votion-small-text-block";
import { VotionTable } from "@/lib/blocks/votion-table-block";
import { VotionToggle } from "@/lib/blocks/votion-toggle-block";
import { VotionToc } from "@/lib/blocks/votion-toc-block";

export const votionBlockSchema = {
  ...defaultBlockSchema,
  checkListItem: CheckListItem,
  votionTable: VotionTable,
  votionColumnList: VotionColumnList,
  votionColumn: VotionColumn,
  votionDivider: VotionDivider,
  votionToggle: VotionToggle,
  votionCode: VotionCode,
  votionSmallText: VotionSmallText,
  votionEmbed: VotionEmbed,
  votionBookmark: VotionBookmark,
  votionToc: VotionToc,
} as const;

export type VotionBlockSchema = typeof votionBlockSchema;
