import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Plus, X, TrendingUp, Users, Target, 
  Lightbulb, AlertTriangle, Search, BarChart3, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BehavioralScores {
  visualScore: number;
  audioScore: number;
  energyScore: number;
  interactionScore: number;
  linguisticScore: number;
  contextualScore: number;
  environmentalScore: number;
  governanceScore: number;
}

interface Competitor extends BehavioralScores {
  id: string;
  competitorUsername: string;
  competitorNickname: string;
  competitorBio?: string;
  competitorAvatarUrl?: string;
  followers: number;
  videos: number;
  likes: number;
  growthRate?: number;
  engagementRate?: number;
  postingFrequency?: number;
  avgLikesPerVideo?: number;
  avgViewsPerVideo?: number;
  historicalMetrics?: any[];
  contentThemes?: string[];
  topFormats?: string[];
  postingSchedule?: any[];
  strengths?: any[];
  weaknesses?: any[];
}

interface MainAccount extends BehavioralScores {
  id: string;
  username: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  followers: number;
  videos: number;
  likes: number;
  engagementRate: number;
  avgLikesPerVideo: number;
  isMainAccount: true;
}

interface ComparisonData {
  mainAccount: MainAccount;
  competitors: Competitor[];
  comparativeInsights: any[];
  metricLeaders?: any;
  overallRecommendations?: any[];
}

export default function CompetitorDashboard() {
  const [competitorInputs, setCompetitorInputs] = useState<string[]>([""]);
  const [mainUsername, setMainUsername] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedData = localStorage.getItem("latestAnalysis");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.profile?.username) {
          setMainUsername(data.profile.username);
        }
      } catch (e) {
        console.error("Failed to parse latest analysis");
      }
    }
  }, []);

  const { data: comparisonData, isLoading } = useQuery<ComparisonData>({
    queryKey: ['/api/competitor/comparison', mainUsername],
    queryFn: async () => {
      const response = await fetch(`/api/competitor/comparison/${mainUsername}`);
      if (!response.ok) throw new Error('Failed to fetch comparison');
      const data = await response.json();
      return data;
    },
    enabled: !!mainUsername,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest('POST', '/api/competitor/analyze', { 
        mainUsername, 
        competitorUsername: username 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/competitor/comparison', mainUsername] });
      toast({
        title: "Analisis Berhasil",
        description: "Competitor berhasil ditambahkan!",
      });
    },
    onError: () => {
      toast({
        title: "Analisis Gagal",
        description: "Gagal menganalisis competitor",
        variant: "destructive",
      });
    },
  });

  const handleAddInput = () => {
    if (competitorInputs.length < 5) {
      setCompetitorInputs([...competitorInputs, ""]);
    }
  };

  const handleRemoveInput = (index: number) => {
    setCompetitorInputs(competitorInputs.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...competitorInputs];
    newInputs[index] = value;
    setCompetitorInputs(newInputs);
  };

  const handleAnalyzeCompetitor = (username: string) => {
    if (!username.trim()) {
      toast({
        title: "Username Diperlukan",
        description: "Masukkan username TikTok competitor",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate(username.trim().replace('@', ''));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 70) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  const getRadarData = (account: BehavioralScores) => [
    { category: "Visual", value: account.visualScore, fullMark: 100 },
    { category: "Audio", value: account.audioScore, fullMark: 100 },
    { category: "Energy", value: account.energyScore, fullMark: 100 },
    { category: "Interaction", value: account.interactionScore, fullMark: 100 },
    { category: "Linguistic", value: account.linguisticScore, fullMark: 100 },
    { category: "Contextual", value: account.contextualScore, fullMark: 100 },
    { category: "Environmental", value: account.environmentalScore, fullMark: 100 },
    { category: "Governance", value: account.governanceScore, fullMark: 100 },
  ];

  const mainAccount = comparisonData?.mainAccount;
  const competitors = comparisonData?.competitors || [];
  const comparativeInsights = comparisonData?.comparativeInsights || [];
  const metricLeaders = comparisonData?.metricLeaders || {};
  const overallRecommendations = comparisonData?.overallRecommendations || [];

  const allAccounts = mainAccount ? [mainAccount, ...competitors] : competitors;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/analysis">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard Perbandingan Kompetitor</h1>
          <p className="text-muted-foreground">
            Analisis lengkap performa akun Anda vs kompetitor di berbagai aspek
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Tambah Competitor</h3>
          <div className="space-y-3">
            {competitorInputs.map((input, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`@username_competitor_${idx + 1}`}
                  value={input}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAnalyzeCompetitor(input);
                    }
                  }}
                  data-testid={`input-competitor-${idx}`}
                />
                <Button
                  onClick={() => handleAnalyzeCompetitor(input)}
                  disabled={analyzeMutation.isPending}
                  data-testid={`button-analyze-${idx}`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Analisis
                </Button>
                {competitorInputs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInput(idx)}
                    data-testid={`button-remove-${idx}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {competitorInputs.length < 5 && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={handleAddInput}
              data-testid="button-add-competitor"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Competitor (Maks. 5)
            </Button>
          )}
        </Card>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {!isLoading && competitors.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum Ada Competitor</h3>
            <p className="text-muted-foreground">
              Mulai dengan menambahkan username competitor untuk membandingkan performa
            </p>
          </Card>
        )}

        {!isLoading && competitors.length > 0 && mainAccount && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto" data-testid="tabs-list">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="behavioral" data-testid="tab-behavioral">
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Behavioral</span>
              </TabsTrigger>
              <TabsTrigger value="growth" data-testid="tab-growth">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Growth</span>
              </TabsTrigger>
              <TabsTrigger value="content" data-testid="tab-content">
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="insights" data-testid="tab-insights">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6" data-testid="panel-overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Akun</CardDescription>
                    <CardTitle className="text-3xl">{allAccounts.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      1 akun utama + {competitors.length} kompetitor
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Followers</CardDescription>
                    <CardTitle className="text-3xl">
                      {formatNumber(allAccounts.reduce((sum, acc) => sum + acc.followers, 0))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Gabungan semua akun
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Avg Engagement</CardDescription>
                    <CardTitle className="text-3xl">
                      {(allAccounts.reduce((sum, acc) => sum + (acc.engagementRate || 0), 0) / allAccounts.length).toFixed(1)}%
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Rata-rata engagement rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tabel Perbandingan Lengkap</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Akun</th>
                        <th className="text-right p-3 font-semibold">Followers</th>
                        <th className="text-right p-3 font-semibold">Videos</th>
                        <th className="text-right p-3 font-semibold">Likes</th>
                        <th className="text-right p-3 font-semibold">Engagement</th>
                        <th className="text-right p-3 font-semibold">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAccounts.map((acc, idx) => {
                        const isMain = 'isMainAccount' in acc && acc.isMainAccount;
                        const username = isMain ? acc.username : (acc as Competitor).competitorUsername;
                        const nickname = isMain ? acc.nickname : (acc as Competitor).competitorNickname;
                        const avatarUrl = isMain ? acc.avatarUrl : (acc as Competitor).competitorAvatarUrl;
                        const growthRate = isMain ? 0 : (acc as Competitor).growthRate || 0;

                        const isFollowersLeader = metricLeaders.followers === username;
                        const isEngagementLeader = metricLeaders.engagement === username;

                        return (
                          <tr 
                            key={acc.id} 
                            className={`border-b hover-elevate ${isMain ? 'bg-primary/5' : ''}`}
                            data-testid={`row-account-${idx}`}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={avatarUrl} />
                                  <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold flex items-center gap-2">
                                    @{username}
                                    {isMain && <Badge variant="default">Akun Utama</Badge>}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{nickname}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-right font-mono tabular-nums">
                              <div className="flex items-center justify-end gap-2">
                                {formatNumber(acc.followers)}
                                {isFollowersLeader && <Award className="h-4 w-4 text-amber-500" />}
                              </div>
                            </td>
                            <td className="p-3 text-right font-mono tabular-nums">{acc.videos}</td>
                            <td className="p-3 text-right font-mono tabular-nums">{formatNumber(acc.likes)}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Badge variant={getScoreBadgeVariant(acc.engagementRate || 0)}>
                                  {(acc.engagementRate || 0).toFixed(1)}%
                                </Badge>
                                {isEngagementLeader && <Award className="h-4 w-4 text-amber-500" />}
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              {growthRate > 0 && (
                                <div className="flex items-center justify-end gap-1">
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                  <span className="font-semibold text-green-500">+{growthRate}%</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: BEHAVIORAL ANALYSIS */}
            <TabsContent value="behavioral" className="space-y-6" data-testid="panel-behavioral">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allAccounts.map((acc, idx) => {
                  const isMain = 'isMainAccount' in acc && acc.isMainAccount;
                  const username = isMain ? acc.username : (acc as Competitor).competitorUsername;
                  const nickname = isMain ? acc.nickname : (acc as Competitor).competitorNickname;
                  
                  return (
                    <Card key={acc.id} className="p-6" data-testid={`card-behavioral-${idx}`}>
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          @{username}
                          {isMain && <Badge variant="default">Akun Utama</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground">{nickname}</p>
                      </div>

                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={getRadarData(acc)}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis 
                            dataKey="category" 
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                          />
                          <Radar
                            name={username}
                            dataKey="value"
                            stroke={isMain ? "hsl(var(--primary))" : "hsl(var(--chart-2))"}
                            fill={isMain ? "hsl(var(--primary))" : "hsl(var(--chart-2))"}
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>

                      <div className="mt-4 space-y-2">
                        {[
                          { label: "Visual", score: acc.visualScore },
                          { label: "Audio", score: acc.audioScore },
                          { label: "Energy", score: acc.energyScore },
                          { label: "Interaction", score: acc.interactionScore },
                          { label: "Linguistic", score: acc.linguisticScore },
                          { label: "Contextual", score: acc.contextualScore },
                          { label: "Environmental", score: acc.environmentalScore },
                          { label: "Governance", score: acc.governanceScore },
                        ].map(({ label, score }) => (
                          <div key={label} className="flex items-center justify-between text-sm">
                            <span>{label}</span>
                            <span className={`font-semibold ${getScoreColor(score)}`}>
                              {score}/100
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Perbandingan 8-Layer Behavioral Scores</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-behavioral-scores">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Akun</th>
                        <th className="text-center p-3 font-semibold">Visual</th>
                        <th className="text-center p-3 font-semibold">Audio</th>
                        <th className="text-center p-3 font-semibold">Energy</th>
                        <th className="text-center p-3 font-semibold">Interact</th>
                        <th className="text-center p-3 font-semibold">Linguistic</th>
                        <th className="text-center p-3 font-semibold">Context</th>
                        <th className="text-center p-3 font-semibold">Environ</th>
                        <th className="text-center p-3 font-semibold">Govern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAccounts.map((acc, idx) => {
                        const isMain = 'isMainAccount' in acc && acc.isMainAccount;
                        const username = isMain ? acc.username : (acc as Competitor).competitorUsername;
                        
                        return (
                          <tr key={acc.id} className={`border-b ${isMain ? 'bg-primary/5' : ''}`}>
                            <td className="p-3 font-semibold">@{username}</td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.visualScore)}>{acc.visualScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.audioScore)}>{acc.audioScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.energyScore)}>{acc.energyScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.interactionScore)}>{acc.interactionScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.linguisticScore)}>{acc.linguisticScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.contextualScore)}>{acc.contextualScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.environmentalScore)}>{acc.environmentalScore}</Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={getScoreBadgeVariant(acc.governanceScore)}>{acc.governanceScore}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 3: GROWTH & ENGAGEMENT */}
            <TabsContent value="growth" className="space-y-6" data-testid="panel-growth">
              {competitors[0]?.historicalMetrics && competitors[0].historicalMetrics.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tren Pertumbuhan Followers (4 Minggu Terakhir)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={competitors[0].historicalMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--foreground))" />
                      <YAxis stroke="hsl(var(--foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="followers" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Followers"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Engagement Rate Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={allAccounts.map((acc, idx) => ({
                      name: ('isMainAccount' in acc && acc.isMainAccount) ? acc.username : (acc as Competitor).competitorUsername,
                      engagement: acc.engagementRate || 0,
                      isMain: 'isMainAccount' in acc && acc.isMainAccount
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                      <YAxis stroke="hsl(var(--foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="engagement" fill="hsl(var(--primary))" name="Engagement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Posting Frequency</h3>
                  <div className="space-y-4">
                    {competitors.map((comp, idx) => (
                      <div key={comp.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">@{comp.competitorUsername}</span>
                          <Badge variant="secondary">{comp.postingFrequency || 0}/minggu</Badge>
                        </div>
                        <Progress value={(comp.postingFrequency || 0) * 5} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Indikator Growth Velocity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {competitors.map((comp) => (
                    <div key={comp.id} className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">@{comp.competitorUsername}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="text-2xl font-bold text-green-500">+{comp.growthRate || 0}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">per minggu</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* TAB 4: CONTENT STRATEGY */}
            <TabsContent value="content" className="space-y-6" data-testid="panel-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competitors.map((comp, idx) => (
                  <Card key={comp.id} className="p-6" data-testid={`card-content-${idx}`}>
                    <h3 className="font-semibold text-lg mb-4">@{comp.competitorUsername}</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Content Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {(comp.contentThemes || []).map((theme, i) => (
                          <Badge key={i} variant="secondary">{theme}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Top Formats</p>
                      <div className="flex flex-wrap gap-2">
                        {(comp.topFormats || []).map((format, i) => (
                          <Badge key={i} variant="outline">{format}</Badge>
                        ))}
                      </div>
                    </div>

                    {comp.postingSchedule && comp.postingSchedule.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Posting Schedule</p>
                        <div className="space-y-2">
                          {comp.postingSchedule.map((schedule: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                              <span>{schedule.day}</span>
                              <span className="text-muted-foreground">{schedule.hour}:00</span>
                              <Badge variant="secondary">{schedule.frequency}x</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Content Gap Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tema dan format yang kompetitor pakai tapi belum maksimal di akun utama
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="font-semibold mb-1">Peluang Format Konten</p>
                    <p className="text-sm text-muted-foreground">
                      Kompetitor banyak pakai format "Tutorials" dan "Challenges" - bisa dicoba untuk engagement lebih tinggi
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="font-semibold mb-1">Tema yang Belum Dijelajahi</p>
                    <p className="text-sm text-muted-foreground">
                      Niche "Review" dan "Cooking" masih rendah kompetisi - kesempatan untuk stand out!
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 5: STRATEGIC INSIGHTS */}
            <TabsContent value="insights" className="space-y-6" data-testid="panel-insights">
              {competitors.map((comp, idx) => (
                <Card key={comp.id} className="p-6" data-testid={`card-insights-${idx}`}>
                  <h3 className="font-semibold text-lg mb-4">
                    Insights untuk @{comp.competitorUsername}
                  </h3>

                  {comp.strengths && comp.strengths.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Strengths (Kekuatan)</h4>
                      </div>
                      <div className="space-y-2">
                        {comp.strengths.map((strength: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="font-semibold text-sm">{strength.area}</p>
                            <p className="text-sm text-muted-foreground mt-1">{strength.evidence}</p>
                            <Progress value={strength.score || 0} className="h-1 mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.weaknesses && comp.weaknesses.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h4 className="font-semibold">Weaknesses (Area Improvement)</h4>
                      </div>
                      <div className="space-y-2">
                        {comp.weaknesses.map((weakness: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="font-semibold text-sm">{weakness.area}</p>
                            <p className="text-sm text-muted-foreground mt-1">{weakness.issue}</p>
                            <Progress value={weakness.score || 0} className="h-1 mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {comparativeInsights.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Cross-Competitor Insights</h3>
                  </div>
                  <div className="space-y-3">
                    {comparativeInsights.map((insight: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-lg border ${
                          insight.priority === 'high' 
                            ? 'bg-red-500/10 border-red-500/20' 
                            : insight.priority === 'medium'
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-blue-500/10 border-blue-500/20'
                        }`}
                        data-testid={`insight-${idx}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold">{insight.metric}</p>
                          <Badge variant="outline">{insight.priority}</Badge>
                        </div>
                        <p className="text-sm mb-2">
                          <span className="font-medium">Leader:</span> @{insight.leader} ({insight.value})
                        </p>
                        <p className="text-sm text-muted-foreground">{insight.opportunity}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {overallRecommendations.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Rekomendasi AI Untuk Akun Utama</h3>
                  <div className="space-y-3">
                    {overallRecommendations.map((rec: any, idx: number) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-lg bg-primary/10 border border-primary/20"
                        data-testid={`recommendation-${idx}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold">{rec.title}</p>
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <AIAssistantWidget />
    </div>
  );
}
