import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Users, Target, Filter, CheckCircle2, Circle, 
  TrendingUp, Lightbulb, MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface Collaboration {
  id: string;
  tiktokUsername: string;
  creatorUsername: string;
  creatorNickname: string;
  creatorAvatarUrl?: string;
  followers: number;
  category: string;
  matchScore: number;
  sharedAudience: number;
  engagementRate: number;
  contentSynergy: number;
  contacted: boolean;
  collabIdeas?: string[];
  potentialReach?: number;
}

export default function CollabFinder() {
  const [username, setUsername] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: collabsData, isLoading } = useQuery({
    queryKey: ['/api/collab', username],
    enabled: !!username,
  });

  const collabs: Collaboration[] = collabsData?.collabs || [];

  const updateMutation = useMutation({
    mutationFn: async ({ id, contacted }: { id: string; contacted: boolean }) => {
      const response = await apiRequest('PATCH', `/api/collab/${id}`, { contacted });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/collab', username] });
      toast({
        title: "Status Diupdate",
        description: "Status kolaborasi berhasil diperbarui!",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Tidak dapat mengupdate status",
        variant: "destructive",
      });
    },
  });

  const filteredCollabs = collabs
    .filter(collab => filterCategory === "all" || collab.category === filterCategory)
    .sort((a, b) => b.matchScore - a.matchScore);

  const categories = ["all", "education", "entertainment", "lifestyle", "tech", "beauty", "fitness"];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const handleToggleContacted = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, contacted: !currentStatus });
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Collab Finder</h1>
          <p className="text-muted-foreground">
            Temukan creator potensial untuk kolaborasi dengan match score tinggi
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              onClick={() => setFilterCategory(category)}
              data-testid={`filter-${category}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {category === "all" ? "Semua" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        )}

        {!isLoading && filteredCollabs.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum Ada Rekomendasi</h3>
            <p className="text-muted-foreground">
              Rekomendasi kolaborasi akan muncul di sini
            </p>
          </Card>
        )}

        {!isLoading && filteredCollabs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollabs.map((collab, idx) => (
              <Card key={collab.id} className="p-6 hover-elevate" data-testid={`card-collab-${idx}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {collab.creatorAvatarUrl ? (
                      <img
                        src={collab.creatorAvatarUrl}
                        alt={collab.creatorUsername}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold" data-testid={`text-creator-${idx}`}>
                        @{collab.creatorUsername}
                      </h3>
                      <p className="text-xs text-muted-foreground">{collab.creatorNickname}</p>
                    </div>
                  </div>
                  <Button
                    variant={collab.contacted ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleToggleContacted(collab.id, collab.contacted)}
                    data-testid={`button-contact-${idx}`}
                  >
                    {collab.contacted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Match Score</span>
                    <span className={`text-2xl font-bold ${getMatchColor(collab.matchScore)}`} data-testid={`text-match-${idx}`}>
                      {collab.matchScore}%
                    </span>
                  </div>
                  <Progress value={collab.matchScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-semibold">{formatNumber(collab.followers)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <Badge variant="outline" className="mt-1">{collab.category}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shared Audience</p>
                    <p className="font-semibold">{collab.sharedAudience}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-semibold">{collab.engagementRate}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">Content Synergy</span>
                    <span className="font-semibold">{collab.contentSynergy}%</span>
                  </div>
                  <Progress value={collab.contentSynergy} className="h-2" />
                </div>

                {collab.potentialReach && (
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Potential Reach</span>
                    </div>
                    <p className="text-2xl font-bold font-mono tabular-nums">
                      {formatNumber(collab.potentialReach)}
                    </p>
                  </div>
                )}

                {collab.collabIdeas && collab.collabIdeas.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold">Collab Ideas</span>
                    </div>
                    <ul className="space-y-1">
                      {collab.collabIdeas.slice(0, 2).map((idea, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <MessageCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant={collab.contacted ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleToggleContacted(collab.id, collab.contacted)}
                    data-testid={`button-toggle-${idx}`}
                  >
                    {collab.contacted ? "Sudah Dihubungi" : "Tandai Sebagai Contacted"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
