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

  // Comments with threaded replies support via parentCommentId
  comments: defineTable({
    slideId: v.id("slides"),
    projectId: v.id("projects"),
    authorId: v.id("users"),
    field: v.optional(v.string()),
    text: v.string(),
    resolved: v.boolean(),
    resolvedBy: v.optional(v.id("users")),
    aiResponse: v.optional(v.string()),
    createdAt: v.number(),
    parentCommentId: v.optional(v.id("comments")),
    mentions: v.optional(v.array(v.string())),
  })
    .index("by_slide", ["slideId"])
    .index("by_project", ["projectId"]),

  aiSettings: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    baseUrl: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    model: v.string(),
    apiFormat: v.string(),
    systemPromptExtra: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  analyticsEvents: defineTable({
    eventName: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    properties: v.optional(v.any()),
    timestamp: v.number(),
    environment: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_eventName", ["eventName"]),

  dailyActiveUsers: defineTable({
    date: v.string(),
    count: v.number(),
    userIds: v.array(v.id("users")),
  }).index("by_date", ["date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
