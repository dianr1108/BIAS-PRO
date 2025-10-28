import { 
  type User, type InsertUser, 
  type Analysis, type InsertAnalysis,
  type LiveStream, type InsertLiveStream,
  type Competitor, type InsertCompetitor,
  type Trend, type InsertTrend,
  type History, type InsertHistory,
  type CalendarEvent, type InsertCalendarEvent,
  type Collaboration, type InsertCollaboration,
  type ExportJob, type InsertExportJob,
  type VideoAnalysis, type InsertVideoAnalysis,
  type VideoComparison, type InsertVideoComparison,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getAnalysesByUsername(username: string): Promise<Analysis[]>;
  getAllAnalyses(): Promise<Analysis[]>;
  
  createLiveStream(liveStream: InsertLiveStream): Promise<LiveStream>;
  getLiveStream(id: string): Promise<LiveStream | undefined>;
  getLiveStreamsByUsername(username: string): Promise<LiveStream[]>;
  deleteLiveStream(id: string): Promise<boolean>;
  
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  getCompetitor(id: string): Promise<Competitor | undefined>;
  getCompetitorsByUsername(mainUsername: string): Promise<Competitor[]>;
  deleteCompetitor(id: string): Promise<boolean>;
  
  createTrend(trend: InsertTrend): Promise<Trend>;
  getTrend(id: string): Promise<Trend | undefined>;
  getAllTrends(): Promise<Trend[]>;
  getTrendsByType(trendType: string): Promise<Trend[]>;
  deleteTrend(id: string): Promise<boolean>;
  
  createHistory(history: InsertHistory): Promise<History>;
  getHistory(id: string): Promise<History | undefined>;
  getHistoryByUsername(username: string): Promise<History[]>;
  
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  getCalendarEvent(id: string): Promise<CalendarEvent | undefined>;
  getCalendarEventsByUsername(username: string): Promise<CalendarEvent[]>;
  updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: string): Promise<boolean>;
  
  createCollaboration(collab: InsertCollaboration): Promise<Collaboration>;
  getCollaboration(id: string): Promise<Collaboration | undefined>;
  getCollaborationsByUsername(mainUsername: string): Promise<Collaboration[]>;
  updateCollaboration(id: string, updates: Partial<Collaboration>): Promise<Collaboration | undefined>;
  deleteCollaboration(id: string): Promise<boolean>;
  
  createExportJob(job: InsertExportJob): Promise<ExportJob>;
  getExportJob(id: string): Promise<ExportJob | undefined>;
  getExportJobsByUsername(username: string): Promise<ExportJob[]>;
  updateExportJob(id: string, updates: Partial<ExportJob>): Promise<ExportJob | undefined>;
  deleteExportJob(id: string): Promise<boolean>;
  
  createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getVideoAnalysis(id: string): Promise<VideoAnalysis | undefined>;
  getVideoAnalysesByUsername(username: string): Promise<VideoAnalysis[]>;
  deleteVideoAnalysis(id: string): Promise<boolean>;
  
  createVideoComparison(comparison: InsertVideoComparison): Promise<VideoComparison>;
  getVideoComparison(id: string): Promise<VideoComparison | undefined>;
  getVideoComparisonsByUsername(username: string): Promise<VideoComparison[]>;
  deleteVideoComparison(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyses: Map<string, Analysis>;
  private liveStreams: Map<string, LiveStream>;
  private competitors: Map<string, Competitor>;
  private trends: Map<string, Trend>;
  private histories: Map<string, History>;
  private calendarEvents: Map<string, CalendarEvent>;
  private collaborations: Map<string, Collaboration>;
  private exportJobs: Map<string, ExportJob>;
  private videoAnalyses: Map<string, VideoAnalysis>;
  private videoComparisons: Map<string, VideoComparison>;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.liveStreams = new Map();
    this.competitors = new Map();
    this.trends = new Map();
    this.histories = new Map();
    this.calendarEvents = new Map();
    this.collaborations = new Map();
    this.exportJobs = new Map();
    this.videoAnalyses = new Map();
    this.videoComparisons = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      bio: insertAnalysis.bio ?? null,
      avatarUrl: insertAnalysis.avatarUrl ?? null,
      isVerified: insertAnalysis.isVerified ?? false,
      following: insertAnalysis.following ?? null,
      externalLinks: insertAnalysis.externalLinks ?? [],
      governanceAlerts: insertAnalysis.governanceAlerts || [],
      analyzedAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysesByUsername(username: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter((analysis) => analysis.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
  }

  async getAllAnalyses(): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
  }

  async createLiveStream(insertLiveStream: InsertLiveStream): Promise<LiveStream> {
    const id = randomUUID();
    const liveStream: LiveStream = {
      ...insertLiveStream,
      id,
      title: insertLiveStream.title ?? null,
      videoUrl: insertLiveStream.videoUrl ?? null,
      fileName: insertLiveStream.fileName ?? null,
      fileSize: insertLiveStream.fileSize ?? null,
      peakViewers: insertLiveStream.peakViewers ?? null,
      avgViewers: insertLiveStream.avgViewers ?? null,
      totalViews: insertLiveStream.totalViews ?? null,
      totalGifts: insertLiveStream.totalGifts ?? null,
      giftValue: insertLiveStream.giftValue ?? null,
      totalComments: insertLiveStream.totalComments ?? null,
      totalShares: insertLiveStream.totalShares ?? null,
      retentionRate: insertLiveStream.retentionRate ?? null,
      peakMoments: insertLiveStream.peakMoments ?? [],
      giftPatterns: insertLiveStream.giftPatterns ?? [],
      chatAnalysis: insertLiveStream.chatAnalysis ?? null,
      analyzedAt: new Date(),
    };
    this.liveStreams.set(id, liveStream);
    return liveStream;
  }

  async getLiveStream(id: string): Promise<LiveStream | undefined> {
    return this.liveStreams.get(id);
  }

  async getLiveStreamsByUsername(username: string): Promise<LiveStream[]> {
    return Array.from(this.liveStreams.values())
      .filter((stream) => stream.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
  }

  async deleteLiveStream(id: string): Promise<boolean> {
    return this.liveStreams.delete(id);
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const id = randomUUID();
    const competitor: Competitor = {
      ...insertCompetitor,
      id,
      competitorBio: insertCompetitor.competitorBio ?? null,
      competitorAvatarUrl: insertCompetitor.competitorAvatarUrl ?? null,
      following: insertCompetitor.following ?? null,
      growthRate: insertCompetitor.growthRate ?? null,
      engagementRate: insertCompetitor.engagementRate ?? null,
      postingFrequency: insertCompetitor.postingFrequency ?? null,
      avgLikesPerVideo: insertCompetitor.avgLikesPerVideo ?? null,
      avgViewsPerVideo: insertCompetitor.avgViewsPerVideo ?? null,
      historicalMetrics: insertCompetitor.historicalMetrics ?? [],
      contentThemes: insertCompetitor.contentThemes ?? [],
      topFormats: insertCompetitor.topFormats ?? [],
      postingSchedule: insertCompetitor.postingSchedule ?? [],
      audienceSegments: insertCompetitor.audienceSegments ?? [],
      sentimentSummary: insertCompetitor.sentimentSummary ?? null,
      strengths: insertCompetitor.strengths ?? [],
      weaknesses: insertCompetitor.weaknesses ?? [],
      contentGaps: insertCompetitor.contentGaps ?? [],
      competitiveAdvantages: insertCompetitor.competitiveAdvantages ?? [],
      opportunities: insertCompetitor.opportunities ?? [],
      comparativeInsights: insertCompetitor.comparativeInsights ?? [],
      comparedAt: new Date(),
    };
    this.competitors.set(id, competitor);
    return competitor;
  }

  async getCompetitor(id: string): Promise<Competitor | undefined> {
    return this.competitors.get(id);
  }

  async getCompetitorsByUsername(mainUsername: string): Promise<Competitor[]> {
    return Array.from(this.competitors.values())
      .filter((comp) => comp.mainUsername.toLowerCase() === mainUsername.toLowerCase())
      .sort((a, b) => b.comparedAt.getTime() - a.comparedAt.getTime());
  }

  async deleteCompetitor(id: string): Promise<boolean> {
    return this.competitors.delete(id);
  }

  async createTrend(insertTrend: InsertTrend): Promise<Trend> {
    const id = randomUUID();
    const trend: Trend = {
      ...insertTrend,
      id,
      description: insertTrend.description ?? null,
      peakPrediction: insertTrend.peakPrediction ?? null,
      saturationLevel: insertTrend.saturationLevel ?? null,
      totalVideos: insertTrend.totalVideos ?? null,
      totalViews: insertTrend.totalViews ?? null,
      avgEngagement: insertTrend.avgEngagement ?? null,
      bestPostingTimes: insertTrend.bestPostingTimes ?? [],
      topCreators: insertTrend.topCreators ?? [],
      contentExamples: insertTrend.contentExamples ?? [],
      relevanceScore: insertTrend.relevanceScore ?? null,
      opportunityLevel: insertTrend.opportunityLevel ?? null,
      recommendations: insertTrend.recommendations ?? [],
      detectedAt: new Date(),
      expiresAt: insertTrend.expiresAt ?? null,
    };
    this.trends.set(id, trend);
    return trend;
  }

  async getTrend(id: string): Promise<Trend | undefined> {
    return this.trends.get(id);
  }

  async getAllTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .sort((a, b) => b.viralScore - a.viralScore);
  }

  async getTrendsByType(trendType: string): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .filter((trend) => trend.trendType === trendType)
      .sort((a, b) => b.viralScore - a.viralScore);
  }

  async deleteTrend(id: string): Promise<boolean> {
    return this.trends.delete(id);
  }

  async createHistory(insertHistory: InsertHistory): Promise<History> {
    const id = randomUUID();
    const history: History = {
      ...insertHistory,
      id,
      following: insertHistory.following ?? null,
      growthRate: insertHistory.growthRate ?? null,
      engagementRate: insertHistory.engagementRate ?? null,
      milestones: insertHistory.milestones ?? [],
      improvements: insertHistory.improvements ?? [],
      recordedAt: new Date(),
    };
    this.histories.set(id, history);
    return history;
  }

  async getHistory(id: string): Promise<History | undefined> {
    return this.histories.get(id);
  }

  async getHistoryByUsername(username: string): Promise<History[]> {
    return Array.from(this.histories.values())
      .filter((history) => history.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());
  }

  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = randomUUID();
    const event: CalendarEvent = {
      ...insertEvent,
      id,
      status: insertEvent.status ?? "planned",
      description: insertEvent.description ?? null,
      contentIdea: insertEvent.contentIdea ?? null,
      targetTrend: insertEvent.targetTrend ?? null,
      expectedViralScore: insertEvent.expectedViralScore ?? null,
      hashtags: insertEvent.hashtags ?? [],
      soundtrack: insertEvent.soundtrack ?? null,
      notes: insertEvent.notes ?? null,
      posted: insertEvent.posted ?? false,
      postedAt: insertEvent.postedAt ?? null,
      actualViews: insertEvent.actualViews ?? null,
      actualEngagement: insertEvent.actualEngagement ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.calendarEvents.set(id, event);
    return event;
  }

  async getCalendarEvent(id: string): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }

  async getCalendarEventsByUsername(username: string): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values())
      .filter((event) => event.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }

  async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> {
    const event = this.calendarEvents.get(id);
    if (!event) return undefined;
    const updatedEvent = { ...event, ...updates, updatedAt: new Date() };
    this.calendarEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }

  async createCollaboration(insertCollab: InsertCollaboration): Promise<Collaboration> {
    const id = randomUUID();
    const collab: Collaboration = {
      ...insertCollab,
      id,
      status: insertCollab.status ?? "suggested",
      targetAvatarUrl: insertCollab.targetAvatarUrl ?? null,
      audienceOverlap: insertCollab.audienceOverlap ?? null,
      contentSynergy: insertCollab.contentSynergy ?? null,
      growthPotential: insertCollab.growthPotential ?? null,
      sharedCategories: insertCollab.sharedCategories ?? [],
      complementaryStrengths: insertCollab.complementaryStrengths ?? [],
      collabIdeas: insertCollab.collabIdeas ?? [],
      contacted: insertCollab.contacted ?? false,
      contactedAt: insertCollab.contactedAt ?? null,
      notes: insertCollab.notes ?? null,
      createdAt: new Date(),
    };
    this.collaborations.set(id, collab);
    return collab;
  }

  async getCollaboration(id: string): Promise<Collaboration | undefined> {
    return this.collaborations.get(id);
  }

  async getCollaborationsByUsername(mainUsername: string): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values())
      .filter((collab) => collab.mainUsername.toLowerCase() === mainUsername.toLowerCase())
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  async updateCollaboration(id: string, updates: Partial<Collaboration>): Promise<Collaboration | undefined> {
    const collab = this.collaborations.get(id);
    if (!collab) return undefined;
    const updatedCollab = { ...collab, ...updates };
    this.collaborations.set(id, updatedCollab);
    return updatedCollab;
  }

  async deleteCollaboration(id: string): Promise<boolean> {
    return this.collaborations.delete(id);
  }

  async createExportJob(insertJob: InsertExportJob): Promise<ExportJob> {
    const id = randomUUID();
    const job: ExportJob = {
      ...insertJob,
      id,
      status: insertJob.status ?? "pending",
      progress: insertJob.progress ?? 0,
      fileUrl: insertJob.fileUrl ?? null,
      fileName: insertJob.fileName ?? null,
      fileSize: insertJob.fileSize ?? null,
      error: insertJob.error ?? null,
      createdAt: new Date(),
      completedAt: insertJob.completedAt ?? null,
      expiresAt: insertJob.expiresAt ?? null,
    };
    this.exportJobs.set(id, job);
    return job;
  }

  async getExportJob(id: string): Promise<ExportJob | undefined> {
    return this.exportJobs.get(id);
  }

  async getExportJobsByUsername(username: string): Promise<ExportJob[]> {
    return Array.from(this.exportJobs.values())
      .filter((job) => job.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateExportJob(id: string, updates: Partial<ExportJob>): Promise<ExportJob | undefined> {
    const job = this.exportJobs.get(id);
    if (!job) return undefined;
    const updatedJob = { ...job, ...updates };
    this.exportJobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteExportJob(id: string): Promise<boolean> {
    return this.exportJobs.delete(id);
  }

  async createVideoAnalysis(insertAnalysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const id = randomUUID();
    const analysis: VideoAnalysis = {
      ...insertAnalysis,
      id,
      fileSize: insertAnalysis.fileSize ?? null,
      duration: insertAnalysis.duration ?? null,
      estimatedViewsMin: insertAnalysis.estimatedViewsMin ?? null,
      estimatedViewsMax: insertAnalysis.estimatedViewsMax ?? null,
      checklist: insertAnalysis.checklist ?? [],
      analyzedAt: new Date(),
    };
    this.videoAnalyses.set(id, analysis);
    return analysis;
  }

  async getVideoAnalysis(id: string): Promise<VideoAnalysis | undefined> {
    return this.videoAnalyses.get(id);
  }

  async getVideoAnalysesByUsername(username: string): Promise<VideoAnalysis[]> {
    return Array.from(this.videoAnalyses.values())
      .filter((analysis) => analysis.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());
  }

  async deleteVideoAnalysis(id: string): Promise<boolean> {
    return this.videoAnalyses.delete(id);
  }

  async createVideoComparison(insertComparison: InsertVideoComparison): Promise<VideoComparison> {
    const id = randomUUID();
    const comparison: VideoComparison = {
      ...insertComparison,
      id,
      createdAt: new Date(),
    };
    this.videoComparisons.set(id, comparison);
    return comparison;
  }

  async getVideoComparison(id: string): Promise<VideoComparison | undefined> {
    return this.videoComparisons.get(id);
  }

  async getVideoComparisonsByUsername(username: string): Promise<VideoComparison[]> {
    return Array.from(this.videoComparisons.values())
      .filter((comparison) => comparison.tiktokUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteVideoComparison(id: string): Promise<boolean> {
    return this.videoComparisons.delete(id);
  }
}

export const storage = new MemStorage();
