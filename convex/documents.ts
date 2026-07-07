import { v } from "convex/values";

import { mutation, query, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

const MAX_VERSIONS = 20;

const getSortValue = (document: Doc<"documents">) =>
  document.sortOrder ?? document._creationTime;

const sortDocuments = (documents: Doc<"documents">[]) =>
  [...documents].sort((a, b) => getSortValue(b) - getSortValue(a));

const isDescendant = async (
  ctx: { db: { get: (id: Id<"documents">) => Promise<Doc<"documents"> | null> } },
  ancestorId: Id<"documents">,
  candidateId: Id<"documents">
): Promise<boolean> => {
  let current: Doc<"documents"> | null = await ctx.db.get(candidateId);

  while (current) {
    if (current._id === ancestorId) {
      return true;
    }

    if (!current.parentDocument) {
      break;
    }

    current = await ctx.db.get(current.parentDocument);
  }

  return false;
};

const saveDocumentVersion = async (
  ctx: MutationCtx,
  document: Doc<"documents">,
  content: string
) => {
  await ctx.db.insert("documentVersions", {
    documentId: document._id,
    userId: document.userId,
    title: document.title,
    content,
    createdAt: Date.now(),
  });

  const versions = await ctx.db
    .query("documentVersions")
    .withIndex("by_document", (q) => q.eq("documentId", document._id))
    .order("desc")
    .collect();

  if (versions.length > MAX_VERSIONS) {
    for (const version of versions.slice(MAX_VERSIONS)) {
      await ctx.db.delete(version._id);
    }
  }
};

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return sortDocuments(documents);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const now = Date.now();

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      isFavorite: false,
      isLocked: false,
      isFullWidth: false,
      isSmallText: false,
      sortOrder: now,
      content: args.content,
      icon: args.icon,
      updatedAt: now,
    });

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
    isLocked: v.optional(v.boolean()),
    isFullWidth: v.optional(v.boolean()),
    isSmallText: v.optional(v.boolean()),
    parentDocument: v.optional(v.union(v.id("documents"), v.null())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, parentDocument, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (parentDocument !== undefined && parentDocument !== null) {
      if (parentDocument === args.id) {
        throw new Error("A page cannot be its own parent");
      }

      if (await isDescendant(ctx, args.id, parentDocument)) {
        throw new Error("A page cannot be moved inside its own subpage");
      }
    }

    if (
      rest.content !== undefined &&
      rest.content !== existingDocument.content &&
      existingDocument.content
    ) {
      await saveDocumentVersion(ctx, existingDocument, existingDocument.content);
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
      ...(parentDocument === null
        ? { parentDocument: undefined }
        : parentDocument !== undefined
          ? { parentDocument }
          : {}),
      updatedAt: Date.now(),
    });

    return document;
  },
});

export const getFavorites = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("isFavorite"), true)
        )
      )
      .collect();

    return documents.sort(
      (a, b) => (b.updatedAt ?? b._creationTime) - (a.updatedAt ?? a._creationTime)
    );
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const limit = args.limit ?? 5;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents
      .sort(
        (a, b) =>
          (b.updatedAt ?? b._creationTime) - (a.updatedAt ?? a._creationTime)
      )
      .slice(0, limit);
  },
});

export const getAncestors = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const ancestors: Doc<"documents">[] = [];

    let current: Doc<"documents"> | null = await ctx.db.get(args.documentId);

    if (!current || current.userId !== userId) {
      throw new Error("Not found");
    }

    while (current.parentDocument) {
      const parent: Doc<"documents"> | null = await ctx.db.get(
        current.parentDocument
      );

      if (!parent || parent.userId !== userId) {
        break;
      }

      ancestors.unshift(parent);
      current = parent;
    }

    return ancestors;
  },
});

export const getBacklinks = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const targetId = args.documentId;
    const needle = `/documents/${targetId}`;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents
      .filter(
        (document) =>
          document._id !== targetId && document.content?.includes(needle)
      )
      .map((document) => ({
        _id: document._id,
        title: document.title,
        icon: document.icon,
        updatedAt: document.updatedAt,
      }))
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  },
});

export const duplicate = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const source = await ctx.db.get(args.id);

    if (!source || source.userId !== userId) {
      throw new Error("Not found");
    }

    const duplicateDocument = async (
      document: Doc<"documents">,
      parentDocument?: Id<"documents">,
      isRoot = false
    ): Promise<Id<"documents">> => {
      const newId = await ctx.db.insert("documents", {
        title: isRoot ? `${document.title} (Copy)` : document.title,
        parentDocument,
        userId,
        isArchived: false,
        isPublished: false,
        isFavorite: false,
        isLocked: document.isLocked ?? false,
        isFullWidth: document.isFullWidth ?? false,
        isSmallText: document.isSmallText ?? false,
        sortOrder: Date.now(),
        content: document.content,
        coverImage: document.coverImage,
        icon: document.icon,
        updatedAt: Date.now(),
      });

      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", document._id)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect();

      for (const child of children) {
        await duplicateDocument(child, newId, false);
      }

      return newId;
    };

    return duplicateDocument(source, source.parentDocument, true);
  },
});

export const getVersions = query({
  args: {
    documentId: v.id("documents"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const document = await ctx.db.get(args.documentId);

    if (!document || document.userId !== userId) {
      throw new Error("Not found");
    }

    return ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .take(args.limit ?? MAX_VERSIONS);
  },
});

export const restoreVersion = mutation({
  args: { versionId: v.id("documentVersions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const version = await ctx.db.get(args.versionId);

    if (!version || version.userId !== userId) {
      throw new Error("Not found");
    }

    const document = await ctx.db.get(version.documentId);

    if (!document || document.userId !== userId) {
      throw new Error("Not found");
    }

    if (document.content) {
      await saveDocumentVersion(ctx, document, document.content);
    }

    await ctx.db.patch(version.documentId, {
      content: version.content,
      updatedAt: Date.now(),
    });

    return version.documentId;
  },
});

export const reorderDocument = mutation({
  args: {
    activeId: v.id("documents"),
    overId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const active = await ctx.db.get(args.activeId);
    const over = await ctx.db.get(args.overId);

    if (!active || !over || active.userId !== userId || over.userId !== userId) {
      throw new Error("Not found");
    }

    if (active._id === over._id) {
      return active._id;
    }

    if (await isDescendant(ctx, active._id, over._id)) {
      throw new Error("A page cannot be moved inside its own subpage");
    }

    const siblings = sortDocuments(
      await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", over.parentDocument)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect()
    ).filter((document) => document._id !== active._id);

    const overIndex = siblings.findIndex((document) => document._id === over._id);
    const overSort = getSortValue(over);
    const above = overIndex > 0 ? siblings[overIndex - 1] : undefined;
    const aboveSort = above ? getSortValue(above) : overSort + 1000;
    const newSort = (overSort + aboveSort) / 2;

    await ctx.db.patch(active._id, {
      parentDocument: over.parentDocument,
      sortOrder: newSort,
      updatedAt: Date.now(),
    });

    return active._id;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return document;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  },
});
