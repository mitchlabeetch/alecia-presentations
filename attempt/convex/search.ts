import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchSlides = query({
  args: { projectId: v.id("projects"), query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId || !args.query.trim()) return [];
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) return [];
    const slides = await ctx.db.query("slides").withIndex("by_project", q => q.eq("projectId", args.projectId)).collect();
    const q = args.query.toLowerCase();
    return slides.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.notes ?? "").toLowerCase().includes(q)
    );
  },
});
