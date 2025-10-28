export interface GlossaryTerm {
  term: string;
  category: "TikTok Platform" | "BIAS Analysis" | "Audio/Video" | "TikTok Slang" | "Live Streaming" | "Content Strategy";
  definition: string;
  effects?: string;
  advantages?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  // TikTok Platform Terms
  {
    term: "FYP (For You Page)",
    category: "TikTok Platform",
    definition: "Halaman utama TikTok yang menampilkan video rekomendasi berdasarkan algoritma. FYP adalah tujuan utama setiap creator karena di sini video bisa viral dan mencapai jutaan views.",
    effects: "Video yang masuk FYP mendapatkan eksposur masif ke audiens yang belum follow, meningkatkan reach hingga 10-100x lipat. Algoritma FYP mempertimbangkan watch time, engagement, dan relevansi konten.",
    advantages: "Kesempatan viral tanpa perlu follower besar. Creator kecil bisa mencapai jutaan views jika konten berkualitas dan sesuai algoritma."
  },
  {
    term: "Creator Fund",
    category: "TikTok Platform",
    definition: "Program monetisasi resmi TikTok yang membayar creator berdasarkan views dan engagement video. Tersedia di negara tertentu dengan syarat minimum 10K followers dan 100K views dalam 30 hari.",
    effects: "Creator mendapat passive income dari setiap video yang ditonton. Rata-rata $0.02-0.04 per 1000 views, tergantung region dan engagement quality.",
    advantages: "Income stabil untuk creator konsisten. Tidak perlu brand deal atau jualan produk untuk monetisasi."
  },
  {
    term: "Duet & Stitch",
    category: "TikTok Platform",
    definition: "Fitur kolaborasi TikTok. Duet: split screen video dengan creator lain. Stitch: gunakan 5 detik video orang lain sebagai intro video kamu.",
    effects: "Meningkatkan discoverability karena video muncul di profil kedua creator. Cocok untuk challenge, reaction, atau tutorial response.",
    advantages: "Kolaborasi tanpa perlu koordinasi langsung. Viral potential tinggi jika duet/stitch creator besar."
  },
  {
    term: "Shadow Ban",
    category: "TikTok Platform",
    definition: "Penalti tersembunyi dari TikTok yang membatasi reach video tanpa notifikasi eksplisit. Video tidak masuk FYP, views turun drastis, hanya followers yang lihat.",
    effects: "Views anjlok 70-90%, engagement rate turun signifikan. Durasi bisa 1-2 minggu atau permanent jika pelanggaran berat.",
    advantages: "Tidak ada (ini penalti). Tapi bisa dipelajari untuk avoid konten yang melanggar community guidelines."
  },

  // BIAS Analysis Terms
  {
    term: "BIAS (Behavioral Intelligence Audit System)",
    category: "BIAS Analysis",
    definition: "Platform analytics canggih yang menganalisis creator TikTok menggunakan 8-layer behavioral framework. BIAS memberikan insight mendalam tentang performa, behavioral patterns, dan strategi growth.",
    effects: "Creator mendapat pemahaman komprehensif tentang strengths, weaknesses, dan improvement areas. Data-driven decision making untuk optimasi konten.",
    advantages: "Analisis gratis, unlimited, dan real-time. Tidak perlu skills analytics untuk mendapat actionable insights."
  },
  {
    term: "Behavioral Score (8-Layer)",
    category: "BIAS Analysis",
    definition: "Sistem penilaian BIAS yang mengevaluasi creator dari 8 dimensi: Visual, Audio, Energy, Interaction, Linguistic, Contextual, Environmental, dan Governance. Setiap layer scored 0-100.",
    effects: "Mengidentifikasi layer mana yang perlu improvement. Misalnya Audio Score rendah = perlu improve music selection, Interaction Score rendah = kurang engage dengan audience.",
    advantages: "Framework terstruktur untuk self-improvement. Bisa track progress setiap layer dari waktu ke waktu."
  },
  {
    term: "Governance Score",
    category: "BIAS Analysis",
    definition: "Metrik BIAS untuk mendeteksi bot activity, fake engagement, dan authenticity creator. Score rendah (<50) mengindikasikan potential bot followers atau engagement manipulation.",
    effects: "Membantu brands identify creator authentic untuk collaboration. Low governance score = red flag untuk brand deals.",
    advantages: "Transparency tentang kualitas audience. Creator bisa clean up bot followers untuk improve score."
  },
  {
    term: "Viral Formula",
    category: "BIAS Analysis",
    definition: "Fitur BIAS Growth Strategies yang mengidentifikasi kombinasi optimal visual quality, audio selection, energy level, dan interaction style untuk maximize viral potential.",
    effects: "Personalized recommendations berdasarkan behavioral scores dan follower demographics. Increase viral chance hingga 3-5x dengan follow formula.",
    advantages: "Data-driven viral strategy vs trial-and-error. Save waktu dan effort dengan focus di improvement areas yang paling impactful."
  },

  // Audio/Video Terms
  {
    term: "Hook (3-Second Rule)",
    category: "Audio/Video",
    definition: "3 detik pertama video yang menentukan apakah viewer akan watch sampai habis atau skip. Hook bisa berupa visual menarik, pertanyaan provokatif, atau teaser outcome.",
    effects: "Hook kuat = watch time tinggi = FYP chance naik. TikTok prioritas video dengan low skip rate di 3 detik pertama.",
    advantages: "Skill paling penting untuk viral. Master hook = master TikTok algorithm."
  },
  {
    term: "B-Roll",
    category: "Audio/Video",
    definition: "Footage tambahan yang di-cut dengan main footage untuk add context, visual interest, atau storytelling depth. Contoh: close-up product saat talking head, transition scenes.",
    effects: "Meningkatkan production quality dan retention rate. Video dengan B-roll terlihat lebih professional dan engaging.",
    advantages: "Mudah dibikin dengan smartphone. Tidak perlu equipment mahal untuk hasil impactful."
  },
  {
    term: "Jump Cut",
    category: "Audio/Video",
    definition: "Teknik editing yang memotong dead air atau bagian boring, langsung jump ke poin penting. Creates fast-paced, dynamic video yang match TikTok audience attention span.",
    effects: "Meningkatkan pacing dan watch time. Viewer gak bosan karena konten padat tanpa filler.",
    advantages: "Mudah dilakukan di editor TikTok built-in atau CapCut. Tidak perlu advanced editing skills."
  },
  {
    term: "Sound On vs Sound Off",
    category: "Audio/Video",
    definition: "Konten 'Sound On' bergantung pada audio (music, voice-over, dialogue). 'Sound Off' tetap engaging dengan visual dan text overlay saja.",
    effects: "60% user watch TikTok dengan sound off (public places, malam hari). Sound Off content = broader reach.",
    advantages: "Bikin kedua versi untuk maximum impact. Sound On untuk viral sounds, Sound Off untuk accessibility."
  },
  {
    term: "Aspect Ratio (9:16)",
    category: "Audio/Video",
    definition: "Format video vertikal standar TikTok dengan rasio 9:16 (full screen mobile). Landscape (16:9) atau square (1:1) akan ada black bars dan kurang immersive.",
    effects: "9:16 maximize screen real estate dan viewer immersion. Non-9:16 content perform 40-60% lebih buruk.",
    advantages: "Shoot langsung di TikTok app untuk auto 9:16. Atau crop horizontal video di CapCut."
  },

  // TikTok Slang (2025 Current)
  {
    term: "NPC (Non-Playable Character)",
    category: "TikTok Slang",
    definition: "Trend live streaming dimana creator act like video game NPC dengan gerakan repetitive dan respond ke gifts dengan 'scripted actions'. Viral mid-2024 dan masih popular 2025.",
    effects: "NPC streamers bisa earn $1000-5000 per live session dari gifts. Highly addictive untuk viewers yang trigger actions dengan gifts.",
    advantages: "Low effort, high earnings. Tidak perlu talent khusus, just consistency dan stamina."
  },
  {
    term: "Gyatt",
    category: "TikTok Slang",
    definition: "Slang Gen Z untuk express shock atau admiration, terutama terhadap attractive person. Berasal dari 'goddamn' yang di-shorten. Popular di TikTok comments dan reactions.",
    effects: "Sering dipakai di thirst trap videos atau reaction content. Part of Gen Z communication style.",
    advantages: "Relatable untuk audience Gen Z (13-25 tahun). Increase engagement di comments."
  },
  {
    term: "Rizz",
    category: "TikTok Slang",
    definition: "Charisma atau kemampuan flirt/attract orang. 'He got rizz' = dia charming. 'Rizz up' = sedang flirting. Oxford Word of the Year 2023, masih viral 2025.",
    effects: "Konten tentang rizz (pickup lines, flirting tips, rizz ranking) consistently viral. High engagement di dating/relationship niche.",
    advantages: "Universal theme yang relatable. Easy content idea dengan viral potential."
  },
  {
    term: "Delulu",
    category: "TikTok Slang",
    definition: "Short untuk 'delusional'. Dipakai self-deprecating humor tentang unrealistic expectations atau manifesting dreams. 'Delulu is the solulu' = being delusional is the solution.",
    effects: "Popular di manifestation, dating, dan career content. Lighthearted approach untuk serious topics.",
    advantages: "Relatable dan funny. Balance antara aspirational dan realistic content."
  },
  {
    term: "It's Giving...",
    category: "TikTok Slang",
    definition: "Phrase untuk describe vibe atau aesthetic something. 'It's giving main character energy' = vibes seperti main character. Origin dari AAVE (African American Vernacular English).",
    effects: "Versatile phrase untuk fashion, interior, lifestyle content. Highly engaging di comments.",
    advantages: "Easy integrate ke caption atau voice-over. Instant relatability dengan TikTok culture."
  },
  {
    term: "Slay",
    category: "TikTok Slang",
    definition: "Doing something exceptionally well atau looking amazing. 'You're slaying' = you're killing it. Positive affirmation yang viral di beauty, fashion, talent content.",
    effects: "Encourages positive engagement dan supportive community. High comment engagement dengan 'SLAY QUEEN' responses.",
    advantages: "Universal compliment yang boost creator confidence. Creates positive brand image."
  },

  // Live Streaming Terms
  {
    term: "Gifting",
    category: "Live Streaming",
    definition: "Sistem monetisasi TikTok Live dimana viewers kirim virtual gifts (roses, lions, galaxy) ke creator. Gifts bisa dikonversi jadi real money (diamonds).",
    effects: "Main income source untuk live streamers. Top gifters dapat recognition dan perhatian khusus dari creator.",
    advantages: "Direct monetization tanpa ads. Viewers senang support creator favorit mereka."
  },
  {
    term: "Battle/PK (Player Kill)",
    category: "Live Streaming",
    definition: "Feature live streaming dimana dua creator compete head-to-head untuk collect gifts dari audience. Yang collect gifts paling banyak menang, loser dapat 'punishment'.",
    effects: "Highly engaging format yang boost gift revenue 3-10x vs solo live. Competitive nature trigger FOMO dan generous gifting.",
    advantages: "Win-win untuk both creators karena audience gabungan. Viral potential tinggi jika punishment entertaining."
  },
  {
    term: "Rose (Gift)",
    category: "Live Streaming",
    definition: "Virtual gift paling murah di TikTok (1 coin = ~$0.01). Sering spam-kirim untuk show support atau trigger NPC actions. 1000 roses = significant gift revenue.",
    effects: "Low barrier untuk viewers participate di live gifting. Volume tinggi roses bisa match/exceed value mahal gifts.",
    advantages: "Accessible untuk semua viewers, not just big spenders. Creates inclusive gifting culture."
  },
  {
    term: "Galaxy/Lion (Premium Gifts)",
    category: "Live Streaming",
    definition: "Premium virtual gifts yang cost 10,000-40,000 coins (~$100-400). Trigger special animations dan highlight giver prominently. Status symbol untuk top supporters.",
    effects: "Instant recognition dan appreciation dari creator. Top gifters dapat VIP treatment, shoutouts, atau private chat access.",
    advantages: "Creators earn significant revenue dari single premium gift. Motivates high-value viewer retention."
  },

  // Content Strategy Terms
  {
    term: "Engagement Rate",
    category: "Content Strategy",
    definition: "Persentase engagement (likes, comments, shares, saves) dibanding total views atau followers. Formula: (Total Engagement / Views) x 100%. Benchmark: >5% = excellent.",
    effects: "High engagement rate signal ke algorithm bahwa konten valuable. Prioritas masuk FYP dan recommendation feed.",
    advantages: "Lebih penting dari follower count untuk brand deals. 10K followers dengan 8% ER lebih valuable dari 100K followers dengan 2% ER."
  },
  {
    term: "Algorithm",
    category: "Content Strategy",
    definition: "Sistem AI TikTok yang determine video mana yang masuk FYP. Faktor utama: watch time, re-watch rate, engagement, video information (caption, sounds, hashtags).",
    effects: "Understanding algorithm = advantage besar dalam content strategy. Small tweaks bisa 10x views jika align dengan algoritma.",
    advantages: "Demokratis - creator kecil bisa viral jika konten bagus. Tidak seperti Instagram/YouTube yang follower-dependent."
  },
  {
    term: "Niche Down",
    category: "Content Strategy",
    definition: "Strategy fokus ke satu specific topic/audience vs broad content. Contoh: 'Fitness tips' → 'Home workouts untuk working moms'. Hyper-specific = hyper-engaged audience.",
    effects: "Faster growth karena algorithm clearly understand content category. Higher conversion rate karena audience super relevant.",
    advantages: "Easier stand out di saturated market. Become big fish in small pond vs small fish in ocean."
  },
  {
    term: "Posting Schedule",
    category: "Content Strategy",
    definition: "Konsistensi post di jam-jam tertentu untuk maximize audience active. BIAS Analytics identify best posting times based on follower timezone dan activity patterns.",
    effects: "Post saat audience active = higher initial engagement = algorithm boost. Consistency = audience expectation dan retention.",
    advantages: "1-3 posts per hari di optimal times = 3-5x growth vs random posting. Builds loyal daily viewers."
  },
  {
    term: "Content Pillars",
    category: "Content Strategy",
    definition: "3-5 kategori konten utama yang creator rotate. Contoh: Educational, Entertaining, Behind-the-scenes, Trending sounds, Product reviews. Provides variety while maintaining niche.",
    effects: "Prevents audience burnout dari repetitive content. Algorithm appreciate content diversity within niche.",
    advantages: "Structured content planning yang sustainable long-term. Easier brainstorm ideas dengan clear categories."
  },
  {
    term: "Call-to-Action (CTA)",
    category: "Content Strategy",
    definition: "Instruction eksplisit ke audience untuk take action: 'Follow untuk part 2', 'Comment favorite dibawah', 'Share ke bestie kamu'. Direct prompts increase engagement.",
    effects: "Video dengan CTA dapat 2-3x more engagement vs no CTA. Audience perlu reminder untuk interact, especially new viewers.",
    advantages: "Simple tactic dengan high ROI. Literally just asking = more engagement."
  },
  {
    term: "Trending Sounds",
    category: "Content Strategy",
    definition: "Audio tracks yang viral dan banyak dipakai creators. Using trending sound = higher chance masuk FYP karena sound sudah punya momentum di algorithm.",
    effects: "Video dengan trending sound perform 40-70% better vs non-trending. Capitalize on existing discovery pathway.",
    advantages: "Easy find di TikTok Creative Center atau Trend Radar BIAS. No brainer untuk boost visibility."
  },
  {
    term: "Retention Rate",
    category: "Content Strategy",
    definition: "Persentase video yang ditonton audience. Full retention = 100% watched sampai end. High retention (>60%) = strong signal untuk algorithm.",
    effects: "Algorithm prioritas video dengan high retention. Even views sedikit tapi retention tinggi, FYP chance besar.",
    advantages: "Focus on retention > going viral. Sustainable growth dari quality engaged audience."
  },
  {
    term: "Value-Add Content",
    category: "Content Strategy",
    definition: "Konten yang provide tangible value: education, entertainment, inspiration, atau information. Opposite dari low-effort content yang cuma farming engagement.",
    effects: "High save rate dan re-watch potential. Audience return karena consistently dapat value dari content.",
    advantages: "Builds authority dan trust. Foundation untuk monetization melalui brand deals, products, atau services."
  }
];

export const categories = [
  "TikTok Platform",
  "BIAS Analysis", 
  "Audio/Video",
  "TikTok Slang",
  "Live Streaming",
  "Content Strategy"
] as const;
