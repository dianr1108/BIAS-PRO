import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { AnalysisInput } from "@/components/AnalysisInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, Target, MessageCircle, Sparkles, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzedProfile, setHasAnalyzedProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has analyzed any profile before
    const latestAnalysis = localStorage.getItem("latestAnalysis");
    if (latestAnalysis) {
      setHasAnalyzedProfile(true);
    }
  }, []);

  const handleAnalyze = async (input: string) => {
    setIsAnalyzing(true);
    
    try {
      const response = await apiRequest("POST", "/api/analyze", { input });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      toast({
        title: "Analisis Selesai",
        description: `Berhasil menganalisis @${data.profile.username}`,
      });

      localStorage.setItem("latestAnalysis", JSON.stringify(data));
      setHasAnalyzedProfile(true);
      setLocation("/analysis");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analisis Gagal",
        description: error instanceof Error ? error.message : "Gagal menganalisis profil TikTok",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAIChatClick = () => {
    if (!hasAnalyzedProfile) {
      toast({
        title: "Analisis Profil Dulu",
        description: "Silahkan masukkan akun TikTok untuk dianalisis terlebih dahulu sebelum chat dengan AI Assistant.",
        variant: "default",
      });
    } else {
      setLocation("/ai-discussion");
    }
  };

  const features = [
    {
      icon: Target,
      title: "Analisis 8-Layer",
      description: "Evaluasi perilaku lengkap mencakup dimensi Visual, Audio, Energy, Interaksi, Linguistik, Kontekstual, Lingkungan, dan Governance"
    },
    {
      icon: Shield,
      title: "Integritas Governance",
      description: "Deteksi bot canggih dan analisis pola engagement untuk memastikan pertumbuhan creator yang autentik"
    },
    {
      icon: Zap,
      title: "Insights Bertenaga AI",
      description: "Rekomendasi otomatis dan behavioral intelligence untuk optimasi performa creator"
    },
    {
      icon: TrendingUp,
      title: "Tracking Performa",
      description: "Monitor konsistensi behavioral dan evolusi metrik dari waktu ke waktu"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            BIAS
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Behavioral Intelligence Audit System
          </p>
          <p className="text-sm text-muted-foreground">
            Platform analytics canggih untuk TikTok creator dan live streamer
          </p>
        </div>

        <div className="mb-8">
          <AnalysisInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* AI Discussion Feature */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-primary/20">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <h3 className="text-lg font-bold">Diskusi AI - Asisten TikTok Cerdas</h3>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat langsung dengan AI tentang strategi viral, ide konten, analisis performa, dan tips growth TikTok. Unlimited & 100% GRATIS!
                </p>
                <Button className="gap-2" onClick={handleAIChatClick} data-testid="button-ai-discussion">
                  <MessageCircle className="h-4 w-4" />
                  Mulai Chat dengan AI
                </Button>
              </div>
            </div>
          </Card>

          {/* Glossary Feature */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background border-blue-500/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-blue-500/20">
                <Book className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <h3 className="text-lg font-bold">Perpustakaan Istilah</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Kamus lengkap 35+ istilah TikTok, analisis video, dan slang viral terkini. Lengkap dengan penjelasan, efek, dan keunggulan setiap istilah!
                </p>
                <Link href="/glossary">
                  <Button variant="outline" className="gap-2 border-blue-500/20 hover:bg-blue-500/10" data-testid="button-glossary">
                    <Book className="h-4 w-4" />
                    Buka Perpustakaan
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover-elevate transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Analisis data terbuka • Tanpa login • Privacy-friendly</p>
        </div>
      </div>
    </div>
  );
}
