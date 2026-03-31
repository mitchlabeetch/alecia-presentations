import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_project", q => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
    projectContext: v.optional(v.string()),
    slidesContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: args.content,
      userId,
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.chatActions.generateResponse, {
      projectId: args.projectId,
      projectContext: args.projectContext ?? "",
      slidesContext: args.slidesContext ?? "",
      userId,
    });
  },
});

export const generateDeck = mutation({
  args: {
    projectId: v.id("projects"),
    projectContext: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const prompt = `Génère un pitch deck M&A complet et professionnel pour ce projet. 
Inclus 7-9 diapositives couvrant: couverture, résumé exécutif, thèse d'investissement, analyse de marché, performances financières, équipe dirigeante, et calendrier du processus.
Fournis TOUTES les diapositives en JSON dans un bloc \`\`\`slides\`\`\` avec un contenu riche et spécifique au contexte du projet.`;
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: prompt,
      userId,
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.chatActions.generateResponse, {
      projectId: args.projectId,
      projectContext: args.projectContext,
      slidesContext: "",
      userId,
    });
  },
});

export const clearHistory = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const msgs = await ctx.db
      .query("chatMessages")
      .withIndex("by_project", q => q.eq("projectId", args.projectId))
      .collect();
    for (const m of msgs) await ctx.db.delete(m._id);
  },
});

export const getMessages = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_project", q => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

export const saveResponse = internalMutation({
  args: { projectId: v.id("projects"), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "assistant",
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
