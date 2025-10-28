import { useState, useRef } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Upload, X, Play, Trophy, AlertTriangle, Lightbulb, 
  TrendingUp, Film, Target, Sparkles, Calendar, Eye 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { formatDistanceToNow } from "date-fns";

interface UploadedFile {
  file: File;
  id: string;
}

interface VideoAnalysis {
  videoName: string;
  fileName: string;
  fileSize: number;
  hookScore: number;
  visualScore: number;
  audioScore: number;
  energyScore: number;
  viralScore: number;
  insights: {
    hook: string[];
    visual: string[];
    audio: string[];
  };
  checklist: {
    category: string;
    items: { done: boolean; text: string; }[];
  }[];
}

interface ComparisonResult {
  comparisonId: string;
  comparisonResults: {
    videos: VideoAnalysis[];
  };
  bestPerformers: {
    videoName: string;
    category: string;
    score: number;
    reason: string;
  }[];
  weakestAreas: {
    category: string;
    videos: string[];
    suggestions: string;
  }[];
  crossLearnings: {
    from: string;
    to: string;
    lesson: string;
  }[];
  aiRecommendations: string[];
}

export default function VideoComparison() {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [comparisonName, setComparisonName] = useState(`Perbandingan ${new Date().toLocaleDateString('id-ID')}`);
  const [username, setUsername] = useState("demo_user");
  const [currentComparison, setCurrentComparison] = useState<ComparisonResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: historyData } = useQuery<{ comparisons: any[] }>({
    queryKey: ["/api/video/comparisons", username],
    enabled: !!username,
  });

  const compareMutation = useMutation({
    mutationFn: async (data: { videos: { name: string; size: number }[]; comparisonName: string; username: string }) => {
      const response = await apiRequest("POST", "/api/video/compare", data);
      return await response.json() as ComparisonResult;
    },
    onSuccess: (data: ComparisonResult) => {
      setCurrentComparison(data);
      queryClient.invalidateQueries({ queryKey: ["/api/video/comparisons", username] });
      toast({
        title: "Perbandingan Selesai!",
        description: `${data.comparisonResults.videos.length} video berhasil dianalisis dan dibandingkan`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal Membandingkan",
        description: error.message || "Terjadi kesalahan saat membandingkan video",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('video/')) {
        toast({
          title: "File Tidak Valid",
          description: `${file.name} bukan file video`,
          variant: "destructive",
        });
        continue;
      }

      if (selectedFiles.length + newFiles.length >= 5) {
        toast({
          title: "Maksimal 5 Video",
          description: "Anda hanya bisa membandingkan maksimal 5 video sekaligus",
          variant: "destructive",
        });
        break;
      }

      newFiles.push({
        file,
        id: `${Date.now()}-${i}`,
      });
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== id));
  };

  const handleCompare = () => {
    if (selectedFiles.length < 2) {
      toast({
        title: "Minimal 2 Video",
        description: "Upload minimal 2 video untuk membandingkan",
        variant: "destructive",
      });
      return;
    }

    if (!comparisonName.trim()) {
      toast({
        title: "Nama Perbandingan Kosong",
        description: "Berikan nama untuk perbandingan ini",
        variant: "destructive",
      });
      return;
    }

    compareMutation.mutate({
      videos: selectedFiles.map(f => ({ name: f.file.name, size: f.file.size })),
      comparisonName: comparisonName.trim(),
      username,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRadarData = () => {
    if (!currentComparison) return [];

    const categories = ["Hook", "Visual", "Audio", "Energy", "Viral"];
    return categories.map(category => {
      const dataPoint: any = { category };
      currentComparison.comparisonResults.videos.forEach((video, index) => {
        const key = category.toLowerCase() + "Score";
        dataPoint[`Video ${index + 1}`] = video[key as keyof VideoAnalysis];
      });
      return dataPoint;
    });
  };

  const chartColors = ["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

  const viewComparison = (comparison: any) => {
    setCurrentComparison({
      comparisonId: comparison.id,
      comparisonResults: comparison.comparisonResults,
      bestPerformers: comparison.bestPerformers,
      weakestAreas: comparison.weakestAreas,
      crossLearnings: comparison.crossLearnings,
      aiRecommendations: comparison.aiRecommendations,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Video Comparison</h1>
          <p className="text-muted-foreground">
            Upload 2-5 video untuk dibandingkan dan dapatkan insight mendalam tentang performa masing-masing
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Video untuk Dibandingkan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Perbandingan</label>
              <Input
                data-testid="input-comparison-name"
                placeholder="Contoh: Video TikTok Minggu Ini"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                disabled={compareMutation.isPending}
              />
            </div>

            <div
              data-testid="dropzone-videos"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop video atau klik untuk upload
              </p>
              <p className="text-xs text-muted-foreground">
                Maksimal 5 video • Format: MP4, MOV, AVI
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
                data-testid="input-file"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Video yang Dipilih ({selectedFiles.length}/5)</p>
                {selectedFiles.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    data-testid={`file-item-${uploadedFile.id}`}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Film className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(uploadedFile.id)}
                      disabled={compareMutation.isPending}
                      data-testid={`button-remove-${uploadedFile.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              data-testid="button-compare"
              onClick={handleCompare}
              disabled={selectedFiles.length < 2 || !comparisonName.trim() || compareMutation.isPending}
              className="w-full"
              size="lg"
            >
              {compareMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Menganalisis {selectedFiles.length} video...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Bandingkan {selectedFiles.length} Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {currentComparison && (
          <div className="space-y-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Hasil Perbandingan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Score Comparison Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse" data-testid="table-scores">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Video</th>
                          <th className="text-center p-3 font-medium">Hook</th>
                          <th className="text-center p-3 font-medium">Visual</th>
                          <th className="text-center p-3 font-medium">Audio</th>
                          <th className="text-center p-3 font-medium">Energy</th>
                          <th className="text-center p-3 font-medium">Viral</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentComparison.comparisonResults.videos.map((video, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50" data-testid={`row-video-${index}`}>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Film className="w-4 h-4 text-primary" />
                                <span className="font-medium truncate max-w-xs">{video.videoName}</span>
                              </div>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-mono font-semibold ${getScoreColor(video.hookScore)}`} data-testid={`score-hook-${index}`}>
                                {video.hookScore}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-mono font-semibold ${getScoreColor(video.visualScore)}`} data-testid={`score-visual-${index}`}>
                                {video.visualScore}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-mono font-semibold ${getScoreColor(video.audioScore)}`} data-testid={`score-audio-${index}`}>
                                {video.audioScore}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-mono font-semibold ${getScoreColor(video.energyScore)}`} data-testid={`score-energy-${index}`}>
                                {video.energyScore}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-mono font-semibold ${getScoreColor(video.viralScore)}`} data-testid={`score-viral-${index}`}>
                                {video.viralScore}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Visual Comparison (Radar Chart)</h3>
                  <div className="w-full h-96" data-testid="chart-radar">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        {currentComparison.comparisonResults.videos.map((_, index) => (
                          <Radar
                            key={index}
                            name={`Video ${index + 1}`}
                            dataKey={`Video ${index + 1}`}
                            stroke={chartColors[index % chartColors.length]}
                            fill={chartColors[index % chartColors.length]}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Best Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3" data-testid="section-best-performers">
                    {currentComparison.bestPerformers.map((performer, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg" data-testid={`performer-${index}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold truncate">{performer.videoName}</p>
                            <Badge variant="secondary" className="mt-1">
                              {performer.category}
                            </Badge>
                          </div>
                          <span className="text-2xl font-bold text-green-500 ml-2" data-testid={`performer-score-${index}`}>
                            {performer.score}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{performer.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Weakest Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3" data-testid="section-weakest-areas">
                    {currentComparison.weakestAreas.map((area, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg" data-testid={`weak-area-${index}`}>
                        <div className="mb-2">
                          <Badge variant="destructive" className="mb-2">
                            {area.category}
                          </Badge>
                          <p className="text-sm font-medium">
                            Affected: {area.videos.join(", ")}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{area.suggestions}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {currentComparison.crossLearnings && currentComparison.crossLearnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Cross-Learnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3" data-testid="section-cross-learnings">
                    {currentComparison.crossLearnings.map((learning, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg" data-testid={`learning-${index}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{learning.from}</Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="secondary">{learning.to}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{learning.lesson}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" data-testid="section-recommendations">
                  {currentComparison.aiRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`recommendation-${index}`}>
                      <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Riwayat Perbandingan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyData?.comparisons && historyData.comparisons.length > 0 ? (
              <div className="space-y-3" data-testid="section-history">
                {historyData.comparisons.map((comparison: any, index: number) => (
                  <div
                    key={comparison.id}
                    className="p-4 bg-muted rounded-lg hover-elevate cursor-pointer"
                    onClick={() => viewComparison(comparison)}
                    data-testid={`history-item-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{comparison.comparisonName}</h4>
                      <Badge variant="secondary">{comparison.videoCount} videos</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(comparison.createdAt), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Klik untuk lihat detail
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-history">
                <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada riwayat perbandingan</p>
                <p className="text-sm">Upload video di atas untuk memulai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AIAssistantWidget />
    </div>
  );
}
