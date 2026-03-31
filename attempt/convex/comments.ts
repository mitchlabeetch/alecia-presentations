import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const list = query({
  args: { slideId: v.id("slides") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_slide", q => q.eq("slideId", args.slideId))
      .order("asc")
      .collect();
    return await Promise.all(comments.map(async c => {
      const author = await ctx.db.get(c.authorId);
      return {
        ...c,
        authorName: author?.name ?? author?.email ?? "Utilisateur",
        authorEmail: author?.email,
      };
    }));
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_project", q => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    return await Promise.all(comments.map(async c => {
      const author = await ctx.db.get(c.authorId);
      return {
        ...c,
        authorName: author?.name ?? author?.email ?? "Utilisateur",
      };
    }));
  },
});

export const add = mutation({
  args: {
    slideId: v.id("slides"),
    projectId: v.id("projects"),
    text: v.string(),
    field: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    return await ctx.db.insert("comments", {
      slideId: args.slideId,
      projectId: args.projectId,
      authorId: userId,
      field: args.field,
      text: args.text,
      resolved: false,
      createdAt: Date.now(),
    });
  },
});

export const resolve = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    await ctx.db.patch(args.commentId, { resolved: true, resolvedBy: userId });
  },
});

export const remove = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.authorId !== userId) throw new Error("Accès refusé");
    await ctx.db.delete(args.commentId);
  },
});

export const requestAiResponse = mutation({
  args: {
    commentId: v.id("comments"),
    slideContent: v.string(),
    slideTitle: v.string(),
    slideType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Commentaire introuvable");
    await ctx.scheduler.runAfter(0, internal.commentActions.resolveWithAI, {
      commentId: args.commentId,
      userId,
      slideContent: args.slideContent,
      slideTitle: args.slideTitle,
      slideType: args.slideType,
    });
  },
});

export const saveAiResponse = internalMutation({
  args: { commentId: v.id("comments"), response: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, { aiResponse: args.response });
  },
});

export const getComment = internalQuery({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.commentId);
  },
});
