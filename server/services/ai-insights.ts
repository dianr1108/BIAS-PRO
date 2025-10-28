import OpenAI from "openai";
import type { TikTokProfile, BehavioralScore, Insight } from "@shared/schema";
import type { BehavioralAnalysis } from "./behavioral-analyzer";

// Reference: blueprint:javascript_openai
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateAIInsights(
  profile: TikTokProfile,
  behavioralAnalysis: BehavioralAnalysis
): Promise<Insight[]> {
  if (!openai) {
    console.warn("[BIAS] OpenAI API key not configured, using fallback insights");
    return generateFallbackInsights(behavioralAnalysis);
  }

  try {
    const prompt = `You are an expert TikTok analytics consultant. Analyze this creator profile and provide 3-4 key insights.

Creator Profile:
- Username: @${profile.username}
- Followers: ${profile.followers.toLocaleString()}
- Total Likes: ${profile.likes.toLocaleString()}
- Videos: ${profile.videos}

Behavioral Scores (0-100):
- Visual Performance: ${behavioralAnalysis.visual}
- Audio Quality: ${behavioralAnalysis.audio}
- Energy Level: ${behavioralAnalysis.energy}
- Interaction: ${behavioralAnalysis.interaction}
- Linguistic: ${behavioralAnalysis.linguistic}
- Contextual: ${behavioralAnalysis.contextual}
- Environmental: ${behavioralAnalysis.environmental}
- Governance: ${behavioralAnalysis.governance}

Based on these metrics, provide 3-4 actionable insights. Each insight should be categorized as:
- "strength" for things they're doing well
- "opportunity" for growth opportunities
- "alert" for concerns that need attention

Respond in JSON format with this structure:
{
  "insights": [
    {
      "type": "strength" | "opportunity" | "alert",
      "title": "Brief title (max 6 words)",
      "description": "Detailed explanation (1-2 sentences)"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a TikTok analytics expert specializing in creator behavioral analysis. Provide specific, actionable insights based on metrics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("AI insights generation failed:", error);
    return generateFallbackInsights(behavioralAnalysis);
  }
}

function generateFallbackInsights(behavioralAnalysis: BehavioralAnalysis): Insight[] {
  const insights: Insight[] = [];
  
  const scores = [
    { name: "visual", value: behavioralAnalysis.visual },
    { name: "audio", value: behavioralAnalysis.audio },
    { name: "energy", value: behavioralAnalysis.energy },
    { name: "interaction", value: behavioralAnalysis.interaction },
    { name: "linguistic", value: behavioralAnalysis.linguistic },
    { name: "contextual", value: behavioralAnalysis.contextual },
    { name: "environmental", value: behavioralAnalysis.environmental },
    { name: "governance", value: behavioralAnalysis.governance },
  ];
  
  const topScore = scores.reduce((max, score) => score.value > max.value ? score : max);
  if (topScore.value >= 80) {
    insights.push({
      type: "strength",
      title: `Exceptional ${topScore.name.charAt(0).toUpperCase() + topScore.name.slice(1)} Performance`,
      description: behavioralAnalysis.insights[topScore.name as keyof typeof behavioralAnalysis.insights]
    });
  }
  
  const lowestScore = scores.reduce((min, score) => score.value < min.value ? score : min);
  if (lowestScore.value < 70) {
    insights.push({
      type: "opportunity",
      title: `Improve ${lowestScore.name.charAt(0).toUpperCase() + lowestScore.name.slice(1)}`,
      description: behavioralAnalysis.insights[lowestScore.name as keyof typeof behavioralAnalysis.insights]
    });
  }
  
  if (behavioralAnalysis.governance < 75) {
    insights.push({
      type: "alert",
      title: "Monitor Governance Metrics",
      description: behavioralAnalysis.insights.governance
    });
  }
  
  const avgScore = scores.reduce((sum, score) => sum + score.value, 0) / scores.length;
  if (avgScore >= 75 && insights.length < 3) {
    insights.push({
      type: "strength",
      title: "Strong Overall Performance",
      description: `Consistent quality across all behavioral dimensions with an average score of ${avgScore.toFixed(0)}/100`
    });
  }
  
  return insights;
}
