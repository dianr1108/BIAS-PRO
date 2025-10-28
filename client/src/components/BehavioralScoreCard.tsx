import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BehavioralScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon: LucideIcon;
  color: string;
  insight?: string;
  onClick?: () => void;
}

export function BehavioralScoreCard({
  title,
  score,
  maxScore = 100,
  icon: Icon,
  color,
  insight,
  onClick,
}: BehavioralScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const };
    if (score >= 60) return { label: "Good", variant: "secondary" as const };
    if (score >= 40) return { label: "Average", variant: "outline" as const };
    return { label: "Needs Work", variant: "destructive" as const };
  };

  const badge = getScoreBadge(score);

  return (
    <Card 
      className={`p-6 transition-all ${onClick ? 'cursor-pointer hover-elevate active-elevate-2' : 'hover-elevate'}`}
      onClick={onClick}
      data-testid={`card-behavioral-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold">{title}</h3>
            {onClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold font-mono tabular-nums" style={{ color }}>
              {score}
              <span className="text-sm text-muted-foreground font-normal">/{maxScore}</span>
            </p>
            <Badge variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          </div>
        </div>
      </div>
      <Progress value={percentage} className="h-2 mb-3" style={{ 
        backgroundColor: `${color}20`,
      }} />
      {insight && (
        <p className="text-xs text-muted-foreground line-clamp-2">{insight}</p>
      )}
      {onClick && (
        <p className="text-xs text-primary font-medium mt-2">
          Click untuk detail strategies →
        </p>
      )}
    </Card>
  );
}
