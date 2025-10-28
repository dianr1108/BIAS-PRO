import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface Insight {
  type: "strength" | "opportunity" | "alert";
  title: string;
  description: string;
}

interface InsightsPanelProps {
  insights: Insight[];
  title?: string;
}

export function InsightsPanel({ insights, title = "AI-Powered Insights" }: InsightsPanelProps) {
  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "strength":
        return <TrendingUp className="h-4 w-4 text-behavioral-linguistic" />;
      case "opportunity":
        return <Lightbulb className="h-4 w-4 text-behavioral-energy" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-behavioral-governance" />;
    }
  };

  const getInsightBadge = (type: Insight["type"]) => {
    switch (type) {
      case "strength":
        return <Badge variant="default" className="bg-behavioral-linguistic/10 text-behavioral-linguistic border-behavioral-linguistic/20">Strength</Badge>;
      case "opportunity":
        return <Badge variant="default" className="bg-behavioral-energy/10 text-behavioral-energy border-behavioral-energy/20">Opportunity</Badge>;
      case "alert":
        return <Badge variant="default" className="bg-behavioral-governance/10 text-behavioral-governance border-behavioral-governance/20">Alert</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        {title}
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="border-l-2 pl-4 py-2" style={{
            borderColor: insight.type === "strength" ? "hsl(142 76% 45%)" :
                         insight.type === "opportunity" ? "hsl(38 92% 50%)" :
                         "hsl(24 85% 55%)"
          }}>
            <div className="flex items-start gap-3 mb-2">
              {getInsightIcon(insight.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  {getInsightBadge(insight.type)}
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
