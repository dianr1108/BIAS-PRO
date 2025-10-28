import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Download, FileText, FileSpreadsheet, Check, 
  Loader2, CheckCircle2, Clock, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface ExportJob {
  id: string;
  tiktokUsername: string;
  exportType: string;
  format: string;
  status: string;
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
}

export default function ExportReports() {
  const [username, setUsername] = useState<string>("");
  const [exportType, setExportType] = useState<string>("analysis");
  const [format, setFormat] = useState<string>("pdf");
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

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['/api/export', username],
    enabled: !!username,
  });

  const jobs: ExportJob[] = jobsData?.jobs || [];

  const exportMutation = useMutation({
    mutationFn: async (data: { tiktokUsername: string; exportType: string; format: string }) => {
      const response = await apiRequest('POST', '/api/export', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/export', username] });
      toast({
        title: "Export Dimulai",
        description: "Report sedang diproses. Akan muncul di daftar export di bawah.",
      });
    },
    onError: () => {
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat membuat export",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    if (!username) {
      toast({
        title: "Username Diperlukan",
        description: "Silakan analisis profil terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    exportMutation.mutate({
      tiktokUsername: username,
      exportType,
      format,
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "destructive";
    }
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Export Reports</h1>
          <p className="text-muted-foreground">
            Download laporan lengkap dalam format PDF atau Excel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Buat Export Baru</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Tipe Export</Label>
                <RadioGroup value={exportType} onValueChange={setExportType}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="analysis" id="type-analysis" data-testid="radio-analysis" />
                    <Label htmlFor="type-analysis" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Profile Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          Behavioral scores, metrics, dan AI insights
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="livestream" id="type-livestream" data-testid="radio-livestream" />
                    <Label htmlFor="type-livestream" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Live Stream Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          Peak moments, gifts, dan engagement data
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="competitor" id="type-competitor" data-testid="radio-competitor" />
                    <Label htmlFor="type-competitor" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Competitor Comparison</p>
                        <p className="text-xs text-muted-foreground">
                          Side-by-side metrics dan opportunities
                        </p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="trends" id="type-trends" data-testid="radio-trends" />
                    <Label htmlFor="type-trends" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-semibold">Trend Report</p>
                        <p className="text-xs text-muted-foreground">
                          Trending sounds, hashtags, dan predictions
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Format File</Label>
                <RadioGroup value={format} onValueChange={setFormat}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="pdf" id="format-pdf" data-testid="radio-pdf" />
                    <Label htmlFor="format-pdf" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-semibold">PDF Document</p>
                          <p className="text-xs text-muted-foreground">
                            Professional report format
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value="excel" id="format-excel" data-testid="radio-excel" />
                    <Label htmlFor="format-excel" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-semibold">Excel Spreadsheet</p>
                          <p className="text-xs text-muted-foreground">
                            Data untuk analisis lebih lanjut
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleExport}
                disabled={exportMutation.isPending}
                data-testid="button-export"
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Generate Export
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Export History</h3>
            
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            )}

            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-muted p-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h4 className="font-semibold mb-2">Belum Ada Export</h4>
                <p className="text-sm text-muted-foreground">
                  Export yang Anda buat akan muncul di sini
                </p>
              </div>
            )}

            {!isLoading && jobs.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jobs.map((job, idx) => (
                  <div 
                    key={job.id} 
                    className="p-4 rounded-lg border hover-elevate"
                    data-testid={`export-job-${idx}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {job.format === "pdf" ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : (
                          <FileSpreadsheet className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-semibold capitalize">
                            {job.exportType} Report
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(job.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(job.status as string)}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="uppercase">{job.format}</span>
                        <span>{formatFileSize(job.fileSize)}</span>
                      </div>
                      
                      {job.status === "completed" && job.fileUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          data-testid={`button-download-${idx}`}
                        >
                          <Download className="h-3 w-3 mr-2" />
                          Download
                        </Button>
                      )}
                      
                      {job.status === "processing" && (
                        <div className="flex items-center gap-2">
                          <Progress value={65} className="h-2 w-20" />
                          <span className="text-xs text-muted-foreground">65%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tentang Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Format PDF
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-6">
                <li>Visualisasi charts dan graphs</li>
                <li>Professional layout untuk presentasi</li>
                <li>AI insights dan recommendations</li>
                <li>Ready to share dengan client/team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Format Excel
              </h4>
              <ul className="space-y-1 text-muted-foreground ml-6">
                <li>Raw data untuk analisis lebih detail</li>
                <li>Multiple sheets per kategori</li>
                <li>Dapat diedit dan customize</li>
                <li>Import ke tools analytics lain</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
