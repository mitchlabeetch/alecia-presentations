import { v } from 'convex/values';
import { defineTable, defineSchema } from 'convex/server';
import { mutation, query } from './_generated/server';

/**
 * Analytics events table - stores all tracking events
 */
export const analyticsEvents = defineTable({
  eventName: v.string(),
  userId: v.optional(v.id('users')),
  sessionId: v.string(),
  properties: v.optional(v.any()),
  timestamp: v.number(),
  environment: v.string(),
})
  .index('by_user', ['userId'])
  .index('by_session', ['sessionId'])
  .index('by_timestamp', ['timestamp'])
  .index('by_eventName', ['eventName']);

/**
 * Daily active users aggregation
 */
export const dailyActiveUsers = defineTable({
  date: v.string(), // YYYY-MM-DD format
  count: v.number(),
  userIds: v.array(v.id('users')),
}).index('by_date', ['date']);

/**
 * Store a batch of analytics events
 */
export const storeEvents = mutation({
  args: {
    events: v.array(
      v.object({
        eventName: v.string(),
        userId: v.optional(v.id('users')),
        sessionId: v.string(),
        properties: v.optional(v.any()),
        timestamp: v.number(),
      })
    ),
    environment: v.string(),
  },
  handler: async (ctx, args) => {
    const { events, environment } = args;

    // Insert all events
    for (const event of events) {
      await ctx.db.insert('analyticsEvents', {
        ...event,
        environment,
      });
    }

    return { stored: events.length };
  },
});

/**
 * Track a specific user action
 */
export const trackEvent = mutation({
  args: {
    eventName: v.string(),
    userId: v.optional(v.id('users')),
    sessionId: v.string(),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('analyticsEvents', {
      ...args,
      timestamp: Date.now(),
      environment: 'production',
    });
  },
});

/**
 * Get events for a specific user
 */
export const getUserEvents = query({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db
      .query('analyticsEvents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(limit);
  },
});

/**
 * Get daily active users for a date range
 */
export const getDailyActiveUsers = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) => q.gte(q.field('timestamp'), new Date(args.startDate).getTime()))
      .filter((q) => q.lte(q.field('timestamp'), new Date(args.endDate).getTime()))
      .collect();

    // Group by user and date
    const dailyStats: Record<string, Set<string>> = {};
    for (const event of events) {
      if (event.userId) {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = new Set();
        }
        dailyStats[date].add(event.userId);
      }
    }

    return Object.entries(dailyStats).map(([date, users]) => ({
      date,
      count: users.size,
    }));
  },
});

/**
 * Get usage metrics summary
 */
export const getUsageMetrics = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) => q.gte(q.field('timestamp'), startTime))
      .collect();

    // Calculate metrics
    const uniqueUsers = new Set<string>();
    const projectsCreated = events.filter((e) => e.eventName === 'project_created').length;
    const projectsExported = events.filter((e) => e.eventName === 'project_exported').length;
    const aiGenerations = events.filter((e) => e.eventName === 'ai_generation').length;
    let aiTokensUsed = 0;

    for (const event of events) {
      if (event.userId) {
        uniqueUsers.add(event.userId);
      }
      if (event.eventName === 'ai_generation' && event.properties?.tokensUsed) {
        aiTokensUsed += event.properties.tokensUsed as number;
      }
    }

    // Calculate signups to first project conversion
    const signups = events.filter((e) => e.eventName === 'user_signup').length;
    const firstProjectCreated = events.filter((e) => e.eventName === 'project_created').length;

    // Funnel: signup -> first project
    const signupsToFirstProject = signups > 0 ? (firstProjectCreated / signups) * 100 : 0;

    // Funnel: project -> export
    const projectsToExport = projectsCreated > 0 ? (projectsExported / projectsCreated) * 100 : 0;

    return {
      dau: uniqueUsers.size,
      wau: Math.round(uniqueUsers.size * 2.5), // Estimate
      mau: Math.round(uniqueUsers.size * 5), // Estimate
      projectsCreated,
      projectsExported,
      projectsShared: 0,
      aiGenerations,
      aiTokensUsed,
      signupsToFirstProject: Math.round(signupsToFirstProject),
      projectsToFirstExport: Math.round(projectsToExport),
      lastUpdated: Date.now(),
    };
  },
});

/**
 * Get funnel analysis data
 */
export const getFunnelAnalysis = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query('analyticsEvents')
      .withIndex('by_timestamp')
      .filter((q) => q.gte(q.field('timestamp'), startTime))
      .collect();

    // Count each funnel step
    const signups = events.filter((e) => e.eventName === 'user_signup').length;
    const firstProject = events.filter((e) => e.eventName === 'project_created').length;
    const firstExport = events.filter((e) => e.eventName === 'project_exported').length;
    const aiUsed = events.filter((e) => e.eventName === 'ai_generation').length;

    return [
      { name: 'Inscriptions', count: signups, dropoff: 0 },
      {
        name: 'Premier projet créé',
        count: firstProject,
        dropoff: signups > 0 ? Math.round(((signups - firstProject) / signups) * 100) : 0,
      },
      {
        name: 'Projet exporté',
        count: firstExport,
        dropoff:
          firstProject > 0 ? Math.round(((firstProject - firstExport) / firstProject) * 100) : 0,
      },
      {
        name: 'IA utilisée',
        count: aiUsed,
        dropoff: firstExport > 0 ? Math.round(((firstExport - aiUsed) / firstExport) * 100) : 0,
      },
    ];
  },
});

export default defineSchema({
  analyticsEvents,
  dailyActiveUsers,
});
