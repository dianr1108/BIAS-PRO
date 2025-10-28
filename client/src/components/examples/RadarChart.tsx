import { RadarChart } from "../RadarChart";

export default function RadarChartExample() {
  const mockData = [
    { category: "Visual", value: 92, fullMark: 100 },
    { category: "Audio", value: 78, fullMark: 100 },
    { category: "Energy", value: 85, fullMark: 100 },
    { category: "Interaction", value: 88, fullMark: 100 },
    { category: "Linguistic", value: 75, fullMark: 100 },
    { category: "Contextual", value: 82, fullMark: 100 },
    { category: "Environmental", value: 90, fullMark: 100 },
    { category: "Governance", value: 87, fullMark: 100 },
  ];

  return (
    <div className="p-8 bg-background">
      <div className="max-w-2xl">
        <RadarChart 
          data={mockData} 
          title="8-Layer Behavioral Analysis"
          height={400}
        />
      </div>
    </div>
  );
}
