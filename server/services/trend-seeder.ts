import { storage } from "../storage";

export async function seedTrends() {
  const existingTrends = await storage.getAllTrends();
  
  if (existingTrends.length > 0) {
    console.log(`[BIAS] Trends already seeded (${existingTrends.length} trends)`);
    return;
  }

  console.log("[BIAS] Seeding viral trends...");

  const mockTrends = [
    {
      trendType: "sound",
      name: "Cupid - FIFTY FIFTY (Sped Up)",
      description: "Viral K-pop sound trending across dance & lip-sync videos",
      viralScore: 95,
      growthVelocity: 85,
      peakPrediction: 7,
      saturationLevel: 45,
      totalVideos: 2500000,
      totalViews: 18000000000,
      avgEngagement: 8,
      bestPostingTimes: ["18:00-20:00", "12:00-14:00", "21:00-23:00"] as any,
      topCreators: [
        { username: "charlidamelio", followers: 152000000 },
        { username: "addisonre", followers: 88000000 },
        { username: "bellapoarch", followers: 93000000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 92,
      opportunityLevel: "High",
      recommendations: [
        "Post dance challenges antara jam 6-8 malam",
        "Combo dengan trending hashtag #CupidChallenge",
        "Target audience Gen Z (13-25 tahun)"
      ] as any,
    },
    {
      trendType: "hashtag",
      name: "#CapCut",
      description: "Video editing showcase trending in tutorial & creative content",
      viralScore: 88,
      growthVelocity: 72,
      peakPrediction: 14,
      saturationLevel: 65,
      totalVideos: 8900000,
      totalViews: 45000000000,
      avgEngagement: 7,
      bestPostingTimes: ["20:00-22:00", "10:00-12:00"] as any,
      topCreators: [
        { username: "zachking", followers: 73000000 },
        { username: "khabylame", followers: 159000000 },
        { username: "spencerx", followers: 55000000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 85,
      opportunityLevel: "Medium-High",
      recommendations: [
        "Buat tutorial edit yang simple tapi eye-catching",
        "Showcase before/after effects",
        "Target creator community"
      ] as any,
    },
    {
      trendType: "sound",
      name: "Monkeys Spinning Monkeys",
      description: "Comedy & funny moment background music viral di FYP",
      viralScore: 82,
      growthVelocity: 68,
      peakPrediction: 10,
      saturationLevel: 55,
      totalVideos: 1200000,
      totalViews: 8500000000,
      avgEngagement: 9,
      bestPostingTimes: ["19:00-21:00", "13:00-15:00"] as any,
      topCreators: [
        { username: "jamescharles", followers: 38000000 },
        { username: "brentrivera", followers: 47000000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 78,
      opportunityLevel: "High",
      recommendations: [
        "Perfect untuk comedy skits & pranks",
        "Timing upload: weekend evenings untuk max reach",
        "Combo dengan reaction videos"
      ] as any,
    },
    {
      trendType: "hashtag",
      name: "#BookTok",
      description: "Book recommendations & reviews community trend",
      viralScore: 76,
      growthVelocity: 45,
      peakPrediction: 30,
      saturationLevel: 70,
      totalVideos: 650000,
      totalViews: 3200000000,
      avgEngagement: 6,
      bestPostingTimes: ["21:00-23:00", "09:00-11:00"] as any,
      topCreators: [
        { username: "abookutopia", followers: 1200000 },
        { username: "jackbenedwards", followers: 980000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 72,
      opportunityLevel: "Medium",
      recommendations: [
        "Niche audience tapi very engaged",
        "Best untuk long-form storytelling content",
        "Target book lovers & students"
      ] as any,
    },
    {
      trendType: "sound",
      name: "Aesthetic Lofi Beat Mix",
      description: "Chill background music untuk study/work content",
      viralScore: 70,
      growthVelocity: 38,
      peakPrediction: 20,
      saturationLevel: 80,
      totalVideos: 950000,
      totalViews: 4500000000,
      avgEngagement: 5,
      bestPostingTimes: ["22:00-00:00", "07:00-09:00"] as any,
      topCreators: [
        { username: "studywithme", followers: 2300000 },
        { username: "productivity", followers: 1800000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 68,
      opportunityLevel: "Medium-Low",
      recommendations: [
        "Perfect untuk vlog & lifestyle content",
        "Target students & young professionals",
        "Slow burn tapi stable engagement"
      ] as any,
    },
    {
      trendType: "hashtag",
      name: "#GetReadyWithMe",
      description: "Morning/evening routine & outfit showcases",
      viralScore: 93,
      growthVelocity: 80,
      peakPrediction: 5,
      saturationLevel: 50,
      totalVideos: 3400000,
      totalViews: 22000000000,
      avgEngagement: 8,
      bestPostingTimes: ["07:00-09:00", "18:00-20:00"] as any,
      topCreators: [
        { username: "emmachamberlain", followers: 16000000 },
        { username: "avani", followers: 42000000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 90,
      opportunityLevel: "Very High",
      recommendations: [
        "Showcase personality + style = viral combo",
        "Upload sesuai routine time (morning/evening)",
        "Target fashion & lifestyle audience"
      ] as any,
    },
    {
      trendType: "sound",
      name: "Originalton - DJ Mix 2024",
      description: "Electronic dance music trending di club/party content",
      viralScore: 85,
      growthVelocity: 75,
      peakPrediction: 8,
      saturationLevel: 40,
      totalVideos: 1800000,
      totalViews: 12000000000,
      avgEngagement: 7,
      bestPostingTimes: ["20:00-23:00", "14:00-16:00"] as any,
      topCreators: [
        { username: "charlidamelio", followers: 152000000 },
        { username: "dixiedamelio", followers: 57000000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 82,
      opportunityLevel: "High",
      recommendations: [
        "Perfect untuk dance challenges",
        "Prime time: weekend nights",
        "Target party & nightlife community"
      ] as any,
    },
    {
      trendType: "hashtag",
      name: "#FoodTok",
      description: "Cooking recipes, food reviews, mukbang content",
      viralScore: 90,
      growthVelocity: 70,
      peakPrediction: 12,
      saturationLevel: 60,
      totalVideos: 4200000,
      totalViews: 28000000000,
      avgEngagement: 9,
      bestPostingTimes: ["11:00-13:00", "18:00-20:00"] as any,
      topCreators: [
        { username: "gordonramsayofficial", followers: 34000000 },
        { username: "emmymade", followers: 5200000 }
      ] as any,
      contentExamples: [] as any,
      relevanceScore: 88,
      opportunityLevel: "Very High",
      recommendations: [
        "Post saat meal times untuk max hunger appeal",
        "Quick recipes (<60 sec) perform best",
        "Target foodies & home cooks"
      ] as any,
    },
  ];

  for (const trend of mockTrends) {
    await storage.createTrend(trend);
  }

  console.log(`[BIAS] Successfully seeded ${mockTrends.length} viral trends`);
}
