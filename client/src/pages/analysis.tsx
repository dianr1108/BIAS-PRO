import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { MetricCard } from "@/components/MetricCard";
import { BehavioralScoreCard } from "@/components/BehavioralScoreCard";
import { GovernanceGauge } from "@/components/GovernanceGauge";
import { RadarChart } from "@/components/RadarChart";
import { InsightsPanel } from "@/components/InsightsPanel";
import { HistoricalChart } from "@/components/HistoricalChart";
import { LayerDetailDrawer } from "@/components/LayerDetailDrawer";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { getLayerInsights } from "@/lib/layerInsights";
import { Users, Heart, Video, Eye, Mic, Zap, MessageCircle, FileText, Globe, Trees, Shield, TrendingUp, Target, Rocket, Film, Radio, Users2, BarChart3, Calendar, UserPlus, Download, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AnalysisData {
  analysisId: string;
  profile: {
    username: string;
    nickname: string;
    bio?: string;
    avatarUrl?: string;
    isVerified?: boolean;
    followers: number;
    following?: number;
    likes: number;
    videos: number;
    externalLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  behavioral: {
    scores: {
      visual: number;
      audio: number;
      energy: number;
      interaction: number;
      linguistic: number;
      contextual: number;
      environmental: number;
      governance: number;
    };
    insights: {
      visual: string;
      audio: string;
      energy: string;
      interaction: string;
      linguistic: string;
      contextual: string;
      environmental: string;
      governance: string;
    };
  };
  aiInsights: Array<{
    type: "strength" | "opportunity" | "alert";
    title: string;
    description: string;
  }>;
  governanceAlerts: string[];
}

export default function Analysis() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<{
    name: string;
    score: number;
    color: string;
    icon: React.ElementType;
    insights: any;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedData = localStorage.getItem("latestAnalysis");
    if (loadedData) {
      try {
        const parsed = JSON.parse(loadedData);
        setData(parsed);
      } catch (error) {
        console.error("Failed to parse analysis data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data analisis",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Analisis Tidak Ditemukan",
        description: "Silakan lakukan analisis terlebih dahulu",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg text-muted-foreground">Memuat analisis...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tidak Ada Data Analisis</h2>
          <p className="text-muted-foreground mb-6">Silakan analisis profil TikTok terlebih dahulu</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profile, behavioral, aiInsights, governanceAlerts } = data;

  const avgLikesPerVideo = profile.videos > 0 ? profile.likes / profile.videos : 0;
  const engagementRate = profile.followers > 0 ? (avgLikesPerVideo / profile.followers) * 100 : 0;

  const radarData = [
    { category: "Visual", value: behavioral.scores.visual, fullMark: 100 },
    { category: "Audio", value: behavioral.scores.audio, fullMark: 100 },
    { category: "Energy", value: behavioral.scores.energy, fullMark: 100 },
    { category: "Interaction", value: behavioral.scores.interaction, fullMark: 100 },
    { category: "Linguistic", value: behavioral.scores.linguistic, fullMark: 100 },
    { category: "Contextual", value: behavioral.scores.contextual, fullMark: 100 },
    { category: "Environmental", value: behavioral.scores.environmental, fullMark: 100 },
    { category: "Governance", value: behavioral.scores.governance, fullMark: 100 },
  ];

  const historicalData = [
    { 
      date: "Week 1", 
      visual: Math.max(0, behavioral.scores.visual - 7), 
      audio: Math.max(0, behavioral.scores.audio - 6),
      energy: Math.max(0, behavioral.scores.energy - 7),
      governance: Math.max(0, behavioral.scores.governance - 5),
    },
    { 
      date: "Week 2", 
      visual: Math.max(0, behavioral.scores.visual - 4), 
      audio: Math.max(0, behavioral.scores.audio - 3),
      energy: Math.max(0, behavioral.scores.energy - 3),
      governance: Math.max(0, behavioral.scores.governance - 3),
    },
    { 
      date: "Week 3", 
      visual: Math.max(0, behavioral.scores.visual - 2), 
      audio: behavioral.scores.audio,
      energy: behavioral.scores.energy,
      governance: Math.max(0, behavioral.scores.governance - 1),
    },
    { 
      date: "Current", 
      visual: behavioral.scores.visual, 
      audio: behavioral.scores.audio,
      energy: behavioral.scores.energy,
      governance: behavioral.scores.governance,
    },
  ];

  const historicalDataKeys = [
    { key: "visual", name: "Visual", color: "hsl(348 90% 58%)" },
    { key: "audio", name: "Audio", color: "hsl(262 52% 58%)" },
    { key: "energy", name: "Energy", color: "hsl(38 92% 50%)" },
    { key: "governance", name: "Governance", color: "hsl(24 85% 55%)" },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleExport = () => {
    toast({
      title: "Fitur Export",
      description: "Fitur export segera hadir!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Fitur Share",
      description: "Fitur share segera hadir!",
    });
  };

  const handleLayerClick = (
    layerName: string,
    score: number,
    color: string,
    icon: React.ElementType
  ) => {
    const insights = getLayerInsights(layerName, score, {
      followers: profile.followers,
      videos: profile.videos,
      isVerified: profile.isVerified,
      bio: profile.bio,
    });

    setSelectedLayer({
      name: layerName,
      score,
      color,
      icon,
      insights,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <ProfileHeader
            username={profile.username}
            nickname={profile.nickname}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            isVerified={profile.isVerified}
            followers={profile.followers}
            following={profile.following}
            likes={profile.likes}
            videos={profile.videos}
            externalLinks={profile.externalLinks}
            timestamp="just now"
            onExport={handleExport}
            onShare={handleShare}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Followers"
              value={formatNumber(profile.followers)}
              trend={{ value: 12.5, direction: "up" }}
              icon={Users}
            />
            <MetricCard
              title="Total Likes"
              value={formatNumber(profile.likes)}
              trend={{ value: 8.3, direction: "up" }}
              icon={Heart}
            />
            <MetricCard
              title="Total Video"
              value={profile.videos.toString()}
              icon={Video}
            />
            <MetricCard
              title="Rata-rata Engagement"
              value={`${engagementRate.toFixed(1)}%`}
              icon={TrendingUp}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RadarChart 
                data={radarData} 
                title="Analisis Behavioral 8-Layer"
                height={400}
              />
            </div>
            <div>
              <GovernanceGauge 
                score={behavioral.scores.governance}
                alerts={governanceAlerts}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Rincian Behavioral</h2>
            <p className="text-sm text-muted-foreground mb-4">Click pada setiap layer untuk mendapat detailed strategies & actionable insights</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <BehavioralScoreCard
                title="Visual Performance"
                score={behavioral.scores.visual}
                icon={Eye}
                color="hsl(348 90% 58%)"
                insight={behavioral.insights.visual}
                onClick={() => handleLayerClick("Visual Performance", behavioral.scores.visual, "hsl(348 90% 58%)", Eye)}
              />
              <BehavioralScoreCard
                title="Audio Quality"
                score={behavioral.scores.audio}
                icon={Mic}
                color="hsl(262 52% 58%)"
                insight={behavioral.insights.audio}
                onClick={() => handleLayerClick("Audio Quality", behavioral.scores.audio, "hsl(262 52% 58%)", Mic)}
              />
              <BehavioralScoreCard
                title="Energy Level"
                score={behavioral.scores.energy}
                icon={Zap}
                color="hsl(38 92% 50%)"
                insight={behavioral.insights.energy}
                onClick={() => handleLayerClick("Energy Level", behavioral.scores.energy, "hsl(38 92% 50%)", Zap)}
              />
              <BehavioralScoreCard
                title="Interaction"
                score={behavioral.scores.interaction}
                icon={MessageCircle}
                color="hsl(217 91% 60%)"
                insight={behavioral.insights.interaction}
                onClick={() => handleLayerClick("Interaction", behavioral.scores.interaction, "hsl(217 91% 60%)", MessageCircle)}
              />
              <BehavioralScoreCard
                title="Linguistic"
                score={behavioral.scores.linguistic}
                icon={FileText}
                color="hsl(142 76% 45%)"
                insight={behavioral.insights.linguistic}
                onClick={() => handleLayerClick("Linguistic", behavioral.scores.linguistic, "hsl(142 76% 45%)", FileText)}
              />
              <BehavioralScoreCard
                title="Contextual"
                score={behavioral.scores.contextual}
                icon={Globe}
                color="hsl(280 70% 60%)"
                insight={behavioral.insights.contextual}
                onClick={() => handleLayerClick("Contextual", behavioral.scores.contextual, "hsl(280 70% 60%)", Globe)}
              />
              <BehavioralScoreCard
                title="Environmental"
                score={behavioral.scores.environmental}
                icon={Trees}
                color="hsl(190 70% 50%)"
                insight={behavioral.insights.environmental}
                onClick={() => handleLayerClick("Environmental", behavioral.scores.environmental, "hsl(190 70% 50%)", Trees)}
              />
              <BehavioralScoreCard
                title="Governance"
                score={behavioral.scores.governance}
                icon={Shield}
                color="hsl(24 85% 55%)"
                insight={behavioral.insights.governance}
                onClick={() => handleLayerClick("Governance", behavioral.scores.governance, "hsl(24 85% 55%)", Shield)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HistoricalChart
                data={historicalData}
                title="Tren Performa (Data Simulasi)"
                dataKeys={historicalDataKeys}
                height={300}
              />
            </div>
            <div>
              <InsightsPanel insights={aiInsights} />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Fitur & Tools Lanjutan</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Growth Strategies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Roadmap lengkap, monetization tracker, content ideas & weekly action plan!
                    </p>
                    <Link href="/growth-strategies">
                      <Button className="gap-2 w-full" data-testid="button-growth-strategies">
                        <Target className="h-4 w-4" />
                        Lihat Strategies
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Film className="h-5 w-5 text-amber-500" />
                      Video Analyzer
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      AI-powered feedback: hook, visual, audio, body language & editing checklist!
                    </p>
                    <Link href="/video-analyzer">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-video-analyzer">
                        <Film className="h-4 w-4" />
                        Analyze Video
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <GitCompareArrows className="h-5 w-5 text-orange-500" />
                      Video Comparison
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bandingkan 2-5 video, identifikasi yang terbaik & dapatkan cross-learnings!
                    </p>
                    <Link href="/video-comparison">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-video-comparison">
                        <GitCompareArrows className="h-4 w-4" />
                        Compare Videos
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-red-500/20 bg-red-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Radio className="h-5 w-5 text-red-500" />
                      Live Stream Analyzer
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze live streams: peak viewers, gifts, retention, chat analysis!
                    </p>
                    <Link href="/livestream-analyzer">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-livestream">
                        <Radio className="h-4 w-4" />
                        Analyze Stream
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-blue-500/20 bg-blue-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Users2 className="h-5 w-5 text-blue-500" />
                      Competitor Dashboard
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Side-by-side comparison, content gaps & competitive advantages!
                    </p>
                    <Link href="/competitor-dashboard">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-competitor">
                        <Users2 className="h-4 w-4" />
                        Compare
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-green-500/20 bg-green-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Trend Radar
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Viral sounds, hashtags, best posting times & opportunity level!
                    </p>
                    <Link href="/trend-radar">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-trends">
                        <TrendingUp className="h-4 w-4" />
                        View Trends
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-purple-500/20 bg-purple-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      Analytics History
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Time-series charts, milestone detection & growth tracking!
                    </p>
                    <Link href="/analytics-history">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-history">
                        <BarChart3 className="h-4 w-4" />
                        View History
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-pink-500/20 bg-pink-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-pink-500" />
                      Content Calendar
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Schedule viral content, track posts & viral score predictions!
                    </p>
                    <Link href="/content-calendar">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-calendar">
                        <Calendar className="h-4 w-4" />
                        Open Calendar
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-cyan-500" />
                      Collab Finder
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find matching creators, collab ideas & track partnerships!
                    </p>
                    <Link href="/collab-finder">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-collab">
                        <UserPlus className="h-4 w-4" />
                        Find Collabs
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-orange-500/20 bg-orange-500/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Download className="h-5 w-5 text-orange-500" />
                      Export Reports
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export analysis data to PDF/Excel for presentations & reports!
                    </p>
                    <Link href="/export-reports">
                      <Button variant="outline" className="gap-2 w-full" data-testid="button-export">
                        <Download className="h-4 w-4" />
                        Export Data
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {selectedLayer && (
        <LayerDetailDrawer
          isOpen={!!selectedLayer}
          onClose={() => setSelectedLayer(null)}
          layer={selectedLayer}
        />
      )}
      
      <AIAssistantWidget />
    </div>
  );
}
