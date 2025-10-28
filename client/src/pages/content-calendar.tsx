import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Plus, Calendar as CalendarIcon, Edit, Trash2, 
  Hash, TrendingUp, Clock, X, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  tiktokUsername: string;
  title: string;
  description?: string;
  scheduledDate: string;
  contentType: string;
  hashtags?: string[];
  viralPrediction?: number;
  status: string;
}

export default function ContentCalendar() {
  const [username, setUsername] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "video",
    hashtags: "",
  });
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

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['/api/calendar', username],
    enabled: !!username,
  });

  const events: CalendarEvent[] = eventsData?.events || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/calendar', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar', username] });
      toast({ title: "Event Dibuat", description: "Event berhasil ditambahkan ke kalender!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Gagal", description: "Tidak dapat membuat event", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PATCH', `/api/calendar/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar', username] });
      toast({ title: "Event Diupdate", description: "Event berhasil diperbarui!" });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: "Gagal", description: "Tidak dapat mengupdate event", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/calendar/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar', username] });
      toast({ title: "Event Dihapus", description: "Event berhasil dihapus dari kalender!" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Tidak dapat menghapus event", variant: "destructive" });
    },
  });

  const handleOpenDialog = (date?: Date, event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || "",
        contentType: event.contentType,
        hashtags: event.hashtags?.join(", ") || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        contentType: "video",
        hashtags: "",
      });
    }
    setSelectedDate(date || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setSelectedDate(null);
    setFormData({
      title: "",
      description: "",
      contentType: "video",
      hashtags: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({ title: "Judul Diperlukan", description: "Masukkan judul untuk event", variant: "destructive" });
      return;
    }

    const hashtags = formData.hashtags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const eventData = {
      tiktokUsername: username,
      title: formData.title,
      description: formData.description,
      scheduledDate: selectedDate?.toISOString() || new Date().toISOString(),
      contentType: formData.contentType,
      hashtags,
      viralPrediction: Math.floor(Math.random() * 40) + 60,
      status: "planned",
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      createMutation.mutate(eventData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus event ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.scheduledDate), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Content Calendar</h1>
          <p className="text-muted-foreground">
            Rencanakan dan jadwalkan konten TikTok Anda dengan predictions viral score
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={previousMonth} data-testid="button-prev-month">
                ←
              </Button>
              <h2 className="text-2xl font-semibold" data-testid="text-current-month">
                {format(currentDate, 'MMMM yyyy', { locale: id })}
              </h2>
              <Button variant="outline" onClick={nextMonth} data-testid="button-next-month">
                →
              </Button>
            </div>
            <Button onClick={() => handleOpenDialog(new Date())} data-testid="button-create-event">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Event
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
                <div key={`empty-${idx}`} className="p-2" />
              ))}
              
              {daysInMonth.map((date) => {
                const dayEvents = getEventsForDate(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`min-h-24 p-2 rounded-lg border ${
                      isToday ? 'border-primary bg-primary/5' : 'border-border'
                    } hover-elevate cursor-pointer`}
                    onClick={() => handleOpenDialog(date)}
                    data-testid={`day-${format(date, 'yyyy-MM-dd')}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : ''}`}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-muted truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(date, event);
                          }}
                          data-testid={`event-${event.id}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} lagi
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {!isLoading && events.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.scheduledDate) >= new Date())
                .slice(0, 5)
                .map((event, idx) => (
                  <div 
                    key={event.id} 
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                    data-testid={`upcoming-event-${idx}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge variant="secondary">{event.contentType}</Badge>
                        {event.viralPrediction && (
                          <Badge variant="outline" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {event.viralPrediction}% viral
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.scheduledDate), 'dd MMM yyyy', { locale: id })}
                        </div>
                        {event.hashtags && event.hashtags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {event.hashtags.slice(0, 3).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(new Date(event.scheduledDate), event)}
                        data-testid={`button-edit-${idx}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        data-testid={`button-delete-${idx}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent data-testid="dialog-event">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Buat Event Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Tutorial Edit Video"
                  data-testid="input-title"
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail konten yang akan dibuat..."
                  data-testid="input-description"
                />
              </div>
              <div>
                <Label htmlFor="contentType">Tipe Konten</Label>
                <Input
                  id="contentType"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  placeholder="video, tutorial, challenge, etc"
                  data-testid="input-content-type"
                />
              </div>
              <div>
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input
                  id="hashtags"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  placeholder="fyp, tutorial, viral (pisahkan dengan koma)"
                  data-testid="input-hashtags"
                />
              </div>
              {selectedDate && (
                <div>
                  <Label>Tanggal</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                  data-testid="button-submit"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {editingEvent ? "Update" : "Buat"} Event
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  data-testid="button-cancel"
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
