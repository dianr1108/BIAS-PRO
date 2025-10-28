import { GovernanceGauge } from "../GovernanceGauge";

export default function GovernanceGaugeExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <GovernanceGauge 
          score={87} 
          alerts={[]} 
        />
        <GovernanceGauge 
          score={64} 
          alerts={[
            "Slight follower spike detected on Jan 15",
            "Engagement rate within normal range"
          ]} 
        />
      </div>
    </div>
  );
}
