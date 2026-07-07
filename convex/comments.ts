import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    documentId: v.id("documents"),
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
      .query("comments")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const body = args.body.trim();

    if (!body) {
      throw new Error("Comment cannot be empty");
    }

    const document = await ctx.db.get(args.documentId);

    if (!document || document.userId !== userId) {
      throw new Error("Not found");
    }

    return ctx.db.insert("comments", {
      documentId: args.documentId,
      userId,
      userName: identity.name ?? "User",
      userImageUrl: identity.pictureUrl ?? undefined,
      body,
      createdAt: Date.now(),
      isResolved: false,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const comment = await ctx.db.get(args.id);

    if (!comment || comment.userId !== userId) {
      throw new Error("Not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleResolved = mutation({
  args: {
    id: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const comment = await ctx.db.get(args.id);

    if (!comment || comment.userId !== userId) {
      throw new Error("Not found");
    }

    await ctx.db.patch(args.id, {
      isResolved: !comment.isResolved,
    });

    return args.id;
  },
});
