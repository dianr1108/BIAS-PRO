import { HistoricalChart } from "../HistoricalChart";

export default function HistoricalChartExample() {
  const mockData = [
    { date: "Jan 1", visual: 85, audio: 72, energy: 78 },
    { date: "Jan 8", visual: 88, audio: 75, energy: 82 },
    { date: "Jan 15", visual: 90, audio: 78, energy: 85 },
    { date: "Jan 22", visual: 92, audio: 78, energy: 88 },
  ];

  const dataKeys = [
    { key: "visual", name: "Visual", color: "hsl(348 90% 58%)" },
    { key: "audio", name: "Audio", color: "hsl(262 52% 58%)" },
    { key: "energy", name: "Energy", color: "hsl(38 92% 50%)" },
  ];

  return (
    <div className="p-8 bg-background">
      <div className="max-w-4xl">
        <HistoricalChart 
          data={mockData}
          title="Behavioral Metrics Trend"
          dataKeys={dataKeys}
          height={300}
        />
      </div>
    </div>
  );
}
