import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  icon?: LucideIcon;
  color?: string;
}

export function MetricCard({ title, value, trend, icon: Icon, color }: MetricCardProps) {
  const trendColor = trend?.direction === "up" ? "text-behavioral-linguistic" : "text-destructive";

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold font-mono tabular-nums" style={color ? { color } : undefined}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
              {trend.direction === "up" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-accent">
            <Icon className="h-5 w-5 text-accent-foreground" style={color ? { color } : undefined} />
          </div>
        )}
      </div>
    </Card>
  );
}
