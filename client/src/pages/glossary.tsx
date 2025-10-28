import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Book, Search, Filter, ChevronDown, ChevronUp, TrendingUp, Star, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { glossaryTerms, categories, type GlossaryTerm } from "@/lib/glossaryData";

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const toggleExpand = (term: string) => {
    setExpandedTerms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(term)) {
        newSet.delete(term);
      } else {
        newSet.add(term);
      }
      return newSet;
    });
  };

  const filteredTerms = glossaryTerms
    .filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.term.localeCompare(b.term));

  const categoryColors: Record<string, string> = {
    "TikTok Platform": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "BIAS Analysis": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "Audio/Video": "bg-green-500/10 text-green-600 border-green-500/20",
    "TikTok Slang": "bg-pink-500/10 text-pink-600 border-pink-500/20",
    "Live Streaming": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    "Content Strategy": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Perpustakaan Istilah</h1>
              <p className="text-muted-foreground">
                Kamus lengkap istilah TikTok, analisis video, dan slang viral terkini
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari istilah atau definisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-term"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[240px]" data-testid="select-category">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Menampilkan <span className="font-semibold text-foreground">{filteredTerms.length}</span> dari{" "}
            <span className="font-semibold text-foreground">{glossaryTerms.length}</span> istilah
          </span>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTerms.length === 0 ? (
            <Card className="p-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
              <p className="text-sm text-muted-foreground">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </Card>
          ) : (
            filteredTerms.map((term, index) => {
              const isExpanded = expandedTerms.has(term.term);
              
              return (
                <Card
                  key={index}
                  className="p-5 hover-elevate transition-all"
                  data-testid={`card-term-${index}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{term.term}</h3>
                        <Badge 
                          variant="outline" 
                          className={categoryColors[term.category]}
                        >
                          {term.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {term.definition}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(term.term)}
                      className="shrink-0"
                      data-testid={`button-expand-${index}`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-3 animate-in slide-in-from-top-2 duration-200">
                      {term.effects && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1.5 text-primary flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Efek & Pengaruh
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {term.effects}
                          </p>
                        </div>
                      )}
                      {term.advantages && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1.5 text-primary flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5" />
                            Kelebihan & Keunggulan
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {term.advantages}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <Book className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Tentang Perpustakaan Istilah</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua istilah dan penjelasan di sini dikurasi oleh <span className="font-semibold text-primary">BIAS AI</span> berdasarkan 
                analisis trends TikTok terkini, best practices content creation, dan slang viral yang populer di komunitas creator. 
                Database diupdate regular untuk mencerminkan perubahan trends dan platform features.
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <span className="font-medium">Pro tip:</span> Gunakan AI Assistant (tombol chat di kanan bawah) untuk bertanya 
                  lebih detail tentang istilah apapun atau mendapat rekomendasi strategy spesifik!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantWidget />
    </div>
  );
}
