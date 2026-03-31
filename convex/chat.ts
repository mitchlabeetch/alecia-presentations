import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

/**
 * Chat queries and mutations for PitchForge AI Chat
 *
 * Features:
 * - List messages per project
 * - Send messages with AI response generation
 * - Generate complete deck from brief
 * - Enhance content (polish/shorten/expand)
 * - Generate executive summary
 * - Generate talking points
 * - Suggest slide sequences
 * - Clear history
 */

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
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
    brief: v.object({
      clientName: v.string(),
      clientSector: v.string(),
      dealType: v.string(),
      keyMetrics: v.optional(
        v.object({
          revenue: v.optional(v.number()),
          ebitda: v.optional(v.number()),
          growth: v.optional(v.number()),
          multiple: v.optional(v.number()),
        }),
      ),
      teamSize: v.optional(v.number()),
      yearFounded: v.optional(v.number()),
      transactionRationale: v.optional(v.string()),
    }),
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

    await ctx.scheduler.runAfter(
      0,
      internal.chatActions.generateDeckFromBrief,
      {
        projectId: args.projectId,
        brief: args.brief,
        userId,
      },
    );
  },
});

export const enhanceContent = mutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
    intent: v.union(
      v.literal("polish"),
      v.literal("shorten"),
      v.literal("expand"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const intentLabels = {
      polish: "Amélioration professionnelle",
      shorten: "Raccourcissement",
      expand: "Développement",
    };

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: `${intentLabels[args.intent]} du contenu suivant :\n${args.content}`,
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.chatActions.enhanceContent, {
      projectId: args.projectId,
      content: args.content,
      intent: args.intent,
      userId,
    });
  },
});

export const generateSummary = mutation({
  args: {
    projectId: v.id("projects"),
    slidesContext: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: "Génère un résumé exécutif pour ce pitch deck",
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(
      0,
      internal.chatActions.generateExecutiveSummary,
      {
        projectId: args.projectId,
        slidesContext: args.slidesContext,
        userId,
      },
    );
  },
});

export const generateTalkingPoints = mutation({
  args: {
    projectId: v.id("projects"),
    slideTitle: v.string(),
    slideContent: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: `Génère les points de discussion pour la slide "${args.slideTitle}"`,
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(
      0,
      internal.chatActions.generateTalkingPoints,
      {
        projectId: args.projectId,
        slideTitle: args.slideTitle,
        slideContent: args.slideContent,
        userId,
      },
    );
  },
});

export const suggestSequence = mutation({
  args: {
    projectId: v.id("projects"),
    dealType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: `Suggère une séquence de slides pour une opération de type "${args.dealType}"`,
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.chatActions.suggestSlideSequence, {
      projectId: args.projectId,
      dealType: args.dealType,
      userId,
    });
  },
});

export const suggestImprovements = mutation({
  args: {
    projectId: v.id("projects"),
    slidesContext: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: "Analyse ce pitch deck et suggère des améliorations",
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.chatActions.suggestImprovements, {
      projectId: args.projectId,
      slidesContext: args.slidesContext,
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
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    for (const m of msgs) await ctx.db.delete(m._id);
  },
});

export const getMessages = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
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

// Batch enhance all slides in a project
export const enhanceAllSlides = mutation({
  args: {
    projectId: v.id("projects"),
    intent: v.union(
      v.literal("polish"),
      v.literal("shorten"),
      v.literal("expand"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const intentLabels = {
      polish: "Amélioration professionnelle de toutes les slides",
      shorten: "Raccourcissement de toutes les slides",
      expand: "Développement de toutes les slides",
    };

    await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: "user",
      content: `${intentLabels[args.intent]} de ce projet`,
      userId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.chatActions.enhanceAllSlides, {
      projectId: args.projectId,
      intent: args.intent,
      userId,
    });
  },
});
