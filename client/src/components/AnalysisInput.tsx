import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface AnalysisInputProps {
  onAnalyze: (input: string) => void;
  isLoading?: boolean;
}

export function AnalysisInput({ onAnalyze, isLoading = false }: AnalysisInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  return (
    <Card className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Analisis Perilaku Creator TikTok
          </h2>
          <p className="text-muted-foreground">
            Masukkan username TikTok atau URL profil untuk mendapatkan behavioral insights lengkap
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="@username atau https://www.tiktok.com/@username"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-base"
              disabled={isLoading}
              data-testid="input-tiktok-url"
            />
            <Button 
              type="submit" 
              size="default"
              disabled={isLoading || !input.trim()}
              data-testid="button-analyze"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Menganalisis..." : "Analisis"}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Tanpa login • Analisis data terbuka • Privacy-friendly
          </p>
        </form>
      </div>
    </Card>
  );
}
