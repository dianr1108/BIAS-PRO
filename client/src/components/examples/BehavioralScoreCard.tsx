import { BehavioralScoreCard } from "../BehavioralScoreCard";
import { Eye, Mic } from "lucide-react";

export default function BehavioralScoreCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <BehavioralScoreCard
          title="Visual Performance"
          score={92}
          icon={Eye}
          color="hsl(348 90% 58%)"
          insight="Strong visual engagement with consistent branding and high-quality thumbnails"
        />
        <BehavioralScoreCard
          title="Audio Quality"
          score={78}
          icon={Mic}
          color="hsl(262 52% 58%)"
          insight="Good audio clarity, consider improving background music balance"
        />
      </div>
    </div>
  );
}
