import { defaultBlockSchema } from "@blocknote/core";

import { CheckListItem } from "@/lib/blocks/checklist-block";
import { NotionColumns } from "@/lib/blocks/notion-columns-block";
import { NotionDatabase } from "@/lib/blocks/notion-database-block";
import { NotionGallery } from "@/lib/blocks/notion-gallery-block";

export const votionBlockSchema = {
  ...defaultBlockSchema,
  checkListItem: CheckListItem,
  notionDatabase: NotionDatabase,
  notionGallery: NotionGallery,
  notionColumns: NotionColumns,
} as const;

export type VotionBlockSchema = typeof votionBlockSchema;
