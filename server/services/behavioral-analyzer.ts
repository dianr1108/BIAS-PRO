import type { TikTokProfile, BehavioralScore } from "@shared/schema";

export interface BehavioralAnalysis extends BehavioralScore {
  insights: {
    visual: string;
    audio: string;
    energy: string;
    interaction: string;
    linguistic: string;
    contextual: string;
    environmental: string;
    governance: string;
  };
}

export function analyzeBehavioralMetrics(profile: TikTokProfile): BehavioralAnalysis {
  const { followers, likes, videos, following, isVerified, bio, externalLinks } = profile;
  
  const avgLikesPerVideo = videos > 0 ? likes / videos : 0;
  const engagementRate = followers > 0 ? (avgLikesPerVideo / followers) * 100 : 0;
  const followerFollowingRatio = following && following > 0 ? followers / following : 0;
  const hasBio = !!bio && bio.length > 10;
  const externalLinksCount = externalLinks ? externalLinks.length : 0;
  
  const visualScore = calculateVisualScore(followers, videos, engagementRate, isVerified, hasBio);
  const audioScore = calculateAudioScore(followers, videos, isVerified);
  const energyScore = calculateEnergyScore(engagementRate, avgLikesPerVideo);
  const interactionScore = calculateInteractionScore(engagementRate, followers, followerFollowingRatio);
  const linguisticScore = calculateLinguisticScore(followers, videos, hasBio);
  const contextualScore = calculateContextualScore(engagementRate, followers, externalLinksCount);
  const environmentalScore = calculateEnvironmentalScore(followers, videos, isVerified, externalLinksCount);
  const governanceScore = calculateGovernanceScore(followers, likes, videos, engagementRate, followerFollowingRatio, isVerified);
  
  return {
    visual: visualScore,
    audio: audioScore,
    energy: energyScore,
    interaction: interactionScore,
    linguistic: linguisticScore,
    contextual: contextualScore,
    environmental: environmentalScore,
    governance: governanceScore,
    insights: {
      visual: generateVisualInsight(visualScore, videos),
      audio: generateAudioInsight(audioScore),
      energy: generateEnergyInsight(energyScore, engagementRate),
      interaction: generateInteractionInsight(interactionScore, engagementRate),
      linguistic: generateLinguisticInsight(linguisticScore),
      contextual: generateContextualInsight(contextualScore),
      environmental: generateEnvironmentalInsight(environmentalScore),
      governance: generateGovernanceInsight(governanceScore),
    },
  };
}

function calculateVisualScore(followers: number, videos: number, engagementRate: number, isVerified?: boolean, hasBio?: boolean): number {
  let score = 0;
  
  if (videos < 10) score += 20;
  else if (videos < 50) score += 40;
  else if (videos < 100) score += 60;
  else if (videos < 200) score += 75;
  else score += 85;
  
  if (followers < 1000) score = Math.min(score, 30);
  else if (followers < 10000) score = Math.min(score, 50);
  else if (followers < 100000) score = Math.min(score, 70);
  else if (followers > 1000000) score += 10;
  
  if (engagementRate > 5) score += 10;
  else if (engagementRate > 2) score += 5;
  else if (engagementRate < 0.5) score -= 10;
  
  if (isVerified) score += 5;
  if (hasBio) score += 3;
  
  return Math.min(100, Math.max(0, score));
}

function calculateAudioScore(followers: number, videos: number, isVerified?: boolean): number {
  let score = 0;
  
  if (videos < 20) score += 30;
  else if (videos < 50) score += 50;
  else if (videos < 100) score += 65;
  else if (videos < 200) score += 75;
  else score += 85;
  
  if (followers < 5000) score = Math.min(score, 35);
  else if (followers < 50000) score = Math.min(score, 55);
  else if (followers < 200000) score = Math.min(score, 70);
  else if (followers > 800000) score += 10;
  
  if (isVerified) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function calculateEnergyScore(engagementRate: number, avgLikesPerVideo: number): number {
  let score = 0;
  
  if (engagementRate < 0.5) score = 25;
  else if (engagementRate < 1) score = 40;
  else if (engagementRate < 3) score = 55;
  else if (engagementRate < 7) score = 70;
  else if (engagementRate < 12) score = 85;
  else score = 95;
  
  if (avgLikesPerVideo > 200000) score += 5;
  else if (avgLikesPerVideo > 50000) score += 3;
  else if (avgLikesPerVideo < 100) score -= 15;
  
  return Math.min(100, Math.max(0, score));
}

function calculateInteractionScore(engagementRate: number, followers: number, followerFollowingRatio?: number): number {
  let score = 0;
  
  if (engagementRate < 0.5) score = 20;
  else if (engagementRate < 1) score = 35;
  else if (engagementRate < 2) score = 50;
  else if (engagementRate < 5) score = 65;
  else if (engagementRate < 10) score = 80;
  else score = 95;
  
  if (followers > 500000) score += 5;
  else if (followers > 100000) score += 3;
  else if (followers < 1000) score -= 10;
  
  if (followerFollowingRatio && followerFollowingRatio > 2) score += 5;
  if (followerFollowingRatio && followerFollowingRatio > 10) score += 3;
  
  return Math.min(100, Math.max(0, score));
}

function calculateLinguisticScore(followers: number, videos: number, hasBio?: boolean): number {
  let score = 0;
  
  if (videos < 15) score = 30;
  else if (videos < 50) score = 50;
  else if (videos < 80) score = 65;
  else if (videos < 150) score = 75;
  else score = 85;
  
  if (followers < 10000) score = Math.min(score, 40);
  else if (followers < 100000) score = Math.min(score, 60);
  else if (followers > 1000000) score += 10;
  else if (followers > 300000) score += 5;
  
  if (hasBio) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function calculateContextualScore(engagementRate: number, followers: number, externalLinksCount?: number): number {
  let score = 0;
  
  if (engagementRate < 1) score = 35;
  else if (engagementRate < 2) score = 50;
  else if (engagementRate < 4) score = 65;
  else if (engagementRate < 8) score = 80;
  else score = 90;
  
  if (followers > 250000) score += 5;
  else if (followers < 5000) score -= 10;
  
  if (externalLinksCount && externalLinksCount > 0) score += 3;
  if (externalLinksCount && externalLinksCount >= 2) score += 2;
  
  return Math.min(100, Math.max(0, score));
}

function calculateEnvironmentalScore(followers: number, videos: number, isVerified?: boolean, externalLinksCount?: number): number {
  let score = 0;
  
  if (videos < 20) score = 40;
  else if (videos < 50) score = 55;
  else if (videos < 100) score = 70;
  else if (videos < 200) score = 80;
  else score = 90;
  
  if (followers > 500000) score += 5;
  else if (followers < 10000) score = Math.min(score, 45);
  
  if (isVerified) score += 5;
  if (externalLinksCount && externalLinksCount >= 2) score += 3;
  
  return Math.min(100, Math.max(0, score));
}

function calculateGovernanceScore(
  followers: number, 
  likes: number, 
  videos: number, 
  engagementRate: number,
  followerFollowingRatio?: number,
  isVerified?: boolean
): number {
  let score = 85;
  
  const likesToFollowerRatio = followers > 0 ? likes / followers : 0;
  
  if (likesToFollowerRatio > 100) score -= 5;
  if (likesToFollowerRatio > 200) score -= 10;
  
  if (engagementRate < 0.5) score -= 8;
  else if (engagementRate > 0.5 && engagementRate < 2) score += 5;
  
  if (videos < 10 && followers > 100000) score -= 15;
  
  if (followers > 1000000 && videos > 200 && engagementRate > 2) score += 5;
  
  if (isVerified) score += 10;
  
  if (followerFollowingRatio) {
    if (followerFollowingRatio < 0.5) score -= 10;
    else if (followerFollowingRatio > 5) score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

function generateVisualInsight(score: number, videos: number): string {
  if (score >= 85) {
    return "Exceptional visual quality with strong branding consistency and professional production values";
  } else if (score >= 70) {
    return "Strong visual engagement with consistent content quality and good thumbnail optimization";
  } else if (score >= 55) {
    return `Good visual presence, consider enhancing thumbnail design and ${videos < 100 ? "increasing content volume" : "refining editing techniques"}`;
  } else {
    return "Visual presentation needs improvement. Focus on better lighting, editing, and thumbnail creation";
  }
}

function generateAudioInsight(score: number): string {
  if (score >= 85) {
    return "Superior audio quality with excellent music selection and voice clarity";
  } else if (score >= 70) {
    return "Good audio clarity, maintain consistent sound levels and music integration";
  } else if (score >= 55) {
    return "Adequate audio quality, consider improving background music balance and voice recording";
  } else {
    return "Audio quality needs attention. Invest in better microphone and sound mixing";
  }
}

function generateEnergyInsight(score: number, engagement: number): string {
  if (score >= 85) {
    return `Exceptional energy and enthusiasm that drives ${engagement.toFixed(1)}% engagement rate`;
  } else if (score >= 70) {
    return "High energy content that resonates well with your target audience";
  } else if (score >= 55) {
    return "Moderate energy levels, consider increasing pacing and enthusiasm in delivery";
  } else {
    return "Energy levels are low. Boost your on-camera presence and content pacing";
  }
}

function generateInteractionInsight(score: number, engagement: number): string {
  if (score >= 85) {
    return `Outstanding audience interaction with ${engagement.toFixed(1)}% engagement rate`;
  } else if (score >= 70) {
    return "Excellent audience interaction and response rates, keep engaging with comments";
  } else if (score >= 55) {
    return "Good interaction patterns, increase call-to-actions and community engagement";
  } else {
    return "Interaction needs improvement. Add more questions, polls, and direct audience engagement";
  }
}

function generateLinguisticInsight(score: number): string {
  if (score >= 85) {
    return "Masterful communication with clear messaging and compelling storytelling";
  } else if (score >= 70) {
    return "Clear and effective messaging that connects with your audience";
  } else if (score >= 55) {
    return "Solid communication style, could enhance storytelling techniques and script quality";
  } else {
    return "Communication clarity needs work. Focus on simpler messages and better script preparation";
  }
}

function generateContextualInsight(score: number): string {
  if (score >= 85) {
    return "Perfectly aligned with current trends and audience interests, excellent timing";
  } else if (score >= 70) {
    return "Content aligns well with trends and audience preferences";
  } else if (score >= 55) {
    return "Moderate trend alignment, stay more current with platform trends and audience interests";
  } else {
    return "Content feels disconnected from current trends. Research popular topics and adapt faster";
  }
}

function generateEnvironmentalInsight(score: number): string {
  if (score >= 85) {
    return "Professional production environment with optimal lighting, settings, and equipment";
  } else if (score >= 70) {
    return "Well-maintained production quality with good lighting and clean backgrounds";
  } else if (score >= 55) {
    return "Decent production environment, consider upgrading lighting or background setup";
  } else {
    return "Production environment needs improvement. Invest in better lighting and background setup";
  }
}

function generateGovernanceInsight(score: number): string {
  if (score >= 85) {
    return "Excellent authenticity with organic growth patterns and genuine engagement";
  } else if (score >= 70) {
    return "Good governance metrics with authentic engagement patterns";
  } else if (score >= 55) {
    return "Some irregularities detected in growth patterns, monitor engagement authenticity";
  } else {
    return "Significant governance concerns detected. Review your growth strategies for authenticity";
  }
}

export function detectGovernanceAlerts(
  followers: number,
  likes: number,
  videos: number,
  behavioralScores: BehavioralScore
): string[] {
  const alerts: string[] = [];
  
  const likesToFollowerRatio = followers > 0 ? likes / followers : 0;
  if (likesToFollowerRatio > 150) {
    alerts.push("Unusually high like-to-follower ratio detected");
  }
  
  if (videos < 15 && followers > 200000) {
    alerts.push("Low content volume for follower count may indicate purchased followers");
  }
  
  if (behavioralScores.governance < 60) {
    alerts.push("Below-average governance score requires attention");
  }
  
  const avgEngagement = (behavioralScores.interaction + behavioralScores.energy) / 2;
  if (avgEngagement < 50 && followers > 100000) {
    alerts.push("Low engagement relative to follower count");
  }
  
  return alerts;
}
