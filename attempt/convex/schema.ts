import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  projects: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    targetCompany: v.optional(v.string()),
    targetSector: v.optional(v.string()),
    dealType: v.optional(v.string()),
    potentialBuyers: v.optional(v.array(v.string())),
    keyIndividuals: v.optional(v.array(v.string())),
    theme: v.optional(v.object({
      primaryColor: v.string(),
      accentColor: v.string(),
      fontFamily: v.string(),
      logoStorageId: v.optional(v.id("_storage")),
    })),
    templateId: v.optional(v.id("templates")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  slides: defineTable({
    projectId: v.id("projects"),
    order: v.number(),
    type: v.string(),
    title: v.string(),
    content: v.string(),
    notes: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    data: v.optional(v.string()),
  }).index("by_project", ["projectId"]).index("by_project_order", ["projectId", "order"]),

  templates: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    thumbnailStorageId: v.optional(v.id("_storage")),
    slides: v.array(v.object({
      type: v.string(),
      title: v.string(),
      content: v.string(),
    })),
    isCustom: v.boolean(),
    ownerId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  chatMessages: defineTable({
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]),

  uploads: defineTable({
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]),

  // Comments anchored to a slide (optionally to a field: title|content|notes)
  comments: defineTable({
    slideId: v.id("slides"),
    projectId: v.id("projects"),
    authorId: v.id("users"),
    field: v.optional(v.string()), // "title" | "content" | "notes"
    text: v.string(),
    resolved: v.boolean(),
    resolvedBy: v.optional(v.id("users")),
    aiResponse: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_slide", ["slideId"])
    .index("by_project", ["projectId"]),

  // Per-user AI provider settings (stored per user)
  aiSettings: defineTable({
    userId: v.id("users"),
    provider: v.string(), // "convex_builtin" | "openai" | "anthropic" | "custom"
    baseUrl: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    model: v.string(),
    apiFormat: v.string(), // "openai" | "anthropic"
    systemPromptExtra: v.optional(v.string()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
