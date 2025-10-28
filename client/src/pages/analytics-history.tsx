import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Users, Heart, Video, 
  Calendar, Award, Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface HistoryEntry {
  id: string;
  recordedAt: string;
  followers: number;
  videos: number;
  likes: number;
  visualScore: number;
  audioScore: number;
  energyScore: number;
  interactionScore: number;
  linguisticScore: number;
  contextualScore: number;
  environmentalScore: number;
  governanceScore: number;
}

export default function AnalyticsHistory() {
  const [username, setUsername] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem("latestAnalysis");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setUsername(data.profile?.username || "");
      } catch (e) {
        console.error("Failed to parse latest analysis");
      }
    }
  }, []);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['/api/history', username],
    enabled: !!username,
  });

  const history: HistoryEntry[] = historyData?.history || [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  };

  const getGrowthData = () => {
    return history.map(entry => ({
      date: formatDate(entry.recordedAt),
      followers: entry.followers,
      videos: entry.videos,
      likes: entry.likes,
    }));
  };

  const getScoresData = () => {
    return history.map(entry => ({
      date: formatDate(entry.recordedAt),
      visual: entry.visualScore,
      audio: entry.audioScore,
      energy: entry.energyScore,
      interaction: entry.interactionScore,
      linguistic: entry.linguisticScore,
      contextual: entry.contextualScore,
    }));
  };

  const detectMilestones = () => {
    const milestones: Array<{ type: string; value: string; date: string }> = [];
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      
      const followerGrowth = ((curr.followers - prev.followers) / prev.followers) * 100;
      if (followerGrowth > 20) {
        milestones.push({
          type: "spike",
          value: `+${followerGrowth.toFixed(0)}% followers`,
          date: formatDate(curr.recordedAt),
        });
      }
      
      const avgScorePrev = (prev.visualScore + prev.energyScore + prev.interactionScore) / 3;
      const avgScoreCurr = (curr.visualScore + curr.energyScore + curr.interactionScore) / 3;
      
      if (avgScoreCurr > avgScorePrev + 10) {
        milestones.push({
          type: "improvement",
          value: "Score improvement +10",
          date: formatDate(curr.recordedAt),
        });
      }
    }
    
    return milestones;
  };

  const milestones = history.length > 0 ? detectMilestones() : [];

  const getLatestGrowth = () => {
    if (history.length < 2) return null;
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    const followerGrowth = ((latest.followers - previous.followers) / previous.followers) * 100;
    const videoGrowth = ((latest.videos - previous.videos) / previous.videos) * 100;
    
    return { followerGrowth, videoGrowth };
  };

  const growth = getLatestGrowth();

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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Analytics History</h1>
          <p className="text-muted-foreground">
            Pantau perkembangan metrics dan behavioral scores dari waktu ke waktu
          </p>
          {username && (
            <p className="text-sm text-muted-foreground mt-2">
              Tracking: <span className="font-semibold">@{username}</span>
            </p>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96" />
          </div>
        )}

        {!isLoading && history.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum Ada History</h3>
            <p className="text-muted-foreground">
              Data historical akan muncul setelah beberapa kali analisis
            </p>
          </Card>
        )}

        {!isLoading && history.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  {growth && (
                    <Badge variant={growth.followerGrowth >= 0 ? "default" : "destructive"}>
                      {growth.followerGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(growth.followerGrowth).toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Followers</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-current-followers">
                    {formatNumber(history[history.length - 1].followers)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dari: {formatNumber(history[0].followers)}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Video className="h-5 w-5 text-blue-500" />
                  </div>
                  {growth && (
                    <Badge variant="secondary">
                      {growth.videoGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(growth.videoGrowth).toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Videos</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-current-videos">
                    {history[history.length - 1].videos}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dari: {history[0].videos}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-red-500/10 p-2">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-current-likes">
                    {formatNumber(history[history.length - 1].likes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dari: {formatNumber(history[0].likes)}
                  </p>
                </div>
              </Card>
            </div>

            {milestones.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold">Milestones</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {milestones.map((milestone, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      data-testid={`milestone-${idx}`}
                    >
                      <div className="rounded-full bg-amber-500/10 p-2">
                        <Target className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{milestone.value}</p>
                        <p className="text-xs text-muted-foreground">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getGrowthData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
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
                  <Line 
                    type="monotone" 
                    dataKey="videos" 
                    stroke="hsl(217 91% 60%)" 
                    strokeWidth={2}
                    name="Videos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Behavioral Scores Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getScoresData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="visual" stroke="hsl(348 90% 58%)" strokeWidth={2} name="Visual" />
                  <Line type="monotone" dataKey="audio" stroke="hsl(262 52% 58%)" strokeWidth={2} name="Audio" />
                  <Line type="monotone" dataKey="energy" stroke="hsl(38 92% 50%)" strokeWidth={2} name="Energy" />
                  <Line type="monotone" dataKey="interaction" stroke="hsl(217 91% 60%)" strokeWidth={2} name="Interaction" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
