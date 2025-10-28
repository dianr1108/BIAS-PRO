import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, DollarSign, Zap, Target, Users, Award, Calendar, Lightbulb, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AnalysisData {
  profile: {
    username: string;
    followers: number;
    videos: number;
    likes: number;
    isVerified?: boolean;
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
  };
}

export default function GrowthStrategies() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    }
    setIsLoading(false);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg text-muted-foreground">Memuat strategies...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Analisis Diperlukan</h2>
          <p className="text-muted-foreground mb-6">Silakan analisis profil TikTok terlebih dahulu</p>
          <Link href="/">
            <Button data-testid="button-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profile, behavioral } = data;

  const getNextMilestone = (followers: number) => {
    if (followers < 1000) return { target: 1000, label: "1K" };
    if (followers < 10000) return { target: 10000, label: "10K" };
    if (followers < 50000) return { target: 50000, label: "50K" };
    if (followers < 100000) return { target: 100000, label: "100K" };
    if (followers < 500000) return { target: 500000, label: "500K" };
    return { target: 1000000, label: "1M" };
  };

  const milestone = getNextMilestone(profile.followers);
  const progressToMilestone = (profile.followers / milestone.target) * 100;
  const followersNeeded = milestone.target - profile.followers;

  const averageScore = Object.values(behavioral.scores).reduce((a, b) => a + b, 0) / 8;

  const getMonetizationReadiness = () => {
    const hasMinFollowers = profile.followers >= 1000;
    const hasGoodEngagement = averageScore >= 60;
    const isVerifiedPlus = profile.isVerified;
    
    let score = 0;
    let requirements = [];
    let ready = [];

    if (hasMinFollowers) {
      score += 40;
      ready.push("✓ Followers sudah mencukupi (1K+)");
    } else {
      requirements.push(`Butuh ${1000 - profile.followers} followers lagi untuk live gift`);
    }

    if (hasGoodEngagement) {
      score += 40;
      ready.push("✓ Engagement rate bagus");
    } else {
      requirements.push("Tingkatkan behavioral scores (rata-rata >60)");
    }

    if (profile.followers >= 10000) {
      score += 10;
      ready.push("✓ Eligible untuk Creator Fund");
    }

    if (isVerifiedPlus) {
      score += 10;
      ready.push("✓ Verified account (kredibilitas tinggi)");
    }

    return { score, requirements, ready };
  };

  const monetization = getMonetizationReadiness();

  const getBrandDealValue = () => {
    const baseRate = 50000;
    const followersMultiplier = profile.followers / 10000;
    const qualityMultiplier = averageScore / 50;
    
    const minValue = Math.floor(baseRate * followersMultiplier * qualityMultiplier);
    const maxValue = Math.floor(minValue * 1.5);
    
    return { min: minValue.toLocaleString('id-ID'), max: maxValue.toLocaleString('id-ID') };
  };

  const brandDealValue = getBrandDealValue();

  const getWeeklyTasks = () => {
    const tasks = [];
    
    if (behavioral.scores.visual < 70) {
      tasks.push({
        day: "Senin",
        task: "Buat 3 thumbnail template di Canva dengan color palette consistent",
        impact: "high",
        time: "60 menit",
      });
    }

    if (behavioral.scores.energy < 70) {
      tasks.push({
        day: "Selasa",
        task: "Record 5 video dengan hook energetic di 3 detik pertama",
        impact: "high",
        time: "90 menit",
      });
    }

    if (behavioral.scores.interaction < 70) {
      tasks.push({
        day: "Rabu",
        task: "Reply 100 comment dengan voice reply - 60 menit pertama after posting",
        impact: "high",
        time: "30 menit",
      });
    }

    tasks.push({
      day: "Kamis",
      task: "Research 5 trending hashtag di niche Anda (TikTok Creative Center)",
      impact: "medium",
      time: "30 menit",
    });

    if (profile.followers >= 1000) {
      tasks.push({
        day: "Jumat",
        task: "Live streaming 30-45 menit - setup 3 polls untuk engagement",
        impact: "high",
        time: "45 menit",
      });
    }

    tasks.push({
      day: "Sabtu",
      task: "Analyze top 3 performing video - extract winning formula",
      impact: "high",
      time: "45 menit",
    });

    tasks.push({
      day: "Minggu",
      task: "Content planning - prepare 7 video ideas untuk minggu depan",
      impact: "medium",
      time: "60 menit",
    });

    return tasks.slice(0, 7);
  };

  const weeklyTasks = getWeeklyTasks();

  const getViralFormula = () => {
    const strengths: string[] = [];
    const improvements: string[] = [];

    Object.entries(behavioral.scores).forEach(([key, value]) => {
      if (value >= 70) {
        strengths.push(key);
      } else if (value < 50) {
        improvements.push(key);
      }
    });

    return {
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
    };
  };

  const viralFormula = getViralFormula();

  const getContentIdeas = () => {
    const ideas = [];
    
    if (behavioral.scores.visual >= 70) {
      ideas.push("Tutorial: 'How I Edit Thumbnails yang Viral' (leverage visual strength)");
    }
    
    if (behavioral.scores.energy >= 70) {
      ideas.push("Challenge video: High-energy content yang engaging (capitalize on energy)");
    }
    
    ideas.push("Trend-jacking: Ambil trending sound + twist dengan niche Anda");
    ideas.push("Behind-the-scenes: Process creating content (build connection)");
    ideas.push("Q&A from comments: Jawab 10 pertanyaan most asked (engagement boost)");
    ideas.push("'Day in the life' vlog style - relatable content");
    ideas.push("Tips & tricks series (Part 1, 2, 3) - build anticipation");
    ideas.push("Duet/Stitch video viral di niche Anda - piggyback reach");
    
    return ideas.slice(0, 8);
  };

  const contentIdeas = getContentIdeas();

  const getGrowthProjection = () => {
    const currentGrowthRate = 0.15;
    const day7 = Math.floor(profile.followers * (1 + currentGrowthRate * 0.3));
    const day30 = Math.floor(profile.followers * (1 + currentGrowthRate));
    const day90 = Math.floor(profile.followers * (1 + currentGrowthRate * 2.5));
    
    return { day7, day30, day90 };
  };

  const projection = getGrowthProjection();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/analysis">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Analisis
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Strategi Pertumbuhan</h1>
          <p className="text-muted-foreground">Roadmap konkret untuk scale @{profile.username}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Milestone Selanjutnya</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">{milestone.label}</span>
                  <span className="text-sm text-muted-foreground">followers</span>
                </div>
                <Progress value={progressToMilestone} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{followersNeeded.toLocaleString('id-ID')}</span> followers lagi
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-semibold">Nilai Brand Deal</h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  Rp {brandDealValue.min} - {brandDealValue.max}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimasi per post/campaign
                </p>
                <Badge variant="secondary" className="mt-2">
                  {profile.followers >= 10000 ? "Siap untuk brand" : "Tingkatkan followers"}
                </Badge>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-semibold">Skor Rata-rata</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold font-mono">
                  {averageScore.toFixed(0)}<span className="text-lg text-muted-foreground">/100</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Di semua 8 layer behavioral
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Kesiapan Monetisasi
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Kesiapan Keseluruhan</span>
                  <span className="text-2xl font-bold font-mono">{monetization.score}%</span>
                </div>
                <Progress value={monetization.score} className="h-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {monetization.ready.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                      ✓ Ready:
                    </h3>
                    <ul className="space-y-1.5">
                      {monetization.ready.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {monetization.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                      ⚡ Action Required:
                    </h3>
                    <ul className="space-y-1.5">
                      {monetization.requirements.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Proyeksi Pertumbuhan (Berdasarkan Momentum Saat Ini)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">7 Days</p>
                <p className="text-2xl font-bold font-mono">+{(projection.day7 - profile.followers).toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {projection.day7.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">30 Days</p>
                <p className="text-2xl font-bold font-mono">+{(projection.day30 - profile.followers).toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {projection.day30.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">90 Days</p>
                <p className="text-2xl font-bold font-mono">+{(projection.day90 - profile.followers).toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {projection.day90.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Projection based on current content quality & consistency. Implement strategies below untuk accelerate growth!
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Rencana Aksi Mingguan
            </h2>
            <div className="space-y-3">
              {weeklyTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-lg hover-elevate border border-border"
                >
                  <div className="flex-shrink-0 w-20">
                    <Badge variant="outline">{task.day}</Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{task.task}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>⏱️ {task.time}</span>
                      <span>•</span>
                      <Badge 
                        variant={task.impact === "high" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {task.impact === "high" ? "Dampak Tinggi" : "Dampak Sedang"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Formula Viral Kamu
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
                  ✓ Manfaatkan Kekuatan Ini:
                </h3>
                <div className="space-y-2">
                  {viralFormula.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm capitalize">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">
                  ⚡ Tingkatkan Area Ini:
                </h3>
                <div className="space-y-2">
                  {viralFormula.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      <span className="text-sm capitalize">{improvement}</span>
                    </div>
                  ))}
                  {viralFormula.improvements.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Semua area sudah bagus! Maintain consistency.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Content Ideas (Viral-Ready)
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {contentIdeas.map((idea, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg border border-border hover-elevate cursor-pointer"
                >
                  <p className="text-sm">{idea}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Next Steps untuk Scale
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Implement Weekly Action Plan di atas</p>
                  <p className="text-sm text-muted-foreground">Consistency is key - stick to schedule!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Focus on improvement areas dari Viral Formula</p>
                  <p className="text-sm text-muted-foreground">Click behavioral layers di Analysis page untuk detailed tips</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Create content dari Content Ideas list</p>
                  <p className="text-sm text-muted-foreground">Minimum 1-2 video per hari untuk consistent growth</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Re-analyze setiap minggu untuk track progress</p>
                  <p className="text-sm text-muted-foreground">Monitor improvement & adjust strategy based on data</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <AIAssistantWidget />
    </div>
  );
}
