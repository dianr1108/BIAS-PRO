import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, TrendingUp, Hash, Music, Clock, Users, Target, 
  Zap, ChevronDown, Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrendItem {
  id: string;
  trendType: string;
  name: string;
  description?: string;
  viralScore: number;
  growthVelocity: number;
  peakPrediction?: number;
  saturationLevel?: number;
  totalVideos?: number;
  totalViews?: number;
  avgEngagement?: number;
  bestPostingTimes?: string[];
  topCreators?: Array<{ username: string; followers: number }>;
  contentExamples?: string[];
  relevanceScore?: number;
  opportunityLevel?: string;
  recommendations?: string[];
}

export default function TrendRadar() {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("viral");
  const { toast } = useToast();

  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['/api/trends'],
  });

  const trends: TrendItem[] = trendsData?.trends || [];

  const filteredTrends = trends
    .filter(trend => filterType === "all" || trend.trendType === filterType)
    .sort((a, b) => {
      if (sortBy === "viral") return b.viralScore - a.viralScore;
      if (sortBy === "growth") return b.growthVelocity - a.growthVelocity;
      return 0;
    });

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getViralBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  const getOpportunityColor = (level: string) => {
    if (level === "tinggi") return "text-green-500";
    if (level === "sedang") return "text-amber-500";
    return "text-red-500";
  };

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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Trend Radar</h1>
          <p className="text-muted-foreground">
            Pantau trending sounds, hashtags, dan peluang viral terbaru di TikTok
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              data-testid="filter-all"
            >
              <Filter className="h-4 w-4 mr-2" />
              Semua
            </Button>
            <Button
              variant={filterType === "sound" ? "default" : "outline"}
              onClick={() => setFilterType("sound")}
              data-testid="filter-sound"
            >
              <Music className="h-4 w-4 mr-2" />
              Sounds
            </Button>
            <Button
              variant={filterType === "hashtag" ? "default" : "outline"}
              onClick={() => setFilterType("hashtag")}
              data-testid="filter-hashtag"
            >
              <Hash className="h-4 w-4 mr-2" />
              Hashtags
            </Button>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viral">Viral Score</SelectItem>
              <SelectItem value="growth">Growth Velocity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        )}

        {!isLoading && filteredTrends.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum Ada Trend</h3>
            <p className="text-muted-foreground">
              Data trending akan muncul di sini
            </p>
          </Card>
        )}

        {!isLoading && filteredTrends.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrends.map((trend, idx) => (
              <Card key={trend.id} className="p-6 hover-elevate" data-testid={`card-trend-${idx}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {trend.trendType === "sound" ? (
                      <div className="rounded-full bg-purple-500/10 p-2">
                        <Music className="h-4 w-4 text-purple-500" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                    <Badge variant={getViralBadgeVariant(trend.viralScore)} data-testid={`badge-viral-${idx}`}>
                      {trend.viralScore} Viral Score
                    </Badge>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2" data-testid={`text-trend-name-${idx}`}>
                  {trend.name}
                </h3>
                {trend.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {trend.description}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-muted-foreground">Growth Velocity</span>
                      <span className="font-semibold">{trend.growthVelocity}%</span>
                    </div>
                    <Progress value={trend.growthVelocity} className="h-2" />
                  </div>

                  {trend.saturationLevel !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-muted-foreground">Saturation</span>
                        <span className="font-semibold">{trend.saturationLevel}%</span>
                      </div>
                      <Progress value={trend.saturationLevel} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  {trend.totalVideos && (
                    <div>
                      <p className="text-muted-foreground">Total Videos</p>
                      <p className="font-semibold">{formatNumber(trend.totalVideos)}</p>
                    </div>
                  )}
                  {trend.totalViews && (
                    <div>
                      <p className="text-muted-foreground">Total Views</p>
                      <p className="font-semibold">{formatNumber(trend.totalViews)}</p>
                    </div>
                  )}
                  {trend.avgEngagement && (
                    <div>
                      <p className="text-muted-foreground">Avg Engagement</p>
                      <p className="font-semibold">{trend.avgEngagement}%</p>
                    </div>
                  )}
                  {trend.opportunityLevel && (
                    <div>
                      <p className="text-muted-foreground">Opportunity</p>
                      <p className={`font-semibold capitalize ${getOpportunityColor(trend.opportunityLevel)}`}>
                        {trend.opportunityLevel}
                      </p>
                    </div>
                  )}
                </div>

                {trend.bestPostingTimes && trend.bestPostingTimes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Best Posting Times</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trend.bestPostingTimes.slice(0, 3).map((time, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {trend.topCreators && trend.topCreators.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Top Creators</span>
                    </div>
                    <div className="space-y-1">
                      {trend.topCreators.slice(0, 3).map((creator, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span>@{creator.username}</span>
                          <span className="text-muted-foreground">
                            {formatNumber(creator.followers)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trend.recommendations && trend.recommendations.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Rekomendasi</span>
                    </div>
                    <ul className="space-y-1">
                      {trend.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <Zap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
