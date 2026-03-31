import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const all = await ctx.db.query("templates").collect();
    return all.filter(t => !t.isCustom || t.ownerId === userId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    slides: v.array(v.object({ type: v.string(), title: v.string(), content: v.string() })),
    isCustom: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    return await ctx.db.insert("templates", {
      ...args,
      ownerId: userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const template = await ctx.db.get(args.templateId);
    if (!template || template.ownerId !== userId) throw new Error("Accès refusé");
    await ctx.db.delete(args.templateId);
  },
});
