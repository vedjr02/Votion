import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    isFavorite: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
    isFullWidth: v.optional(v.boolean()),
    isSmallText: v.optional(v.boolean()),
    isHiddenFromRecent: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  documentVersions: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_document", ["documentId", "createdAt"]),
  comments: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    userName: v.string(),
    userImageUrl: v.optional(v.string()),
    body: v.string(),
    createdAt: v.number(),
    isResolved: v.optional(v.boolean()),
  }).index("by_document", ["documentId", "createdAt"]),
});
