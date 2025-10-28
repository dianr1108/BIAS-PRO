import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Sparkles, TrendingUp, Target, Lightbulb, BarChart, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIDiscussion() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      icon: TrendingUp,
      text: "Cara viral di TikTok 2025?",
      category: "Growth"
    },
    {
      icon: Lightbulb,
      text: "Ide konten trending hari ini",
      category: "Content"
    },
    {
      icon: Target,
      text: "Strategi naikkan engagement",
      category: "Strategy"
    },
    {
      icon: BarChart,
      text: "Analisa performa video saya",
      category: "Analytics"
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      const aiMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  aiContent += parsed.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = aiContent;
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Gagal mendapatkan respon dari AI. Silakan coba lagi.",
        variant: "destructive"
      });
      
      // Update the AI message to show error instead of removing it
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.role === "assistant") {
          newMessages[newMessages.length - 1].content = "Maaf, terjadi kesalahan. Silakan coba kirim pesan lagi.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
    handleSendMessage(promptText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Diskusi AI</h1>
                <p className="text-sm text-muted-foreground">
                  Chat dengan AI tentang strategi TikTok kamu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="button-back-home">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mulai Diskusi dengan BIAS AI</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Tanyakan apa saja tentang strategi TikTok, konten viral, analisis performa, dan tips growth. Chat unlimited & 100% gratis!
                </p>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickPrompts.map((prompt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="justify-start text-left h-auto py-4 hover-elevate"
                      onClick={() => handleQuickPrompt(prompt.text)}
                      data-testid={`button-quick-prompt-${idx}`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <prompt.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{prompt.text}</div>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.category}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${message.role}-${idx}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">BIAS AI</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">BIAS AI sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan kamu di sini..."
                className="resize-none min-h-[60px] max-h-[120px]"
                disabled={isLoading}
                data-testid="input-chat-message"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0 h-[60px] w-[60px]"
                data-testid="button-send-message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tips: Tekan <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Enter</kbd> untuk kirim, <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Shift+Enter</kbd> untuk baris baru
            </p>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            🔓 <span className="font-semibold">100% GRATIS</span> • Unlimited chat • Powered by Google Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  );
}
