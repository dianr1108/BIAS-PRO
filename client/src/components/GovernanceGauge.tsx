import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";

interface GovernanceGaugeProps {
  score: number;
  maxScore?: number;
  alerts?: string[];
}

export function GovernanceGauge({ score, maxScore = 100, alerts = [] }: GovernanceGaugeProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(142 76% 45%)";
    if (score >= 60) return "hsl(38 92% 50%)";
    return "hsl(0 84% 48%)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const hasAlerts = alerts.length > 0;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${scoreColor}20` }}>
          <Shield className="h-6 w-6" style={{ color: scoreColor }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">Governance Integrity</h3>
          <p className="text-sm text-muted-foreground">Bot detection & engagement patterns</p>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.827} 282.7`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold font-mono tabular-nums" style={{ color: scoreColor }}>
                {score}
              </p>
              <p className="text-sm text-muted-foreground">/{maxScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <Badge 
          variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
          className="gap-2"
        >
          {score >= 80 ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}
          {scoreLabel}
        </Badge>
      </div>

      {hasAlerts && (
        <div className="border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Detected Patterns:</p>
          <ul className="space-y-1">
            {alerts.map((alert, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0 text-behavioral-governance" />
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
