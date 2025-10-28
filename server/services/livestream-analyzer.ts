import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LiveStreamMetrics {
  duration: number;
  peakViewers: number;
  avgViewers: number;
  totalViews: number;
  totalGifts: number;
  giftValue: number;
  totalComments: number;
  totalShares: number;
  retentionRate: number;
  engagementScore: number;
  energyScore: number;
  interactionScore: number;
  audioQuality: number;
  peakMoments: Array<{
    timestamp: number;
    type: string;
    description: string;
    viewerCount: number;
  }>;
  giftPatterns: Array<{
    timeRange: string;
    giftCount: number;
    totalValue: number;
    avgValue: number;
  }>;
  chatAnalysis: {
    totalMessages: number;
    avgMessagesPerMinute: number;
    sentiment: string;
    topKeywords: string[];
    engagementPeaks: string[];
  };
}

export async function analyzeLiveStream(
  fileName: string,
  fileSize: number,
  duration: number,
  username: string
): Promise<{ metrics: LiveStreamMetrics; aiInsights: any[] }> {
  const metrics = generateMockMetrics(duration);
  
  const aiInsights = await generateLiveStreamInsights(
    username,
    duration,
    metrics
  );

  return { metrics, aiInsights };
}

function generateMockMetrics(duration: number): LiveStreamMetrics {
  const baseViewers = Math.floor(Math.random() * 5000) + 500;
  const peakMultiplier = 1.5 + Math.random() * 1.5;
  const peakViewers = Math.floor(baseViewers * peakMultiplier);
  const avgViewers = Math.floor((baseViewers + peakViewers) / 2);
  const totalViews = Math.floor(avgViewers * (duration / 60) * 1.3);
  
  const giftRate = 0.05 + Math.random() * 0.15;
  const totalGifts = Math.floor(totalViews * giftRate);
  const avgGiftValue = 50 + Math.random() * 200;
  const giftValue = Math.floor(totalGifts * avgGiftValue);
  
  const totalComments = Math.floor(totalViews * (0.1 + Math.random() * 0.2));
  const totalShares = Math.floor(totalViews * (0.01 + Math.random() * 0.03));
  
  const retentionRate = Math.floor(40 + Math.random() * 45);
  const engagementScore = Math.floor(50 + Math.random() * 45);
  const energyScore = Math.floor(55 + Math.random() * 40);
  const interactionScore = Math.floor(60 + Math.random() * 35);
  const audioQuality = Math.floor(70 + Math.random() * 25);
  
  const numPeakMoments = Math.floor(duration / 180) + 2;
  const peakMoments = Array.from({ length: numPeakMoments }, (_, i) => {
    const timestamp = Math.floor((duration / numPeakMoments) * i) + Math.floor(Math.random() * 60);
    const types = ["Gift Spike", "Viewer Surge", "Chat Explosion", "Interaction Peak"];
    const type = types[Math.floor(Math.random() * types.length)];
    const viewerBoost = 1.2 + Math.random() * 0.5;
    
    return {
      timestamp,
      type,
      description: generatePeakDescription(type),
      viewerCount: Math.floor(avgViewers * viewerBoost),
    };
  });
  
  const numGiftPatterns = Math.floor(duration / 300) + 1;
  const giftPatterns = Array.from({ length: numGiftPatterns }, (_, i) => {
    const start = Math.floor((duration / numGiftPatterns) * i);
    const end = Math.floor((duration / numGiftPatterns) * (i + 1));
    const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
    const giftsInRange = Math.floor(totalGifts / numGiftPatterns);
    
    return {
      timeRange,
      giftCount: giftsInRange,
      totalValue: Math.floor(giftsInRange * avgGiftValue),
      avgValue: Math.floor(avgGiftValue + (Math.random() - 0.5) * 50),
    };
  });
  
  const chatAnalysis = {
    totalMessages: totalComments,
    avgMessagesPerMinute: Math.floor(totalComments / (duration / 60)),
    sentiment: retentionRate > 70 ? "Very Positive" : retentionRate > 50 ? "Positive" : "Mixed",
    topKeywords: generateTopKeywords(),
    engagementPeaks: peakMoments.slice(0, 3).map(p => `${formatTime(p.timestamp)} - ${p.type}`),
  };

  return {
    duration,
    peakViewers,
    avgViewers,
    totalViews,
    totalGifts,
    giftValue,
    totalComments,
    totalShares,
    retentionRate,
    engagementScore,
    energyScore,
    interactionScore,
    audioQuality,
    peakMoments,
    giftPatterns,
    chatAnalysis,
  };
}

function generatePeakDescription(type: string): string {
  const descriptions: Record<string, string[]> = {
    "Gift Spike": [
      "Heavy gifting activity detected",
      "Audience showing strong appreciation",
      "Multiple high-value gifts received",
    ],
    "Viewer Surge": [
      "Significant viewer increase",
      "Content going viral in recommendations",
      "Peak audience engagement moment",
    ],
    "Chat Explosion": [
      "Chat extremely active",
      "High interaction from audience",
      "Strong community engagement",
    ],
    "Interaction Peak": [
      "Maximum audience participation",
      "Questions and responses flowing",
      "Community highly engaged",
    ],
  };
  
  const options = descriptions[type] || ["Engagement peak detected"];
  return options[Math.floor(Math.random() * options.length)];
}

function generateTopKeywords(): string[] {
  const keywords = [
    "lucu", "keren", "bagus", "mantap", "hebat",
    "seru", "amazing", "love", "best", "top",
    "viral", "trending", "fire", "goat", "legend"
  ];
  
  return keywords
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function generateLiveStreamInsights(
  username: string,
  duration: number,
  metrics: LiveStreamMetrics
): Promise<any[]> {
  try {
    const prompt = `Analyze this TikTok Live Stream performance for @${username}:

Duration: ${Math.floor(duration / 60)} minutes
Peak Viewers: ${metrics.peakViewers.toLocaleString()}
Average Viewers: ${metrics.avgViewers.toLocaleString()}
Total Gifts: ${metrics.totalGifts.toLocaleString()} (Rp ${metrics.giftValue.toLocaleString()})
Retention Rate: ${metrics.retentionRate}%
Engagement Score: ${metrics.engagementScore}/100
Chat Activity: ${metrics.chatAnalysis.avgMessagesPerMinute} messages/min

Generate 4-5 actionable AI insights focusing on:
1. Stream performance highlights
2. Revenue optimization opportunities
3. Engagement improvement strategies
4. Best practices for next live stream
5. Audience retention tactics

Format as JSON array with: {type: "strength"/"opportunity"/"alert", title: string, description: string}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content || "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return generateFallbackInsights(metrics);
  } catch (error) {
    console.error("Error generating live stream insights:", error);
    return generateFallbackInsights(metrics);
  }
}

function generateFallbackInsights(metrics: LiveStreamMetrics): any[] {
  const insights = [];

  if (metrics.retentionRate > 70) {
    insights.push({
      type: "strength",
      title: "Excellent Audience Retention",
      description: `${metrics.retentionRate}% retention rate menunjukkan konten yang sangat engaging. Audience betah nonton sampai akhir!`
    });
  }

  if (metrics.giftValue > 100000) {
    insights.push({
      type: "strength",
      title: "Strong Monetization Performance",
      description: `Rp ${metrics.giftValue.toLocaleString()} dari gifts menunjukkan audience yang generous dan loyal. Keep engaging dengan mereka!`
    });
  } else {
    insights.push({
      type: "opportunity",
      title: "Monetization Opportunity",
      description: "Tingkatkan gift revenue dengan lebih sering acknowledge gifters, buat special shoutouts, dan add interactive elements."
    });
  }

  if (metrics.engagementScore < 60) {
    insights.push({
      type: "alert",
      title: "Boost Audience Interaction",
      description: "Engagement bisa lebih tinggi! Coba lebih banyak Q&A, polls, challenges, atau games untuk keep audience involved."
    });
  }

  if (metrics.peakViewers / metrics.avgViewers > 2) {
    insights.push({
      type: "opportunity",
      title: "Maintain Peak Momentum",
      description: `Peak viewers ${metrics.peakViewers} vs avg ${metrics.avgViewers}. Analyze what content triggered the spike dan replicate it more often!`
    });
  }

  insights.push({
    type: "opportunity",
    title: "Optimal Stream Duration",
    description: metrics.duration < 1800 
      ? "Consider streaming longer (30+ mins) untuk maximize reach dan gifts. Sweet spot biasanya 45-60 menit."
      : "Duration sudah optimal! Maintain consistency dengan schedule reguler untuk build loyal audience."
  });

  return insights.slice(0, 5);
}
