import { InsightsPanel } from "../InsightsPanel";

export default function InsightsPanelExample() {
  const mockInsights = [
    {
      type: "strength" as const,
      title: "Exceptional Visual Consistency",
      description: "Maintains strong brand identity across all content with consistent color schemes and editing style. This builds audience recognition and trust."
    },
    {
      type: "opportunity" as const,
      title: "Optimize Posting Schedule",
      description: "Analytics suggest posting at 7-9 PM could increase engagement by 24% based on audience activity patterns."
    },
    {
      type: "alert" as const,
      title: "Engagement Rate Decline",
      description: "15% drop in comment interactions over the past week. Consider more engaging CTAs and community questions."
    }
  ];

  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl">
        <InsightsPanel insights={mockInsights} />
      </div>
    </div>
  );
}
