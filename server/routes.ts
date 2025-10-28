// server/routes.ts

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeTikTokProfile } from "./services/tiktok-scraper";
import {
  analyzeBehavioralMetrics,
  detectGovernanceAlerts,
} from "./services/behavioral-analyzer";
import { generateAIInsights } from "./services/ai-insights";
import { analyzeLiveStream } from "./services/livestream-analyzer";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // 🔹 STATIC LEGAL PAGES - For TikTok API verification
  app.get("/terms", (req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - BIAS</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #111; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
        h2 { color: #222; margin-top: 30px; }
        .updated { color: #666; font-size: 0.9em; }
        ul { margin-left: 20px; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p class="updated">Last updated: October 24, 2025</p>

    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using BIAS (Behavioral Intelligence Audit System), you accept and agree to be bound by the terms and provision of this agreement.</p>

    <h2>2. Description of Service</h2>
    <p>BIAS is an analytics platform that provides behavioral intelligence insights for TikTok creators. We analyze public TikTok profile data to generate performance reports, growth strategies, and AI-powered recommendations.</p>

    <h2>3. Use of TikTok Data</h2>
    <p>BIAS uses TikTok's official Display API to access publicly available data including:</p>
    <ul>
        <li>Public profile information (username, bio, follower count)</li>
        <li>Public video metrics (likes, comments, shares, views)</li>
        <li>Publicly available engagement data</li>
    </ul>
    <p>We do NOT access private accounts, personal messages, or any non-public data.</p>

    <h2>4. User Responsibilities</h2>
    <p>Users agree to:</p>
    <ul>
        <li>Provide accurate TikTok usernames for analysis</li>
        <li>Use the service for legitimate analytics purposes only</li>
        <li>Not attempt to reverse engineer or misuse the platform</li>
        <li>Comply with TikTok's Terms of Service and Community Guidelines</li>
    </ul>

    <h2>5. Data Accuracy</h2>
    <p>While we strive to provide accurate analytics, BIAS does not guarantee the completeness or accuracy of data provided by third-party APIs. All insights and recommendations are for informational purposes only.</p>

    <h2>6. Intellectual Property</h2>
    <p>All content, features, and functionality of BIAS are owned by BIAS and are protected by international copyright, trademark, and other intellectual property laws.</p>

    <h2>7. Limitation of Liability</h2>
    <p>BIAS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>

    <h2>8. Changes to Terms</h2>
    <p>We reserve the right to modify these terms at any time. Continued use of BIAS after changes constitutes acceptance of the modified terms.</p>

    <h2>9. Contact Information</h2>
    <p>For questions about these Terms of Service, please contact us through our platform at <a href="https://bias23.replit.app">bias23.replit.app</a>.</p>

    <h2>10. Governing Law</h2>
    <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.</p>
</body>
</html>`);
  });

  app.get("/privacy", (req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - BIAS</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #111; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
        h2 { color: #222; margin-top: 30px; }
        h3 { color: #444; margin-top: 20px; }
        .updated { color: #666; font-size: 0.9em; }
        ul { margin-left: 20px; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: October 24, 2025</p>

    <h2>1. Introduction</h2>
    <p>BIAS (Behavioral Intelligence Audit System) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our analytics platform.</p>

    <h2>2. Information We Collect</h2>
    <h3>2.1 Public TikTok Data</h3>
    <p>We collect publicly available TikTok data through official APIs, including:</p>
    <ul>
        <li>Profile information (username, bio, follower count, following count)</li>
        <li>Video metrics (video count, total likes, engagement rates)</li>
        <li>Public content performance data</li>
        <li>Trending hashtags and sounds</li>
    </ul>

    <h3>2.2 Usage Data</h3>
    <p>We may collect anonymous usage data including browser type, device information, and platform interactions to improve our service.</p>

    <h2>3. How We Use Your Information</h2>
    <p>We use collected data to:</p>
    <ul>
        <li>Generate behavioral analytics and performance insights</li>
        <li>Provide AI-powered content recommendations</li>
        <li>Display trending data and competitor comparisons</li>
        <li>Improve our analytics algorithms and platform features</li>
        <li>Ensure platform security and prevent abuse</li>
    </ul>

    <h2>4. Data Storage and Security</h2>
    <p>Currently, BIAS uses in-memory storage for analysis data. We implement industry-standard security measures to protect data during processing. We do not sell, trade, or transfer your data to third parties.</p>

    <h2>5. Third-Party Services</h2>
    <h3>5.1 TikTok API</h3>
    <p>We use TikTok's official Display API to access public profile data. Your use of BIAS is also subject to TikTok's Privacy Policy and Terms of Service.</p>

    <h3>5.2 AI Services</h3>
    <p>We use Google Gemini AI to generate insights and recommendations. No personal data is shared with AI services beyond what is necessary for analysis.</p>

    <h2>6. Cookies and Tracking</h2>
    <p>BIAS may use cookies and similar tracking technologies to enhance user experience. You can control cookie settings through your browser preferences.</p>

    <h2>7. Data Retention</h2>
    <p>Analysis data is stored temporarily in memory for the duration of your session. We do not permanently store personal TikTok profile data unless explicitly required for features you have opted into.</p>

    <h2>8. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Request information about data we have collected</li>
        <li>Request deletion of your analysis history</li>
        <li>Opt-out of data collection by discontinuing use of the service</li>
        <li>Update or correct any inaccurate information</li>
    </ul>

    <h2>9. Children's Privacy</h2>
    <p>BIAS is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.</p>

    <h2>10. Changes to Privacy Policy</h2>
    <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>

    <h2>11. Contact Us</h2>
    <p>If you have questions or concerns about this Privacy Policy, please contact us through our platform at <a href="https://bias23.replit.app">bias23.replit.app</a>.</p>

    <h2>12. Compliance</h2>
    <p>BIAS complies with applicable data protection laws and regulations. We are committed to protecting your privacy and handling data responsibly in accordance with industry best practices.</p>
</body>
</html>`);
  });

  // 🔹 CORS MIDDLEWARE - Enable public API access for ChatGPT integration
  app.use("/api/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    
    next();
  });

  // 🔹 PUBLIC ANALYZE ENDPOINT (GET) - For ChatGPT GPT Builder integration
  app.get("/api/analyze", async (req, res) => {
    try {
      const { username } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).json({
          error: "Missing required parameter: username (e.g., ?username=@newsmaker23_talk)",
        });
      }

      console.log(`[BIAS API] Public GET request for: ${username}`);

      // Scrape TikTok profile data
      const profile = await scrapeTikTokProfile(username);
      
      // Analyze behavioral metrics
      const behavioralAnalysis = analyzeBehavioralMetrics(profile);
      
      // Build behavioral scores
      const behavioralScores = {
        visual: behavioralAnalysis.visual,
        audio: behavioralAnalysis.audio,
        energy: behavioralAnalysis.energy,
        interaction: behavioralAnalysis.interaction,
        linguistic: behavioralAnalysis.linguistic,
        contextual: behavioralAnalysis.contextual,
        environmental: behavioralAnalysis.environmental,
        governance: behavioralAnalysis.governance,
      };
      
      // Generate AI insights
      const aiInsights = await generateAIInsights(profile, behavioralAnalysis);
      
      // Detect governance alerts
      const governanceAlerts = detectGovernanceAlerts(
        profile.followers,
        profile.likes,
        profile.videos,
        behavioralScores,
      );

      // Calculate engagement metrics
      const avgLikesPerVideo = profile.videos > 0 ? Math.floor(profile.likes / profile.videos) : 0;
      const engagementRate = profile.followers > 0 
        ? parseFloat(((avgLikesPerVideo / profile.followers) * 100).toFixed(2))
        : 0;

      // Return public JSON response (ChatGPT-friendly format)
      return res.json({
        username: `@${profile.username}`,
        profile: {
          nickname: profile.nickname,
          bio: profile.bio,
          followers: profile.followers,
          following: profile.following,
          videos: profile.videos,
          total_likes: profile.likes,
          likes_per_video: avgLikesPerVideo,
          engagement_rate: engagementRate,
          is_verified: profile.isVerified || false,
        },
        layers: {
          VBM: behavioralScores.visual,
          ABM: behavioralScores.audio,
          BIFS: behavioralScores.energy,
          EPM: behavioralScores.interaction,
          NLP: behavioralScores.linguistic,
          BRM: behavioralScores.contextual,
          EnvTech: behavioralScores.environmental,
          BMIL: behavioralScores.governance,
        },
        insights: aiInsights,
        governance: {
          score: behavioralScores.governance,
          alerts: governanceAlerts,
          bot_detection: governanceAlerts.some(alert => 
            alert.toLowerCase().includes("bot") || 
            alert.toLowerCase().includes("fake")
          ) ? 0.12 : 0.03,
          brand_safety: behavioralScores.governance > 70 ? "high" : 
                       behavioralScores.governance > 50 ? "medium" : "low",
        },
        ai_summary: aiInsights.length > 0 
          ? aiInsights[0] 
          : `@${profile.username} memiliki ${profile.followers.toLocaleString()} followers dengan engagement rate ${engagementRate}%. Governance score ${behavioralScores.governance} menunjukkan potensi yang ${behavioralScores.governance > 70 ? 'sangat baik' : 'perlu ditingkatkan'}.`,
      });
    } catch (error: any) {
      console.error("[BIAS API] GET /api/analyze error:", error.message);
      return res.status(500).json({
        error: "Failed to analyze TikTok profile",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 🔹 ALIAS ENDPOINT - /api/profile (same as /api/analyze for ChatGPT)
  app.get("/api/profile", async (req, res) => {
    try {
      const { username } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).json({
          error: "Missing required parameter: username (e.g., ?username=@newsmaker23_talk)",
        });
      }

      console.log(`[BIAS API] Public GET /api/profile request for: ${username}`);

      // Scrape TikTok profile data
      const profile = await scrapeTikTokProfile(username);
      
      // Analyze behavioral metrics
      const behavioralAnalysis = analyzeBehavioralMetrics(profile);
      
      // Build behavioral scores
      const behavioralScores = {
        visual: behavioralAnalysis.visual,
        audio: behavioralAnalysis.audio,
        energy: behavioralAnalysis.energy,
        interaction: behavioralAnalysis.interaction,
        linguistic: behavioralAnalysis.linguistic,
        contextual: behavioralAnalysis.contextual,
        environmental: behavioralAnalysis.environmental,
        governance: behavioralAnalysis.governance,
      };
      
      // Generate AI insights
      const aiInsights = await generateAIInsights(profile, behavioralAnalysis);
      
      // Detect governance alerts
      const governanceAlerts = detectGovernanceAlerts(
        profile.followers,
        profile.likes,
        profile.videos,
        behavioralScores,
      );

      // Calculate engagement metrics
      const avgLikesPerVideo = profile.videos > 0 ? Math.floor(profile.likes / profile.videos) : 0;
      const engagementRate = profile.followers > 0 
        ? parseFloat(((avgLikesPerVideo / profile.followers) * 100).toFixed(2))
        : 0;

      // Return public JSON response (ChatGPT-friendly format)
      return res.json({
        username: `@${profile.username}`,
        profile: {
          nickname: profile.nickname,
          bio: profile.bio,
          followers: profile.followers,
          following: profile.following,
          videos: profile.videos,
          total_likes: profile.likes,
          likes_per_video: avgLikesPerVideo,
          engagement_rate: engagementRate,
          is_verified: profile.isVerified || false,
        },
        layers: {
          VBM: behavioralScores.visual,
          ABM: behavioralScores.audio,
          BIFS: behavioralScores.energy,
          EPM: behavioralScores.interaction,
          NLP: behavioralScores.linguistic,
          BRM: behavioralScores.contextual,
          EnvTech: behavioralScores.environmental,
          BMIL: behavioralScores.governance,
        },
        insights: aiInsights,
        governance: {
          score: behavioralScores.governance,
          alerts: governanceAlerts,
          bot_detection: governanceAlerts.some(alert => 
            alert.toLowerCase().includes("bot") || 
            alert.toLowerCase().includes("fake")
          ) ? 0.12 : 0.03,
          brand_safety: behavioralScores.governance > 70 ? "high" : 
                       behavioralScores.governance > 50 ? "medium" : "low",
        },
        ai_summary: aiInsights.length > 0 
          ? aiInsights[0] 
          : `@${profile.username} memiliki ${profile.followers.toLocaleString()} followers dengan engagement rate ${engagementRate}%. Governance score ${behavioralScores.governance} menunjukkan potensi yang ${behavioralScores.governance > 70 ? 'sangat baik' : 'perlu ditingkatkan'}.`,
      });
    } catch (error: any) {
      console.error("[BIAS API] GET /api/profile error:", error.message);
      return res.status(500).json({
        error: "Failed to analyze TikTok profile",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 🔹 ANALYZE ENDPOINT (POST) - Original endpoint for web app
  app.post("/api/analyze", async (req, res) => {
    try {
      const { input, username } = req.body;
      const target = input || username;

      if (!target || typeof target !== "string") {
        return res.status(400).json({
          error: "Invalid input. Please provide a TikTok username or URL.",
        });
      }

      console.log(`[BIAS] Analyzing TikTok profile: ${target}`);

      // Scrape TikTok profile data
      const profile = await scrapeTikTokProfile(target);
      console.log(`[BIAS] Profile data scraped for: @${profile.username}`);

      // 🔹 Analyze behavioral metrics
      const behavioralAnalysis = analyzeBehavioralMetrics(profile);
      console.log(`[BIAS] Behavioral analysis complete`);

      // 🔹 Build behavioral scores
      const behavioralScores = {
        visual: behavioralAnalysis.visual,
        audio: behavioralAnalysis.audio,
        energy: behavioralAnalysis.energy,
        interaction: behavioralAnalysis.interaction,
        linguistic: behavioralAnalysis.linguistic,
        contextual: behavioralAnalysis.contextual,
        environmental: behavioralAnalysis.environmental,
        governance: behavioralAnalysis.governance,
      };

      // 🔹 Generate AI-based insights
      const aiInsights = await generateAIInsights(profile, behavioralAnalysis);
      console.log(
        `[BIAS] AI insights generated: ${aiInsights.length} insights`,
      );

      // 🔹 Detect governance alerts (bot/fake pattern)
      const governanceAlerts = detectGovernanceAlerts(
        profile.followers,
        profile.likes,
        profile.videos,
        behavioralScores,
      );

      // 🔹 Save analysis to local DB
      const analysis = await storage.createAnalysis({
        tiktokUsername: profile.username,
        tiktokNickname: profile.nickname,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        isVerified: profile.isVerified ?? false,
        followers: profile.followers,
        following: profile.following,
        likes: profile.likes,
        videos: profile.videos,
        externalLinks: profile.externalLinks || [],
        visualScore: behavioralScores.visual,
        audioScore: behavioralScores.audio,
        energyScore: behavioralScores.energy,
        interactionScore: behavioralScores.interaction,
        linguisticScore: behavioralScores.linguistic,
        contextualScore: behavioralScores.contextual,
        environmentalScore: behavioralScores.environmental,
        governanceScore: behavioralScores.governance,
        insights: aiInsights,
        governanceAlerts: governanceAlerts,
      });

      console.log(`[BIAS] Analysis saved with ID: ${analysis.id}`);

      // 🔹 Return response
      return res.json({
        success: true,
        analysisId: analysis.id,
        profile,
        behavioral: {
          scores: behavioralScores,
          insights: behavioralAnalysis.insights,
        },
        aiInsights,
        governanceAlerts,
      });
    } catch (error: any) {
      console.error("[BIAS] Analysis error:", error.message || error);
      return res.status(500).json({
        error: "Failed to analyze TikTok profile",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 🔹 GET SPECIFIC ANALYSIS
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      return res.json({
        success: true,
        analysis,
      });
    } catch (error: any) {
      console.error("[BIAS] Fetch analysis error:", error.message);
      return res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // 🔹 GET ALL ANALYSES OR FILTER BY USERNAME
  app.get("/api/analyses", async (req, res) => {
    try {
      const { username } = req.query;

      const analyses =
        username && typeof username === "string"
          ? await storage.getAnalysesByUsername(username)
          : await storage.getAllAnalyses();

      return res.json({
        success: true,
        analyses,
      });
    } catch (error: any) {
      console.error("[BIAS] Fetch analyses error:", error.message);
      return res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // 🔹 LIVE STREAM ANALYSIS
  app.post("/api/livestream/analyze", async (req, res) => {
    try {
      const { fileName, fileSize, duration, username } = req.body;
      
      if (!fileName || !fileSize || !duration || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log(`[BIAS] Analyzing live stream: ${fileName} for @${username}`);
      
      const { metrics, aiInsights } = await analyzeLiveStream(
        fileName,
        fileSize,
        duration,
        username
      );

      const liveStream = await storage.createLiveStream({
        tiktokUsername: username,
        title: fileName.replace(/\.[^/.]+$/, ""),
        duration,
        fileName,
        fileSize,
        peakViewers: metrics.peakViewers,
        avgViewers: metrics.avgViewers,
        totalViews: metrics.totalViews,
        totalGifts: metrics.totalGifts,
        giftValue: metrics.giftValue,
        totalComments: metrics.totalComments,
        totalShares: metrics.totalShares,
        retentionRate: metrics.retentionRate,
        engagementScore: metrics.engagementScore,
        energyScore: metrics.energyScore,
        interactionScore: metrics.interactionScore,
        audioQuality: metrics.audioQuality,
        peakMoments: metrics.peakMoments as any,
        giftPatterns: metrics.giftPatterns as any,
        chatAnalysis: metrics.chatAnalysis as any,
        aiInsights: aiInsights as any,
      });

      return res.json({
        success: true,
        id: liveStream.id,
        metrics,
        aiInsights,
      });
    } catch (error: any) {
      console.error("[BIAS] Live stream analysis error:", error.message);
      return res.status(500).json({ error: "Failed to analyze live stream" });
    }
  });

  app.get("/api/livestream/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const streams = await storage.getLiveStreamsByUsername(username);
      return res.json({ success: true, streams });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch live streams" });
    }
  });

  // 🔹 COMPETITOR ANALYSIS
  app.post("/api/competitor/analyze", async (req, res) => {
    try {
      const { mainUsername, competitorUsername } = req.body;
      
      if (!mainUsername || !competitorUsername) {
        return res.status(400).json({ error: "Missing usernames" });
      }

      console.log(`[BIAS] Analyzing competitor: @${competitorUsername} for @${mainUsername}`);

      const profile = await scrapeTikTokProfile(competitorUsername);
      const analysis = analyzeBehavioralMetrics(profile);

      // 🔹 Compute richer derived metrics
      const avgLikesPerVideo = profile.videos > 0 ? Math.floor(profile.likes / profile.videos) : 0;
      const avgViewsPerVideo = profile.videos > 0 ? Math.floor(avgLikesPerVideo * 15) : 0;
      const engagementRate = profile.followers > 0 ? Math.floor((avgLikesPerVideo / profile.followers) * 10000) / 100 : 0;
      const growthRate = Math.floor(Math.random() * 20) + 5;
      const postingFrequency = Math.floor(Math.random() * 15) + 3;

      // 🔹 Generate mock historical metrics (last 4 weeks)
      const historicalMetrics = [];
      let baseFollowers = profile.followers;
      for (let i = 4; i >= 0; i--) {
        const weekGrowth = Math.floor(baseFollowers * (growthRate / 100) * (i / 4));
        historicalMetrics.push({
          week: `Minggu -${i}`,
          followers: baseFollowers - weekGrowth,
          engagement: engagementRate + (Math.random() * 2 - 1),
          videos: Math.max(0, profile.videos - Math.floor((postingFrequency / 7) * 7 * i)),
        });
      }

      // 🔹 Analyze content themes
      const contentThemes = [
        "Dance",
        "Comedy",
        "Lifestyle",
        "Tutorial",
        "Review",
        "Vlog",
        "Music",
        "Cooking"
      ];
      const selectedThemes = contentThemes
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);

      // 🔹 Identify top formats
      const topFormats = [
        "Trending Sounds",
        "Duets",
        "Tutorials",
        "Challenges",
        "Transitions",
        "POV",
        "Behind the Scenes",
        "Q&A"
      ];
      const selectedFormats = topFormats
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);

      // 🔹 Mock posting schedule patterns
      const postingSchedule = [
        { day: "Senin", hour: 19, frequency: Math.floor(Math.random() * 5) + 1 },
        { day: "Rabu", hour: 20, frequency: Math.floor(Math.random() * 5) + 1 },
        { day: "Jumat", hour: 18, frequency: Math.floor(Math.random() * 5) + 1 },
        { day: "Sabtu", hour: 14, frequency: Math.floor(Math.random() * 5) + 1 },
      ];

      // 🔹 Get main account data for comparison (if exists)
      const mainAccountAnalyses = await storage.getAnalysesByUsername(mainUsername);
      const mainAccount = mainAccountAnalyses[0];

      // 🔹 Generate AI-powered comparative insights using OpenAI
      let strengths: any[] = [];
      let weaknesses: any[] = [];
      let competitiveAdvantages: any[] = [];

      const OpenAI = (await import("openai")).default;
      const openai = process.env.OPENAI_API_KEY 
        ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        : null;

      if (openai && mainAccount) {
        try {
          const prompt = `Analyze this TikTok competitor comparison and provide insights in Indonesian casual tone.

Main Account (@${mainUsername}):
- Followers: ${mainAccount.followers.toLocaleString()}
- Videos: ${mainAccount.videos}
- Engagement Rate: ${mainAccount.followers > 0 ? ((mainAccount.likes / mainAccount.videos / mainAccount.followers) * 100).toFixed(2) : 0}%
- Behavioral Scores: Visual=${mainAccount.visualScore}, Audio=${mainAccount.audioScore}, Energy=${mainAccount.energyScore}, Interaction=${mainAccount.interactionScore}

Competitor (@${profile.username}):
- Followers: ${profile.followers.toLocaleString()}
- Videos: ${profile.videos}
- Engagement Rate: ${engagementRate}%
- Behavioral Scores: Visual=${analysis.visual}, Audio=${analysis.audio}, Energy=${analysis.energy}, Interaction=${analysis.interaction}
- Content Themes: ${selectedThemes.join(", ")}
- Top Formats: ${selectedFormats.join(", ")}

Provide insights in JSON format:
{
  "strengths": [
    { "area": "string", "evidence": "string (Indonesian, casual)", "score": number }
  ],
  "weaknesses": [
    { "area": "string", "issue": "string (Indonesian, casual)", "score": number }
  ],
  "competitiveAdvantages": [
    { "advantage": "string", "impact": "string (Indonesian, casual)", "actionable": "string" }
  ]
}

Focus on 2-3 items per category. Be specific and actionable.`;

          const response = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: "You are a TikTok analytics expert. Provide insights in Indonesian casual tone, be specific and actionable."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 2048,
          });

          const result = JSON.parse(response.choices[0].message.content || "{}");
          strengths = result.strengths || [];
          weaknesses = result.weaknesses || [];
          competitiveAdvantages = result.competitiveAdvantages || [];
          console.log(`[BIAS] AI insights generated for competitor @${profile.username}`);
        } catch (error) {
          console.error("[BIAS] AI insights generation failed:", error);
        }
      }

      // 🔹 Fallback insights if OpenAI is not available or failed
      if (strengths.length === 0) {
        if (analysis.visual >= 75) {
          strengths.push({
            area: "Kualitas Visual",
            evidence: `Score ${analysis.visual}/100, konten visual sangat menarik dan profesional`,
            score: analysis.visual
          });
        }
        if (engagementRate > 3) {
          strengths.push({
            area: "Engagement Rate",
            evidence: `${engagementRate}% engagement rate, jauh di atas rata-rata industri`,
            score: Math.min(95, engagementRate * 20)
          });
        }
      }

      if (weaknesses.length === 0 && mainAccount) {
        if (postingFrequency < 7) {
          weaknesses.push({
            area: "Frekuensi Posting",
            issue: `Hanya ${postingFrequency} post/minggu, bisa lebih konsisten lagi`,
            score: 40
          });
        }
      }

      if (competitiveAdvantages.length === 0) {
        competitiveAdvantages.push({
          advantage: "Content Diversity",
          impact: `Menggunakan ${selectedFormats.length} format berbeda untuk menjaga variasi konten`,
          actionable: "Terus eksplorasi format baru untuk engagement lebih tinggi"
        });
      }

      const competitor = await storage.createCompetitor({
        mainUsername,
        competitorUsername: profile.username,
        competitorNickname: profile.nickname,
        competitorBio: profile.bio,
        competitorAvatarUrl: profile.avatarUrl,
        followers: profile.followers,
        following: profile.following,
        likes: profile.likes,
        videos: profile.videos,
        visualScore: analysis.visual,
        audioScore: analysis.audio,
        energyScore: analysis.energy,
        interactionScore: analysis.interaction,
        linguisticScore: analysis.linguistic,
        contextualScore: analysis.contextual,
        environmentalScore: analysis.environmental,
        governanceScore: analysis.governance,
        growthRate,
        engagementRate,
        postingFrequency,
        avgLikesPerVideo,
        avgViewsPerVideo,
        historicalMetrics: historicalMetrics as any,
        contentThemes: selectedThemes as any,
        topFormats: selectedFormats as any,
        postingSchedule: postingSchedule as any,
        strengths: strengths as any,
        weaknesses: weaknesses as any,
        competitiveAdvantages: competitiveAdvantages as any,
      });

      console.log(`[BIAS] Competitor analysis complete for @${profile.username}`);

      return res.json({ success: true, competitor });
    } catch (error: any) {
      console.error("[BIAS] Competitor analysis error:", error.message);
      return res.status(500).json({ error: "Failed to analyze competitor" });
    }
  });

  app.get("/api/competitor/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const competitors = await storage.getCompetitorsByUsername(username);
      return res.json({ success: true, competitors });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch competitors" });
    }
  });

  // 🔹 COMPREHENSIVE COMPARISON ENDPOINT
  app.get("/api/competitor/comparison/:mainUsername", async (req, res) => {
    try {
      const { mainUsername } = req.params;

      console.log(`[BIAS] Fetching comprehensive comparison for @${mainUsername}`);

      // 🔹 Fetch main account analysis
      const mainAccountAnalyses = await storage.getAnalysesByUsername(mainUsername);
      const mainAccount = mainAccountAnalyses[0];

      if (!mainAccount) {
        return res.status(404).json({ error: "Main account not analyzed yet" });
      }

      // 🔹 Fetch all competitors
      const competitors = await storage.getCompetitorsByUsername(mainUsername);

      if (competitors.length === 0) {
        return res.json({
          success: true,
          mainAccount,
          competitors: [],
          comparativeInsights: [],
        });
      }

      // 🔹 Normalize main account data to match competitor structure
      const mainAccountData = {
        id: mainAccount.id,
        username: mainAccount.tiktokUsername,
        nickname: mainAccount.tiktokNickname,
        bio: mainAccount.bio,
        avatarUrl: mainAccount.avatarUrl,
        followers: mainAccount.followers,
        following: mainAccount.following,
        likes: mainAccount.likes,
        videos: mainAccount.videos,
        visualScore: mainAccount.visualScore,
        audioScore: mainAccount.audioScore,
        energyScore: mainAccount.energyScore,
        interactionScore: mainAccount.interactionScore,
        linguisticScore: mainAccount.linguisticScore,
        contextualScore: mainAccount.contextualScore,
        environmentalScore: mainAccount.environmentalScore,
        governanceScore: mainAccount.governanceScore,
        engagementRate: mainAccount.videos > 0 && mainAccount.followers > 0
          ? Math.floor(((mainAccount.likes / mainAccount.videos) / mainAccount.followers) * 10000) / 100
          : 0,
        avgLikesPerVideo: mainAccount.videos > 0 ? Math.floor(mainAccount.likes / mainAccount.videos) : 0,
        isMainAccount: true,
      };

      // 🔹 Generate cross-competitor AI synthesis
      let comparativeInsights: any[] = [];

      const OpenAI = (await import("openai")).default;
      const openai = process.env.OPENAI_API_KEY 
        ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        : null;

      if (openai && competitors.length > 0) {
        try {
          const competitorsData = competitors.map(c => ({
            username: c.competitorUsername,
            followers: c.followers,
            engagement: c.engagementRate,
            growth: c.growthRate,
            visualScore: c.visualScore,
            audioScore: c.audioScore,
            energyScore: c.energyScore,
            postingFreq: c.postingFrequency,
          }));

          const prompt = `Analyze this TikTok account comparison and provide strategic insights in Indonesian casual tone.

Main Account (@${mainUsername}):
- Followers: ${mainAccount.followers.toLocaleString()}
- Engagement Rate: ${mainAccountData.engagementRate}%
- Videos: ${mainAccount.videos}
- Posting Frequency: N/A
- Behavioral: Visual=${mainAccount.visualScore}, Audio=${mainAccount.audioScore}, Energy=${mainAccount.energyScore}

Competitors:
${competitorsData.map(c => `
@${c.username}:
- Followers: ${c.followers.toLocaleString()}
- Engagement: ${c.engagement}%
- Growth: +${c.growth}%/week
- Posting Freq: ${c.postingFreq}/week
- Visual=${c.visualScore}, Audio=${c.audioScore}, Energy=${c.energyScore}
`).join('\n')}

Provide cross-competitor insights in JSON format:
{
  "comparativeInsights": [
    {
      "metric": "string (metric name)",
      "leader": "string (username who leads)",
      "value": "string (leader's value)",
      "opportunity": "string (Indonesian, what main account can learn)",
      "priority": "high" | "medium" | "low"
    }
  ],
  "overallRecommendations": [
    {
      "title": "string",
      "description": "string (Indonesian, casual)",
      "impact": "high" | "medium" | "low"
    }
  ],
  "metricLeaders": {
    "followers": "username",
    "engagement": "username",
    "visual": "username",
    "audio": "username",
    "energy": "username"
  }
}

Focus on 3-5 comparative insights. Be actionable and specific.`;

          const response = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: "You are a TikTok competitive analysis expert. Provide insights in Indonesian casual tone, be specific and actionable."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 2048,
          });

          const result = JSON.parse(response.choices[0].message.content || "{}");
          comparativeInsights = result.comparativeInsights || [];
          
          // Add metric leaders and recommendations to response
          const metricLeaders = result.metricLeaders || {};
          const overallRecommendations = result.overallRecommendations || [];

          console.log(`[BIAS] Cross-competitor AI synthesis generated`);

          return res.json({
            success: true,
            mainAccount: mainAccountData,
            competitors,
            comparativeInsights,
            metricLeaders,
            overallRecommendations,
          });

        } catch (error) {
          console.error("[BIAS] Cross-competitor AI synthesis failed:", error);
        }
      }

      // 🔹 Fallback: Basic comparison without AI
      const allAccounts = [
        { username: mainAccountData.username, followers: mainAccountData.followers, engagementRate: mainAccountData.engagementRate },
        ...competitors.map(c => ({
          username: c.competitorUsername,
          followers: c.followers,
          engagementRate: c.engagementRate || 0,
        }))
      ];

      const followersLeader = allAccounts.reduce((max, acc) => 
        acc.followers > max.followers ? acc : max
      );

      const engagementLeader = allAccounts.reduce((max, acc) => 
        (acc.engagementRate || 0) > (max.engagementRate || 0) ? acc : max
      );

      comparativeInsights.push({
        metric: "Followers",
        leader: followersLeader.username,
        value: `${(followersLeader.followers / 1000).toFixed(1)}K`,
        opportunity: `${followersLeader.username} memiliki follower terbanyak. Pelajari strategi konten mereka!`,
        priority: "high"
      });

      comparativeInsights.push({
        metric: "Engagement Rate",
        leader: engagementLeader.username,
        value: `${engagementLeader.engagementRate}%`,
        opportunity: `${engagementLeader.username} punya engagement tertinggi. Coba tiru format konten mereka!`,
        priority: "high"
      });

      return res.json({
        success: true,
        mainAccount: mainAccountData,
        competitors,
        comparativeInsights,
        metricLeaders: {
          followers: followersLeader.username,
          engagement: engagementLeader.username,
        },
        overallRecommendations: [],
      });

    } catch (error: any) {
      console.error("[BIAS] Comparison fetch error:", error.message);
      return res.status(500).json({ error: "Failed to fetch comparison data" });
    }
  });

  // 🔹 TREND RADAR (Public GET endpoint)
  app.get("/api/trends", async (req, res) => {
    try {
      const trends = await storage.getAllTrends();
      
      // Transform to public API format
      const topTrends = trends.slice(0, 10).map(trend => ({
        type: trend.trendType,
        name: trend.name,
        category: trend.trendType === 'sound' ? 'Audio' : 'Hashtag',
        viral_score: trend.viralScore,
        growth_velocity: trend.growthVelocity,
        saturation_level: trend.saturationLevel,
        peak_prediction: trend.peakPrediction,
        best_posting_times: trend.bestPostingTimes || [],
        top_creators: trend.topCreators || [],
        opportunity_level: trend.opportunityLevel,
      }));
      
      return res.json({ 
        success: true, 
        trends: topTrends,
        total: trends.length,
        last_updated: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // 🔹 PUBLIC COMPETITORS ENDPOINT (GET) - For ChatGPT integration
  app.get("/api/competitors", async (req, res) => {
    try {
      const { username } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).json({
          error: "Missing required parameter: username (e.g., ?username=@newsmaker23_talk)",
        });
      }

      console.log(`[BIAS API] Public GET request for competitors of: ${username}`);

      // Get latest competitor analyses for this username
      const allCompetitors = await storage.getCompetitorsByUsername(username);
      
      if (allCompetitors.length === 0) {
        return res.json({
          username: username,
          competitors: [],
          message: "No competitor analysis data available yet. Analyze competitors first via the web app.",
        });
      }

      // Transform to public API format
      const competitors = allCompetitors.slice(0, 5).map(comp => ({
        username: `@${comp.competitorUsername}`,
        followers: comp.followers,
        videos: comp.videos,
        avg_likes_per_video: comp.avgLikesPerVideo,
        avg_views_per_video: comp.avgViewsPerVideo,
        engagement_rate: comp.engagementRate,
        growth_rate: comp.growthRate,
        posting_frequency: comp.postingFrequency,
        behavioral_scores: {
          visual: comp.visualScore,
          audio: comp.audioScore,
          energy: comp.energyScore,
          interaction: comp.interactionScore,
          linguistic: comp.linguisticScore,
          contextual: comp.contextualScore,
          environmental: comp.environmentalScore,
          governance: comp.governanceScore,
        },
        content_themes: comp.contentThemes || [],
        top_formats: comp.topFormats || [],
        strengths: comp.strengths || [],
        weaknesses: comp.weaknesses || [],
      }));

      return res.json({
        username: username,
        competitors: competitors,
        total_analyzed: allCompetitors.length,
        last_updated: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[BIAS API] GET /api/competitors error:", error.message);
      return res.status(500).json({
        error: "Failed to fetch competitor data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 🔹 PUBLIC LIVE STREAM ENDPOINT (GET) - For ChatGPT integration
  app.get("/api/live", async (req, res) => {
    try {
      const { username } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).json({
          error: "Missing required parameter: username (e.g., ?username=@newsmaker23_talk)",
        });
      }

      console.log(`[BIAS API] Public GET request for live streams of: ${username}`);

      // Get latest live stream analyses for this username
      const streams = await storage.getLiveStreamsByUsername(username);
      
      if (streams.length === 0) {
        return res.json({
          username: username,
          live_streams: [],
          message: "No live stream analysis data available yet. Analyze live streams first via the web app.",
        });
      }

      // Transform to public API format (latest 5 streams)
      const liveStreams = streams.slice(0, 5).map(stream => ({
        stream_id: stream.id,
        duration_minutes: stream.duration,
        peak_viewers: stream.peakViewers,
        avg_viewers: stream.avgViewers,
        total_views: stream.totalViews,
        total_gifts: stream.totalGifts,
        gift_value_idr: stream.giftValue,
        total_comments: stream.totalComments,
        total_shares: stream.totalShares,
        retention_rate: stream.retentionRate,
        engagement_score: stream.engagementScore,
        energy_score: stream.energyScore,
        interaction_score: stream.interactionScore,
        audio_quality: stream.audioQuality,
        peak_moments: stream.peakMoments || [],
        chat_sentiment: stream.chatAnalysis && typeof stream.chatAnalysis === 'object' && 'sentimentScore' in stream.chatAnalysis ? {
          positive: (stream.chatAnalysis as any).sentimentScore > 0.6,
          keywords: (stream.chatAnalysis as any).topKeywords || [],
        } : null,
        ai_insights: stream.aiInsights || [],
        analyzed_at: stream.analyzedAt,
      }));

      return res.json({
        username: username,
        live_streams: liveStreams,
        total_analyzed: streams.length,
        last_updated: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[BIAS API] GET /api/live error:", error.message);
      return res.status(500).json({
        error: "Failed to fetch live stream data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 🔹 ANALYTICS HISTORY
  app.get("/api/history/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const history = await storage.getHistoryByUsername(username);
      return res.json({ success: true, history });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // 🔹 CALENDAR EVENTS
  app.get("/api/calendar/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const events = await storage.getCalendarEventsByUsername(username);
      return res.json({ success: true, events });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar", async (req, res) => {
    try {
      const event = await storage.createCalendarEvent(req.body);
      return res.json({ success: true, event });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to create calendar event" });
    }
  });

  app.patch("/api/calendar/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.updateCalendarEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      return res.json({ success: true, event });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to update calendar event" });
    }
  });

  app.delete("/api/calendar/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCalendarEvent(id);
      return res.json({ success });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to delete calendar event" });
    }
  });

  // 🔹 COLLABORATIONS
  app.get("/api/collab/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const collabs = await storage.getCollaborationsByUsername(username);
      return res.json({ success: true, collabs });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch collaborations" });
    }
  });

  app.post("/api/collab", async (req, res) => {
    try {
      const collab = await storage.createCollaboration(req.body);
      return res.json({ success: true, collab });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to create collaboration" });
    }
  });

  app.patch("/api/collab/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const collab = await storage.updateCollaboration(id, req.body);
      if (!collab) {
        return res.status(404).json({ error: "Collaboration not found" });
      }
      return res.json({ success: true, collab });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to update collaboration" });
    }
  });

  // 🔹 EXPORT JOBS
  app.get("/api/export/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const jobs = await storage.getExportJobsByUsername(username);
      return res.json({ success: true, jobs });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch export jobs" });
    }
  });

  app.post("/api/export", async (req, res) => {
    try {
      const job = await storage.createExportJob(req.body);
      return res.json({ success: true, job });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to create export job" });
    }
  });

  // 🔹 VIDEO COMPARISON
  app.post("/api/video/compare", async (req, res) => {
    try {
      const { videos, comparisonName, username } = req.body;
      
      if (!videos || !Array.isArray(videos) || videos.length < 2 || videos.length > 5) {
        return res.status(400).json({ 
          error: "Please provide 2-5 videos to compare" 
        });
      }

      if (!comparisonName || !username) {
        return res.status(400).json({ 
          error: "Missing comparison name or username" 
        });
      }

      console.log(`[BIAS] Comparing ${videos.length} videos for @${username}`);

      const videoAnalyses = videos.map((video: any, index: number) => {
        const hookScore = Math.floor(Math.random() * 30) + 50;
        const visualScore = Math.floor(Math.random() * 30) + 55;
        const audioScore = Math.floor(Math.random() * 30) + 60;
        const energyScore = Math.floor(Math.random() * 30) + 45;
        const viralScore = Math.floor((hookScore + visualScore + audioScore + energyScore) / 4);

        return {
          videoName: video.name,
          fileName: video.name,
          fileSize: video.size,
          hookScore,
          visualScore,
          audioScore,
          energyScore,
          viralScore,
          insights: {
            hook: hookScore < 60 
              ? ["First 3 detik terlalu slow - tidak ada pattern interrupt"] 
              : ["Hook cukup engaging, tapi bisa lebih strong"],
            visual: visualScore < 70 
              ? ["Lighting kurang optimal - wajah terlihat gelap"] 
              : ["Lighting cukup bagus, konsisten sepanjang video"],
            audio: audioScore < 70 
              ? ["Volume voice terlalu pelan - naikin 30%"] 
              : ["Voice clarity bagus, volume balance dengan musik proper"],
          },
          checklist: [
            {
              category: "Hook Optimization",
              items: [
                { done: hookScore >= 70, text: "Start dengan gerakan tiba-tiba atau loud sound" },
                { done: hookScore >= 60, text: "Opening line harus question atau shocking statement" },
              ],
            },
          ],
        };
      });

      const comparisonResults = {
        videos: videoAnalyses,
      };

      const openai = (await import("openai")).default;
      const client = process.env.OPENAI_API_KEY 
        ? new openai({ apiKey: process.env.OPENAI_API_KEY })
        : null;

      let bestPerformers: any[] = [];
      let weakestAreas: any[] = [];
      let crossLearnings: any[] = [];
      let aiRecommendations: any[] = [];

      if (client) {
        try {
          const prompt = `You are a TikTok video analytics expert. I have ${videos.length} videos with the following scores:

${videoAnalyses.map((v: any, i: number) => `
Video ${i + 1}: "${v.videoName}"
- Hook Score: ${v.hookScore}/100
- Visual Score: ${v.visualScore}/100
- Audio Score: ${v.audioScore}/100
- Energy Score: ${v.energyScore}/100
- Viral Score: ${v.viralScore}/100
`).join('\n')}

Provide a comprehensive comparison analysis in JSON format:
{
  "bestPerformers": [
    {"videoName": "name", "category": "hook/visual/audio/energy", "score": number, "reason": "why this excels"}
  ],
  "weakestAreas": [
    {"category": "hook/visual/audio/energy", "videos": ["video names"], "suggestions": "how to improve"}
  ],
  "crossLearnings": [
    {"from": "video name", "to": "video name", "lesson": "what to learn"}
  ],
  "aiRecommendations": [
    "specific actionable recommendation"
  ]
}`;

          const response = await client.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: "You are a TikTok video analytics expert. Provide specific, actionable insights based on video scores."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 2048,
          });

          const result = JSON.parse(response.choices[0].message.content || "{}");
          bestPerformers = result.bestPerformers || [];
          weakestAreas = result.weakestAreas || [];
          crossLearnings = result.crossLearnings || [];
          aiRecommendations = result.aiRecommendations || [];
        } catch (error) {
          console.error("[BIAS] AI comparison insights failed:", error);
        }
      }

      if (bestPerformers.length === 0) {
        const topVideo = videoAnalyses.reduce((max: any, v: any) => 
          v.viralScore > max.viralScore ? v : max
        );
        bestPerformers = [
          { 
            videoName: topVideo.videoName, 
            category: "overall", 
            score: topVideo.viralScore, 
            reason: "Highest overall viral score across all categories" 
          }
        ];
      }

      if (weakestAreas.length === 0) {
        weakestAreas = [
          {
            category: "hook",
            videos: videoAnalyses.filter((v: any) => v.hookScore < 60).map((v: any) => v.videoName),
            suggestions: "Focus on creating stronger pattern interrupts in the first 3 seconds"
          }
        ];
      }

      if (aiRecommendations.length === 0) {
        aiRecommendations = [
          "Analyze the top-performing video's hook strategy and apply similar techniques to other videos",
          "Maintain consistent lighting across all videos for better visual quality",
          "Balance music and voice levels - voice should be primary, music supporting"
        ];
      }

      const videoIds = videoAnalyses.map((v: any) => v.fileName);

      const comparison = await storage.createVideoComparison({
        tiktokUsername: username,
        comparisonName,
        videoCount: videos.length,
        videoIds: videoIds as any,
        comparisonResults: comparisonResults as any,
        bestPerformers: bestPerformers as any,
        weakestAreas: weakestAreas as any,
        crossLearnings: crossLearnings as any,
        aiRecommendations: aiRecommendations as any,
      });

      console.log(`[BIAS] Video comparison saved with ID: ${comparison.id}`);

      return res.json({
        success: true,
        comparisonId: comparison.id,
        comparisonResults,
        bestPerformers,
        weakestAreas,
        crossLearnings,
        aiRecommendations,
      });
    } catch (error: any) {
      console.error("[BIAS] Video comparison error:", error.message);
      return res.status(500).json({ error: "Failed to compare videos" });
    }
  });

  app.get("/api/video/comparisons/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const comparisons = await storage.getVideoComparisonsByUsername(username);
      return res.json({ success: true, comparisons });
    } catch (error: any) {
      return res.status(500).json({ error: "Failed to fetch video comparisons" });
    }
  });

  // 🔹 AI CHAT ENDPOINT (Streaming) - Powered by Google Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      // Set headers for SSE (Server-Sent Events)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      // Get comprehensive context from BIAS data
      let contextInfo = "";
      
      try {
        // 1. Recent trends
        const recentTrends = await storage.getAllTrends();
        if (recentTrends.length > 0) {
          const topTrends = recentTrends.slice(0, 5);
          contextInfo += `\n\n📊 Trending di TikTok sekarang:\n`;
          topTrends.forEach(t => {
            contextInfo += `- ${t.name} (${t.trendType}, Viral: ${t.viralScore}/100, Growth: ${t.growthVelocity}/100)\n`;
          });
        }

        // 2. Recent analyses (last 3)
        const allAnalyses = await storage.getAllAnalyses();
        if (allAnalyses.length > 0) {
          const recentAnalyses = allAnalyses.slice(0, 3);
          contextInfo += `\n\n📈 Analisis Profil Terbaru:\n`;
          recentAnalyses.forEach(a => {
            const avgScore = Math.round((a.visualScore + a.audioScore + a.energyScore + a.interactionScore) / 4);
            contextInfo += `- @${a.tiktokUsername} (${a.followers.toLocaleString()} followers, Behavioral Score: ${avgScore}/100)\n`;
          });

          // 3. Recent competitor comparisons (from recently analyzed profiles)
          if (recentAnalyses.length > 0) {
            const firstAnalyzedUsername = recentAnalyses[0].tiktokUsername;
            const competitors = await storage.getCompetitorsByUsername(firstAnalyzedUsername);
            if (competitors.length > 0) {
              const recentComps = competitors.slice(0, 2);
              contextInfo += `\n\n🎯 Analisis Kompetitor (@${firstAnalyzedUsername}):\n`;
              recentComps.forEach(c => {
                const avgCompScore = Math.round((c.visualScore + c.audioScore + c.energyScore + c.interactionScore) / 4);
                contextInfo += `- @${c.competitorUsername} (${c.followers.toLocaleString()} followers, Behavioral: ${avgCompScore}/100, Engagement: ${c.engagementRate || 0}%)\n`;
              });
            }
          }
        }
      } catch (e) {
        // Context is optional, continue even if some data is unavailable
        console.log("[BIAS] Chat context enrichment partial:", e);
      }

      const systemPrompt = `Kamu adalah BIAS AI, asisten cerdas untuk TikTok analytics dan strategi konten. 

Tugas kamu:
- Bantu creator TikTok dengan strategi growth, ide konten, dan analisis performa
- Berikan insights yang actionable dan spesifik
- Gunakan bahasa Indonesia yang casual dan friendly
- Fokus pada TikTok Indonesia market
- Berikan data dan contoh konkret kalau bisa

Kamu punya akses ke:
- Trend Radar (trending sounds & hashtags)
- Behavioral analysis (8-layer framework)
- Competitor intelligence
- Video analysis tools${contextInfo}

Jawab dengan ramah, helpful, dan to-the-point. Kalau perlu, suggest user untuk menggunakan fitur BIAS yang relevan.`;

      const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

      // Stream response from Gemini
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-exp",
        contents: fullPrompt,
      });

      // Flush headers to initiate streaming
      res.flushHeaders();

      for await (const chunk of stream) {
        const content = chunk.text || "";
        if (content) {
          const payload = JSON.stringify({ content });
          res.write(`data: ${payload}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[BIAS] Chat error:", error.message);
      
      // If stream already started, we can't send JSON error
      if (!res.headersSent) {
        return res.status(500).json({ error: "Failed to process chat message" });
      }
      
      res.end();
    }
  });

  // API status check
  app.get("/api/status", async (req, res) => {
    return res.json({
      status: "ok",
      service: "BIAS - Behavioral Intelligence Audit System",
      timestamp: new Date().toISOString(),
    });
  });

  // ✅ Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
