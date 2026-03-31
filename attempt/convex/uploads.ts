import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    return await ctx.storage.generateUploadUrl();
  },
});

export const save = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    return await ctx.db.insert("uploads", {
      projectId: args.projectId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      uploadedBy: userId,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const uploads = await ctx.db.query("uploads").withIndex("by_project", q => q.eq("projectId", args.projectId)).order("desc").collect();
    return await Promise.all(uploads.map(async (u) => ({
      ...u,
      url: await ctx.storage.getUrl(u.storageId),
    })));
  },
});

export const remove = mutation({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
    const upload = await ctx.db.get(args.uploadId);
    if (!upload || upload.uploadedBy !== userId) throw new Error("Accès refusé");
    await ctx.storage.delete(upload.storageId);
    await ctx.db.delete(args.uploadId);
  },
});
