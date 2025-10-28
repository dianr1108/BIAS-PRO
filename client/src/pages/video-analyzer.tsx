import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Upload, Play, Eye, Mic, Zap, AlertTriangle, CheckCircle2, 
  Lightbulb, TrendingUp, Film, Image, Volume2, Clock, Target, Sparkles, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";

interface VideoAnalysisResult {
  hookScore: number;
  visualScore: number;
  audioScore: number;
  energyScore: number;
  viralScore: number;
  estimatedViews: { min: number; max: number };
  insights: {
    hook: string[];
    visual: string[];
    audio: string[];
    bodyLanguage: string[];
    pacing: string[];
  };
  checklist: {
    category: string;
    items: { done: boolean; text: string; }[];
  }[];
}

export default function VideoAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
        description: "Silakan upload file video",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File Terlalu Besar",
        description: "Silakan upload video lebih kecil dari 100MB",
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

  const mockAnalyzeVideo = (): VideoAnalysisResult => {
    const hookScore = Math.floor(Math.random() * 30) + 50;
    const visualScore = Math.floor(Math.random() * 30) + 55;
    const audioScore = Math.floor(Math.random() * 30) + 60;
    const energyScore = Math.floor(Math.random() * 30) + 45;
    const viralScore = Math.floor((hookScore + visualScore + audioScore + energyScore) / 4);

    return {
      hookScore,
      visualScore,
      audioScore,
      energyScore,
      viralScore,
      estimatedViews: {
        min: viralScore * 100,
        max: viralScore * 500,
      },
      insights: {
        hook: [
          hookScore < 60 ? "First 3 detik terlalu slow - tidak ada pattern interrupt" : "Hook cukup engaging, tapi bisa lebih strong",
          hookScore < 60 ? "Tidak ada shocking statement atau question yang grabbing attention" : "Opening statement menarik perhatian",
          "Tambah gerakan tiba-tiba atau sound effect di detik 0-1",
        ],
        visual: [
          visualScore < 70 ? "Lighting kurang optimal - wajah terlihat gelap di beberapa bagian" : "Lighting cukup bagus, konsisten sepanjang video",
          visualScore < 70 ? "Background berantakan - banyak distraction" : "Framing dan komposisi sudah mengikuti rule of thirds",
          "Color grading perlu adjustment: Saturation +15%, Contrast +20%",
          "Posisi wajah sudah bagus di 1/3 frame, maintain ini!",
        ],
        audio: [
          audioScore < 70 ? "Volume voice terlalu pelan - naikin 30%" : "Voice clarity bagus, volume balance dengan musik proper",
          audioScore < 70 ? "Ada background noise yang mengganggu di detik 15-20" : "Audio quality clean, tidak ada echo atau noise",
          "Music volume -3dB (terlalu keras, voice hampir tenggelam)",
          "Pakai trending sound untuk maximize reach - current sound viral rate: 45%",
        ],
        bodyLanguage: [
          energyScore < 60 ? "Tangan terlalu kaku - tidak ada hand gestures" : "Hand gestures cukup ekspresif, maintain ini",
          energyScore < 60 ? "Eye contact kurang - terlalu sering lihat ke bawah/samping" : "Eye contact bagus, engaging dengan kamera",
          "Detik 8-12: Body language terlalu static, tambah movement",
          "Facial expression bagus di opening, tapi flat di middle part",
        ],
        pacing: [
          "Video duration: 1:45 - optimal! (sweet spot 1:00-2:00)",
          "Cut frequency: Setiap 4-5 detik - bisa lebih fast (target: 2-3 detik per cut)",
          "Pacing di middle part (detik 20-40) terlalu slow - audience might drop off",
          "End screen tidak ada CTA - tambah 'Part 2 coming!' atau 'Follow for more'",
        ],
      },
      checklist: [
        {
          category: "Hook Optimization (0-3 detik)",
          items: [
            { done: hookScore >= 70, text: "Start dengan gerakan tiba-tiba atau loud sound (pattern interrupt)" },
            { done: hookScore >= 60, text: "Opening line harus question atau shocking statement" },
            { done: false, text: "Add text overlay 'WAIT!' atau '❌ STOP scrolling!' di frame 1" },
          ],
        },
        {
          category: "Visual Improvements",
          items: [
            { done: visualScore >= 70, text: "Brighten video +25% (especially wajah)" },
            { done: visualScore >= 65, text: "Color grading: Saturation +15%, Contrast +20%" },
            { done: false, text: "Blur atau rapiin background (reduce distraction)" },
            { done: false, text: "Add subtle vignette untuk focus ke center subject" },
          ],
        },
        {
          category: "Audio Enhancement",
          items: [
            { done: audioScore >= 70, text: "Voice volume +30% (make it more present)" },
            { done: audioScore >= 65, text: "Music volume -3dB (jangan sampai voice tenggelam)" },
            { done: false, text: "Remove background noise di detik 15-20" },
            { done: false, text: "Ganti ke trending sound (viral rate >60%)" },
          ],
        },
        {
          category: "Energy & Engagement",
          items: [
            { done: energyScore >= 60, text: "Tambah hand gestures di setiap key point" },
            { done: energyScore >= 55, text: "Perbaiki eye contact - lihat langsung ke kamera" },
            { done: false, text: "Increase vocal energy +20% (speak louder & faster)" },
            { done: false, text: "Add zoom effect di punchline (detik 25)" },
          ],
        },
        {
          category: "Pacing & Cuts",
          items: [
            { done: false, text: "Cut every 2-3 seconds untuk fast pacing" },
            { done: false, text: "Trim slow middle part (detik 20-40)" },
            { done: false, text: "Add transition effects di key moments" },
            { done: false, text: "End screen: 'Part 2 coming!' + arrow up gesture" },
          ],
        },
        {
          category: "CTA & Engagement Triggers",
          items: [
            { done: false, text: "Add text CTA: 'Comment YES kalau setuju!' di detik 30" },
            { done: false, text: "Pin comment dengan question untuk encourage reply" },
            { done: false, text: "Add sticker/emoji overlay di emotional moments" },
          ],
        },
      ],
    };
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = mockAnalyzeVideo();
    setAnalysisResult(result);
    setIsAnalyzing(false);

    toast({
      title: "Analisis Selesai!",
      description: "Video telah dianalisis. Check insights & checklist di bawah.",
    });
  };

  const handleReset = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    
    setSelectedFile(null);
    setVideoPreview(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bagus";
    if (score >= 40) return "Cukup";
    return "Perlu Perbaikan";
  };

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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Video Analyzer</h1>
          <p className="text-muted-foreground">Upload video Anda untuk mendapat AI-powered feedback & editing checklist</p>
        </div>

        {!selectedFile ? (
          <Card className="p-12">
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover-elevate transition-all cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-upload"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileInput}
                data-testid="input-file"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Video TikTok</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag & drop video atau click untuk browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max 100MB • MP4, MOV, AVI supported
                  </p>
                </div>
                <Button size="lg" className="gap-2">
                  <Film className="h-5 w-5" />
                  Pilih Video
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Preview Video</h3>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleReset} data-testid="button-reset">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  {videoPreview && (
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full h-full object-contain"
                      data-testid="video-preview"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ukuran File:</p>
                    <p className="text-2xl font-bold font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {!analysisResult && !isAnalyzing && (
                    <Button 
                      size="lg" 
                      onClick={handleAnalyze}
                      className="w-full gap-2"
                      data-testid="button-analyze"
                    >
                      <Sparkles className="h-5 w-5" />
                      Analyze with AI
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        <span className="text-sm font-medium">Analyzing video...</span>
                      </div>
                      <Progress value={66} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        AI sedang menganalisis hook, visual, audio, body language & viral potential...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {analysisResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <h4 className="text-sm font-medium">Hook</h4>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${getScoreColor(analysisResult.hookScore)}`}>
                      {analysisResult.hookScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getScoreLabel(analysisResult.hookScore)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-purple-500" />
                      <h4 className="text-sm font-medium">Visual</h4>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${getScoreColor(analysisResult.visualScore)}`}>
                      {analysisResult.visualScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getScoreLabel(analysisResult.visualScore)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="h-4 w-4 text-blue-500" />
                      <h4 className="text-sm font-medium">Audio</h4>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${getScoreColor(analysisResult.audioScore)}`}>
                      {analysisResult.audioScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getScoreLabel(analysisResult.audioScore)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <h4 className="text-sm font-medium">Energy</h4>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${getScoreColor(analysisResult.energyScore)}`}>
                      {analysisResult.energyScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getScoreLabel(analysisResult.energyScore)}
                    </p>
                  </Card>

                  <Card className="p-4 border-primary/40 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-medium">Viral Score</h4>
                    </div>
                    <p className={`text-3xl font-bold font-mono text-primary`}>
                      {analysisResult.viralScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Est: {analysisResult.estimatedViews.min.toLocaleString()}-{analysisResult.estimatedViews.max.toLocaleString()} views
                    </p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    AI Insights & Recommendations
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Hook Analysis
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.insights.hook.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Image className="h-4 w-4 text-purple-500" />
                        Visual Quality
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.insights.visual.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-blue-500" />
                        Audio Enhancement
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.insights.audio.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-500" />
                        Body Language
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.insights.bodyLanguage.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Pacing & Structure
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.insights.pacing.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="p-6 border-primary/20 bg-primary/5">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Actionable Editing Checklist
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Implement semua checklist ini untuk maximize viral potential video Anda!
                  </p>

                  <div className="space-y-6">
                    {analysisResult.checklist.map((category, catIndex) => (
                      <div key={catIndex}>
                        <h3 className="font-semibold mb-3">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border"
                            >
                              {item.done ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0 mt-0.5" />
                              )}
                              <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : ''}`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button className="w-full gap-2" size="lg">
                      <Play className="h-5 w-5" />
                      Export Checklist & Start Editing
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AIAssistantWidget />
    </div>
  );
}
