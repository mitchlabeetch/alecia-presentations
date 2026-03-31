import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) return [];
    return await ctx.db.query("slides").withIndex("by_project_order", q => q.eq("projectId", args.projectId)).order("asc").collect();
  },
});

export const upsert = mutation({
  args: {
    slideId: v.optional(v.id("slides")),
    projectId: v.id("projects"),
    order: v.number(),
    type: v.string(),
    title: v.string(),
    content: v.string(),
    notes: v.optional(v.string()),
    data: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    if (args.slideId) {
      await ctx.db.patch(args.slideId, {
        order: args.order, type: args.type, title: args.title,
        content: args.content, notes: args.notes, data: args.data,
      });
      return args.slideId;
    } else {
      return await ctx.db.insert("slides", {
        projectId: args.projectId, order: args.order, type: args.type,
        title: args.title, content: args.content, notes: args.notes, data: args.data,
      });
    }
  },
});

export const remove = mutation({
  args: { slideId: v.id("slides") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    await ctx.db.delete(args.slideId);
  },
});

export const duplicate = mutation({
  args: { slideId: v.id("slides") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const slide = await ctx.db.get(args.slideId);
    if (!slide) throw new Error("Diapositive introuvable");
    const project = await ctx.db.get(slide.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    const allSlides = await ctx.db
      .query("slides")
      .withIndex("by_project_order", q => q.eq("projectId", slide.projectId))
      .order("asc")
      .collect();
    for (const s of allSlides) {
      if (s.order > slide.order) {
        await ctx.db.patch(s._id, { order: s.order + 1 });
      }
    }
    return await ctx.db.insert("slides", {
      projectId: slide.projectId,
      order: slide.order + 1,
      type: slide.type,
      title: slide.title + " (copie)",
      content: slide.content,
      notes: slide.notes,
      data: slide.data,
    });
  },
});

export const reorder = mutation({
  args: { projectId: v.id("projects"), slideIds: v.array(v.id("slides")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    for (let i = 0; i < args.slideIds.length; i++) {
      await ctx.db.patch(args.slideIds[i], { order: i });
    }
  },
});

export const bulkInsert = mutation({
  args: {
    projectId: v.id("projects"),
    slides: v.array(v.object({
      order: v.number(),
      type: v.string(),
      title: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) throw new Error("Accès refusé");
    for (const slide of args.slides) {
      await ctx.db.insert("slides", { projectId: args.projectId, ...slide });
    }
  },
});
