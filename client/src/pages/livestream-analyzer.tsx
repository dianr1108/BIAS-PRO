import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Upload, Play, Users, Gift, TrendingUp, MessageCircle, 
  Share2, Zap, Clock, Eye, Lightbulb, AlertCircle, CheckCircle2, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveStreamMetrics {
  peakViewers: number;
  avgViewers: number;
  totalViews: number;
  totalGifts: number;
  giftValue: number;
  totalComments: number;
  totalShares: number;
  retentionRate: number;
  engagementScore: number;
  energyScore: number;
  interactionScore: number;
  audioQuality: number;
  peakMoments: Array<{
    timestamp: number;
    type: string;
    description: string;
    viewers: number;
  }>;
  giftPatterns: Array<{
    timeRange: string;
    totalGifts: number;
    value: number;
  }>;
  chatAnalysis: {
    sentiment: string;
    topKeywords: string[];
    engagementLevel: string;
  };
}

interface AnalysisResult {
  id: string;
  metrics: LiveStreamMetrics;
  aiInsights: Array<{
    type: "strength" | "opportunity" | "alert";
    title: string;
    description: string;
  }>;
}

export default function LiveStreamAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { fileName: string; fileSize: number; duration: number; username: string }) => {
      const response = await apiRequest('POST', '/api/livestream/analyze', data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analisis Selesai",
        description: "Live stream berhasil dianalisis!",
      });
    },
    onError: () => {
      toast({
        title: "Analisis Gagal",
        description: "Terjadi kesalahan saat menganalisis live stream",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "File Tidak Valid",
        description: "Harap upload file video",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "File Terlalu Besar",
        description: "Maksimal ukuran file 500MB",
        variant: "destructive",
      });
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setAnalysisResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast({
        title: "File Diperlukan",
        description: "Silakan upload video live stream terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const storedData = localStorage.getItem("latestAnalysis");
    let username = "unknown_user";
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        username = data.profile?.username || "unknown_user";
      } catch (e) {
        console.error("Failed to parse latest analysis");
      }
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.floor(video.duration);
      
      analyzeMutation.mutate({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        duration,
        username,
      });
    };
    video.src = URL.createObjectURL(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setAnalysisResult(null);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m ${secs}d`;
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Analisis Live Stream</h1>
          <p className="text-muted-foreground">
            Upload rekaman live stream untuk mendapat insights lengkap tentang performa dan engagement
          </p>
        </div>

        {!analysisResult ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-12 text-center hover-elevate active-elevate-2 transition-colors"
                data-testid="dropzone-video"
              >
                {!videoPreview ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-primary/10 p-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Upload Rekaman Live Stream
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag & drop file video atau klik untuk memilih
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-select-file"
                      >
                        Pilih File Video
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileInput}
                        className="hidden"
                        data-testid="input-file"
                      />
                      <p className="text-xs text-muted-foreground mt-4">
                        Format: MP4, MOV, AVI (Maks. 500MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative max-w-2xl mx-auto">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full rounded-lg"
                        data-testid="video-preview"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleReset}
                        data-testid="button-remove-video"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Play className="h-4 w-4" />
                      <span data-testid="text-filename">{selectedFile?.name}</span>
                      <span>({(selectedFile!.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {selectedFile && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending}
                  data-testid="button-analyze"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Analisis Sekarang
                    </>
                  )}
                </Button>
              </div>
            )}

            {analyzeMutation.isPending && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Sedang Menganalisis Live Stream...</h3>
                    <p className="text-sm text-muted-foreground">
                      Kami sedang mengekstrak metrics, pola engagement, dan insights AI
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Hasil Analisis</h2>
              <Button
                variant="outline"
                onClick={handleReset}
                data-testid="button-analyze-another"
              >
                Analisis Video Lain
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary">{analysisResult.metrics.retentionRate}%</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Peak Viewers</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-peak-viewers">
                    {formatNumber(analysisResult.metrics.peakViewers)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rata-rata: {formatNumber(analysisResult.metrics.avgViewers)}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-amber-500/10 p-2">
                    <Gift className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Gifts</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-total-gifts">
                    {formatNumber(analysisResult.metrics.totalGifts)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nilai: Rp {formatNumber(analysisResult.metrics.giftValue)}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Komentar</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-total-comments">
                    {formatNumber(analysisResult.metrics.totalComments)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Shares: {formatNumber(analysisResult.metrics.totalShares)}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Engagement Score</p>
                  <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-engagement-score">
                    {analysisResult.metrics.engagementScore}
                  </p>
                  <Progress value={analysisResult.metrics.engagementScore} className="h-2" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Scores</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Energy Level</span>
                      <span className="text-sm font-semibold" data-testid="text-energy-score">
                        {analysisResult.metrics.energyScore}/100
                      </span>
                    </div>
                    <Progress value={analysisResult.metrics.energyScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Interaksi</span>
                      <span className="text-sm font-semibold" data-testid="text-interaction-score">
                        {analysisResult.metrics.interactionScore}/100
                      </span>
                    </div>
                    <Progress value={analysisResult.metrics.interactionScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Kualitas Audio</span>
                      <span className="text-sm font-semibold" data-testid="text-audio-quality">
                        {analysisResult.metrics.audioQuality}/100
                      </span>
                    </div>
                    <Progress value={analysisResult.metrics.audioQuality} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Retention Rate</span>
                      <span className="text-sm font-semibold" data-testid="text-retention-rate">
                        {analysisResult.metrics.retentionRate}%
                      </span>
                    </div>
                    <Progress value={analysisResult.metrics.retentionRate} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Analisis Chat</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Sentiment</p>
                    <Badge variant="secondary" data-testid="text-sentiment">
                      {analysisResult.metrics.chatAnalysis?.sentiment || "Positive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Engagement Level</p>
                    <p className="text-lg font-semibold" data-testid="text-engagement-level">
                      {analysisResult.metrics.chatAnalysis?.engagementLevel || "Tinggi"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Top Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysisResult.metrics.chatAnalysis?.topKeywords || ["mantap", "keren", "seru"]).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" data-testid={`badge-keyword-${idx}`}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {analysisResult.metrics.peakMoments && analysisResult.metrics.peakMoments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Peak Moments</h3>
                <div className="space-y-3">
                  {analysisResult.metrics.peakMoments.slice(0, 5).map((moment, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      data-testid={`peak-moment-${idx}`}
                    >
                      <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{formatDuration(moment.timestamp)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {formatNumber(moment.viewers)} viewers
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{moment.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {analysisResult.aiInsights && analysisResult.aiInsights.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  {analysisResult.aiInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                      data-testid={`insight-${idx}`}
                    >
                      <div className="mt-1">
                        {insight.type === "strength" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {insight.type === "opportunity" && (
                          <Lightbulb className="h-5 w-5 text-amber-500" />
                        )}
                        {insight.type === "alert" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
