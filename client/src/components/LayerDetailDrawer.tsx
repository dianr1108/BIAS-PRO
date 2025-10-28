import { X, CheckCircle2, AlertCircle, Lightbulb, Target, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LayerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  layer: {
    name: string;
    score: number;
    color: string;
    icon: React.ElementType;
    insights: {
      description: string;
      strengths: string[];
      opportunities: string[];
      quickWins: string[];
      examples: {
        dos: string[];
        donts: string[];
      };
      templates?: string[];
      benchmarks?: {
        poor: number;
        average: number;
        good: number;
        excellent: number;
      };
    };
  };
}

export function LayerDetailDrawer({ isOpen, onClose, layer }: LayerDetailDrawerProps) {
  if (!isOpen) return null;

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "hsl(142 76% 45%)" };
    if (score >= 60) return { label: "Good", color: "hsl(217 91% 60%)" };
    if (score >= 40) return { label: "Average", color: "hsl(38 92% 50%)" };
    return { label: "Needs Improvement", color: "hsl(348 90% 58%)" };
  };

  const scoreLevel = getScoreLevel(layer.score);
  const Icon = layer.icon;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        data-testid="drawer-overlay"
      />
      
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-background z-50 shadow-2xl overflow-y-auto transform transition-transform">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${layer.color}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: layer.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-layer-name">{layer.name}</h2>
                <p className="text-sm text-muted-foreground">Detailed Analysis & Strategies</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              data-testid="button-close-drawer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold font-mono" data-testid="text-layer-score">
                    {layer.score}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <Badge 
                  className="mt-1"
                  style={{ 
                    backgroundColor: `${scoreLevel.color}20`,
                    color: scoreLevel.color,
                    borderColor: scoreLevel.color
                  }}
                  data-testid="badge-score-level"
                >
                  {scoreLevel.label}
                </Badge>
              </div>
            </div>
            <Progress value={layer.score} className="h-2" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="p-4">
            <p className="text-sm leading-relaxed text-foreground">{layer.insights.description}</p>
          </Card>

          {layer.insights.benchmarks && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Industry Benchmarks
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poor:</span>
                  <span className="font-mono">0-{layer.insights.benchmarks.poor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average:</span>
                  <span className="font-mono">{layer.insights.benchmarks.poor + 1}-{layer.insights.benchmarks.average}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Good:</span>
                  <span className="font-mono">{layer.insights.benchmarks.average + 1}-{layer.insights.benchmarks.good}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Excellent:</span>
                  <span className="font-mono">{layer.insights.benchmarks.good + 1}-100</span>
                </div>
              </div>
            </Card>
          )}

          {layer.insights.strengths.length > 0 && (
            <Card className="p-4" data-testid="section-strengths">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {layer.insights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {layer.insights.opportunities.length > 0 && (
            <Card className="p-4" data-testid="section-opportunities">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Growth Opportunities
              </h3>
              <ul className="space-y-2">
                {layer.insights.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {layer.insights.quickWins.length > 0 && (
            <Card className="p-4 border-primary/20 bg-primary/5" data-testid="section-quick-wins">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Wins (Mulai Sekarang!)
              </h3>
              <ul className="space-y-2">
                {layer.insights.quickWins.map((win, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{win}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Best Practices
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                  ✓ Do This:
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {layer.insights.examples.dos.map((item, index) => (
                    <li key={index} className="text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  ✗ Avoid This:
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {layer.insights.examples.donts.map((item, index) => (
                    <li key={index} className="text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {layer.insights.templates && layer.insights.templates.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Templates & Formulas
              </h3>
              <div className="space-y-3">
                {layer.insights.templates.map((template, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-mono">{template}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="pt-4 border-t">
            <Button 
              onClick={onClose}
              className="w-full"
              data-testid="button-implement-strategies"
            >
              Implement These Strategies
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
