import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) return null;
    return project;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    templateId: v.optional(v.id("templates")),
    targetCompany: v.optional(v.string()),
    dealType: v.optional(v.string()),
    targetSector: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      ownerId: userId,
      targetCompany: args.targetCompany,
      dealType: args.dealType,
      targetSector: args.targetSector,
      theme: {
        primaryColor: "#1a3a5c",
        accentColor: "#c9a84c",
        fontFamily: "Inter",
      },
      templateId: args.templateId,
      createdAt: now,
      updatedAt: now,
    });
    return projectId;
  },
});

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    targetCompany: v.optional(v.string()),
    targetSector: v.optional(v.string()),
    dealType: v.optional(v.string()),
    potentialBuyers: v.optional(v.array(v.string())),
    keyIndividuals: v.optional(v.array(v.string())),
    theme: v.optional(
      v.object({
        primaryColor: v.string(),
        accentColor: v.string(),
        fontFamily: v.string(),
        logoStorageId: v.optional(v.id("_storage")),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, { ...updates, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    await ctx.db.delete(args.projectId);
  },
});

/**
 * Update project theme/brand kit
 */
export const updateTheme = mutation({
  args: {
    projectId: v.id("projects"),
    theme: v.object({
      primaryColor: v.string(),
      accentColor: v.string(),
      fontFamily: v.string(),
      logoStorageId: v.optional(v.id("_storage")),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    await ctx.db.patch(args.projectId, {
      theme: args.theme,
      updatedAt: Date.now(),
    });
  },
});
