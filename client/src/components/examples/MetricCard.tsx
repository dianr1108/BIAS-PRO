import { MetricCard } from "../MetricCard";
import { Users } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
        <MetricCard
          title="Followers"
          value="1.2M"
          trend={{ value: 12.5, direction: "up" }}
          icon={Users}
        />
        <MetricCard
          title="Governance Score"
          value="87"
          trend={{ value: 3.2, direction: "up" }}
          color="hsl(142 76% 45%)"
        />
      </div>
    </div>
  );
}
