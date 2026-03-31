import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("aiSettings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();
  },
});

export const getForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiSettings")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .unique();
  },
});

export const save = mutation({
  args: {
    provider: v.string(),
    baseUrl: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    model: v.string(),
    apiFormat: v.string(),
    systemPromptExtra: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const existing = await ctx.db
      .query("aiSettings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
    } else {
      await ctx.db.insert("aiSettings", { userId, ...args });
    }
  },
});
