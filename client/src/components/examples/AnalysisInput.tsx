import { AnalysisInput } from "../AnalysisInput";

export default function AnalysisInputExample() {
  return (
    <div className="p-8 bg-background">
      <AnalysisInput 
        onAnalyze={(input) => console.log("Analyzing:", input)} 
        isLoading={false}
      />
    </div>
  );
}
