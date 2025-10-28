import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  tiktokNickname: text("tiktok_nickname").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  followers: integer("followers").notNull(),
  following: integer("following"),
  likes: integer("likes").notNull(),
  videos: integer("videos").notNull(),
  externalLinks: jsonb("external_links").default([]),
  
  visualScore: integer("visual_score").notNull(),
  audioScore: integer("audio_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  interactionScore: integer("interaction_score").notNull(),
  linguisticScore: integer("linguistic_score").notNull(),
  contextualScore: integer("contextual_score").notNull(),
  environmentalScore: integer("environmental_score").notNull(),
  governanceScore: integer("governance_score").notNull(),
  
  insights: jsonb("insights").notNull(),
  governanceAlerts: jsonb("governance_alerts").notNull().default([]),
  
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  analyzedAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export const behavioralScoreSchema = z.object({
  visual: z.number().min(0).max(100),
  audio: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  interaction: z.number().min(0).max(100),
  linguistic: z.number().min(0).max(100),
  contextual: z.number().min(0).max(100),
  environmental: z.number().min(0).max(100),
  governance: z.number().min(0).max(100),
});

export type BehavioralScore = z.infer<typeof behavioralScoreSchema>;

export const insightSchema = z.object({
  type: z.enum(["strength", "opportunity", "alert"]),
  title: z.string(),
  description: z.string(),
});

export type Insight = z.infer<typeof insightSchema>;

export const tiktokProfileSchema = z.object({
  username: z.string(),
  nickname: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  isVerified: z.boolean().optional(),
  followers: z.number(),
  following: z.number().optional(),
  likes: z.number(),
  videos: z.number(),
  externalLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
});

export type TikTokProfile = z.infer<typeof tiktokProfileSchema>;

export const liveStreamSessions = pgTable("live_stream_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  title: text("title"),
  duration: integer("duration").notNull(),
  videoUrl: text("video_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  
  peakViewers: integer("peak_viewers"),
  avgViewers: integer("avg_viewers"),
  totalViews: integer("total_views"),
  totalGifts: integer("total_gifts"),
  giftValue: integer("gift_value"),
  totalComments: integer("total_comments"),
  totalShares: integer("total_shares"),
  
  retentionRate: integer("retention_rate"),
  engagementScore: integer("engagement_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  interactionScore: integer("interaction_score").notNull(),
  audioQuality: integer("audio_quality").notNull(),
  
  peakMoments: jsonb("peak_moments").default([]),
  giftPatterns: jsonb("gift_patterns").default([]),
  chatAnalysis: jsonb("chat_analysis"),
  aiInsights: jsonb("ai_insights").notNull(),
  
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertLiveStreamSchema = createInsertSchema(liveStreamSessions).omit({
  id: true,
  analyzedAt: true,
});

export type InsertLiveStream = z.infer<typeof insertLiveStreamSchema>;
export type LiveStream = typeof liveStreamSessions.$inferSelect;

export const competitorSnapshots = pgTable("competitor_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mainUsername: text("main_username").notNull(),
  competitorUsername: text("competitor_username").notNull(),
  competitorNickname: text("competitor_nickname").notNull(),
  competitorBio: text("competitor_bio"),
  competitorAvatarUrl: text("competitor_avatar_url"),
  
  followers: integer("followers").notNull(),
  following: integer("following"),
  likes: integer("likes").notNull(),
  videos: integer("videos").notNull(),
  
  visualScore: integer("visual_score").notNull(),
  audioScore: integer("audio_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  interactionScore: integer("interaction_score").notNull(),
  linguisticScore: integer("linguistic_score").notNull(),
  contextualScore: integer("contextual_score").notNull(),
  environmentalScore: integer("environmental_score").notNull(),
  governanceScore: integer("governance_score").notNull(),
  
  growthRate: integer("growth_rate"),
  engagementRate: integer("engagement_rate"),
  postingFrequency: integer("posting_frequency"),
  avgLikesPerVideo: integer("avg_likes_per_video"),
  avgViewsPerVideo: integer("avg_views_per_video"),
  
  historicalMetrics: jsonb("historical_metrics").default([]),
  contentThemes: jsonb("content_themes").default([]),
  topFormats: jsonb("top_formats").default([]),
  postingSchedule: jsonb("posting_schedule").default([]),
  audienceSegments: jsonb("audience_segments").default([]),
  sentimentSummary: jsonb("sentiment_summary"),
  
  strengths: jsonb("strengths").default([]),
  weaknesses: jsonb("weaknesses").default([]),
  contentGaps: jsonb("content_gaps").default([]),
  competitiveAdvantages: jsonb("competitive_advantages").default([]),
  opportunities: jsonb("opportunities").default([]),
  comparativeInsights: jsonb("comparative_insights").default([]),
  
  comparedAt: timestamp("compared_at").notNull().defaultNow(),
});

export const insertCompetitorSchema = createInsertSchema(competitorSnapshots).omit({
  id: true,
  comparedAt: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitorSnapshots.$inferSelect;

export const trendItems = pgTable("trend_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trendType: text("trend_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  
  viralScore: integer("viral_score").notNull(),
  growthVelocity: integer("growth_velocity").notNull(),
  peakPrediction: integer("peak_prediction"),
  saturationLevel: integer("saturation_level"),
  
  totalVideos: integer("total_videos"),
  totalViews: integer("total_views"),
  avgEngagement: integer("avg_engagement"),
  
  bestPostingTimes: jsonb("best_posting_times").default([]),
  topCreators: jsonb("top_creators").default([]),
  contentExamples: jsonb("content_examples").default([]),
  
  relevanceScore: integer("relevance_score"),
  opportunityLevel: text("opportunity_level"),
  recommendations: jsonb("recommendations").default([]),
  
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertTrendSchema = createInsertSchema(trendItems).omit({
  id: true,
  detectedAt: true,
});

export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type Trend = typeof trendItems.$inferSelect;

export const analyticsHistory = pgTable("analytics_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  
  followers: integer("followers").notNull(),
  following: integer("following"),
  likes: integer("likes").notNull(),
  videos: integer("videos").notNull(),
  
  visualScore: integer("visual_score").notNull(),
  audioScore: integer("audio_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  interactionScore: integer("interaction_score").notNull(),
  linguisticScore: integer("linguistic_score").notNull(),
  contextualScore: integer("contextual_score").notNull(),
  environmentalScore: integer("environmental_score").notNull(),
  governanceScore: integer("governance_score").notNull(),
  
  overallScore: integer("overall_score").notNull(),
  growthRate: integer("growth_rate"),
  engagementRate: integer("engagement_rate"),
  
  milestones: jsonb("milestones").default([]),
  improvements: jsonb("improvements").default([]),
  
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const insertHistorySchema = createInsertSchema(analyticsHistory).omit({
  id: true,
  recordedAt: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof analyticsHistory.$inferSelect;

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(),
  
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").notNull().default("planned"),
  
  contentIdea: text("content_idea"),
  targetTrend: text("target_trend"),
  expectedViralScore: integer("expected_viral_score"),
  
  hashtags: jsonb("hashtags").default([]),
  soundtrack: text("soundtrack"),
  notes: text("notes"),
  
  posted: boolean("posted").default(false),
  postedAt: timestamp("posted_at"),
  actualViews: integer("actual_views"),
  actualEngagement: integer("actual_engagement"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export const collaborations = pgTable("collaborations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mainUsername: text("main_username").notNull(),
  
  targetUsername: text("target_username").notNull(),
  targetNickname: text("target_nickname").notNull(),
  targetAvatarUrl: text("target_avatar_url"),
  targetFollowers: integer("target_followers").notNull(),
  
  matchScore: integer("match_score").notNull(),
  audienceOverlap: integer("audience_overlap"),
  contentSynergy: integer("content_synergy"),
  growthPotential: integer("growth_potential"),
  
  sharedCategories: jsonb("shared_categories").default([]),
  complementaryStrengths: jsonb("complementary_strengths").default([]),
  collabIdeas: jsonb("collab_ideas").default([]),
  
  status: text("status").notNull().default("suggested"),
  contacted: boolean("contacted").default(false),
  contactedAt: timestamp("contacted_at"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCollaborationSchema = createInsertSchema(collaborations).omit({
  id: true,
  createdAt: true,
});

export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
export type Collaboration = typeof collaborations.$inferSelect;

export const exportJobs = pgTable("export_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  
  exportType: text("export_type").notNull(),
  format: text("format").notNull(),
  
  status: text("status").notNull().default("pending"),
  progress: integer("progress").default(0),
  
  dataSnapshot: jsonb("data_snapshot").notNull(),
  
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  
  error: text("error"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});

export const insertExportJobSchema = createInsertSchema(exportJobs).omit({
  id: true,
  createdAt: true,
});

export type InsertExportJob = z.infer<typeof insertExportJobSchema>;
export type ExportJob = typeof exportJobs.$inferSelect;

export const videoAnalyses = pgTable("video_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  duration: integer("duration"),
  
  hookScore: integer("hook_score").notNull(),
  visualScore: integer("visual_score").notNull(),
  audioScore: integer("audio_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  viralScore: integer("viral_score").notNull(),
  
  estimatedViewsMin: integer("estimated_views_min"),
  estimatedViewsMax: integer("estimated_views_max"),
  
  insights: jsonb("insights").notNull(),
  checklist: jsonb("checklist").default([]),
  
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).omit({
  id: true,
  analyzedAt: true,
});

export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;
export type VideoAnalysis = typeof videoAnalyses.$inferSelect;

export const videoComparisons = pgTable("video_comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tiktokUsername: text("tiktok_username").notNull(),
  
  comparisonName: text("comparison_name").notNull(),
  videoCount: integer("video_count").notNull(),
  
  videoIds: jsonb("video_ids").notNull(),
  comparisonResults: jsonb("comparison_results").notNull(),
  
  bestPerformers: jsonb("best_performers").notNull(),
  weakestAreas: jsonb("weakest_areas").notNull(),
  crossLearnings: jsonb("cross_learnings").notNull(),
  aiRecommendations: jsonb("ai_recommendations").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVideoComparisonSchema = createInsertSchema(videoComparisons).omit({
  id: true,
  createdAt: true,
});

export type InsertVideoComparison = z.infer<typeof insertVideoComparisonSchema>;
export type VideoComparison = typeof videoComparisons.$inferSelect;
