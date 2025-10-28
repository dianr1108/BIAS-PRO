export interface LayerInsights {
  description: string;
  strengths: string[];
  opportunities: string[];
  quickWins: string[];
  examples: {
    dos: string[];
    donts: string[];
  };
  templates?: string[];
  benchmarks?: {
    poor: number;
    average: number;
    good: number;
    excellent: number;
  };
}

export const getLayerInsights = (
  layerName: string,
  score: number,
  profile: {
    followers: number;
    videos: number;
    isVerified?: boolean;
    bio?: string;
  }
): LayerInsights => {
  const isSmallCreator = profile.followers < 10000;
  const isMidCreator = profile.followers >= 10000 && profile.followers < 100000;
  const isLargeCreator = profile.followers >= 100000;

  switch (layerName.toLowerCase()) {
    case 'visual':
    case 'visual performance':
      return {
        description: score >= 70
          ? "Visual presentation Anda sudah kuat! Konsistensi branding dan thumbnail quality tinggi. Fokus pada micro-improvements untuk hasil maksimal."
          : score >= 40
          ? "Visual content Anda cukup baik, tapi ada peluang besar untuk improvement. Konsistensi warna dan framing bisa ditingkatkan untuk engagement lebih tinggi."
          : "Visual presentation perlu perhatian serius. Thumbnail dan color grading yang lemah bisa drastis menurunkan CTR dan retention.",
        strengths: score >= 60 ? [
          "Thumbnail sudah eye-catching dengan kontras baik",
          "Konsistensi color palette terlihat di beberapa video",
          "Framing dan komposisi mengikuti rule of thirds",
        ] : [
          "Ada beberapa video dengan visual yang bagus",
          "Potensi besar untuk improvement",
        ],
        opportunities: [
          score < 70 ? "Tingkatkan konsistensi thumbnail design - gunakan template yang sama untuk branding" : "A/B test thumbnail variations untuk optimize CTR",
          "Implementasi color grading preset untuk consistency across videos",
          isSmallCreator ? "Invest di ring light (mulai Rp 150K) untuk dramatic improvement" : "Upgrade lighting setup dengan 3-point lighting system",
          "Pelajari basic color theory - warm colors (merah, orange) lebih engaging untuk content motivasi/energik",
        ],
        quickWins: [
          "Buat 3 thumbnail template di Canva - pakai font bold, contrast tinggi",
          "Record saat golden hour (sunrise/sunset) atau pakai window light",
          "Pilih 3 warna brand Anda dan stick to it - consistency = recognition",
          "Cut frame pertama yang boring - hook harus visual dalam 0.5 detik",
        ],
        examples: {
          dos: [
            "Pakai bright, saturated colors untuk thumbnail (lebih noticeable)",
            "Konsisten dengan branding - sama font, sama layout",
            "Rule of thirds - posisi wajah di 1/3 frame, bukan center",
            "Background rapi/blur - fokus ke subject",
          ],
          donts: [
            "Thumbnail gelap atau low contrast",
            "Ganti-ganti style tiap video (inconsistent branding)",
            "Terlalu banyak text di thumbnail (max 3-5 kata)",
            "Background berantakan yang distract dari subject",
          ],
        },
        templates: [
          "Thumbnail Formula: [Wajah ekspresif close-up] + [3 kata hook text] + [Brand color background]",
          "Color Grading: Saturation +15%, Contrast +20%, Highlights -10%, Shadows +15%",
          "Safe Frame: Posisi wajah di grid 1/3 kanan atau kiri, eye-level dengan kamera",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'audio':
    case 'audio quality':
      return {
        description: score >= 70
          ? "Audio quality Anda solid! Musik dan voice balance sudah bagus. Fokus pada trending sound selection untuk maximize reach."
          : score >= 40
          ? "Audio cukup clear tapi ada room untuk improvement. Volume balancing dan sound selection bisa lebih strategic."
          : "Audio quality perlu attention. Poor audio = viewer skip dalam 2 detik. Ini critical untuk retention!",
        strengths: score >= 60 ? [
          "Voice clarity bagus - tidak ada background noise yang mengganggu",
          "Music volume balance dengan voice sudah proper",
          "Pemilihan sound kadang trending (good for reach)",
        ] : [
          "Audio audible dan understandable",
          "Ada awareness untuk pakai musik",
        ],
        opportunities: [
          "Leverage trending sounds lebih aggressive - check TikTok Creative Center daily",
          score < 60 ? "Invest di clip-on mic (Rp 100-300K) - audio quality naik 10x" : "Test different mic positions untuk optimal voice capture",
          "Pakai sound yang sudah viral 100K+ posts tapi belum oversaturated",
          "Tambah sound effects di moment penting (whoosh, pop, ding) untuk engagement",
        ],
        quickWins: [
          "Pakai trending sound yang viral dalam 24 jam terakhir (check FYP page)",
          "Record di ruangan kecil/closet untuk less echo, better clarity",
          "Test audio di speaker HP - bukan headphone! (most viewers pakai speaker)",
          "Sync gerakan/transition dengan beat drop musik = algorithm boost",
        ],
        examples: {
          dos: [
            "Pakai trending sound yang viral tapi relevant ke content",
            "Voice harus 3-5dB lebih loud dari background music",
            "Sync action/cut/transition dengan beat musik",
            "Sound effect subtle di moment penting (tidak berlebihan)",
          ],
          donts: [
            "Pakai original sound yang tidak trending (unless you're big creator)",
            "Background music too loud - voice tenggelam",
            "Echo/reverb yang mengganggu (record di ruang kecil)",
            "Sound effects terlalu banyak (jadi noisy/annoying)",
          ],
        },
        templates: [
          "Sound Strategy: 70% trending sounds + 30% original (build brand voice)",
          "Volume Mix: Voice -3dB, Music -18dB, SFX -12dB (relative to peak)",
          "Trending Sound Timing: Pakai sound yang viral 2-7 hari (sweet spot sebelum oversaturated)",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'energy':
    case 'energy level':
      return {
        description: score >= 70
          ? "Energy level Anda luar biasa! Audience feel the vibe. Maintain momentum ini dan experiment dengan pacing variations."
          : score >= 40
          ? "Energy cukup present tapi inconsistent. Kadang flat di beberapa bagian. Pacing dan enthusiasm bisa lebih intentional."
          : "Energy level terlalu rendah. TikTok adalah platform high-energy - low energy = scroll. Ini #1 factor untuk retention!",
        strengths: score >= 60 ? [
          "Opening hook energetic - grabbing attention dalam 3 detik",
          "Vocal variety dan intonasi engaging",
          "Body language ekspresif dan dynamic",
        ] : [
          "Ada moment-moment yang energetic",
          "Awareness untuk create excitement",
        ],
        opportunities: [
          "Start EVERY video dengan high energy - first 3 seconds determine scroll/stay",
          score < 60 ? "Practice vocal projection - speak 30% louder dan 20% faster dari normal conversation" : "Add micro-pauses sebelum punchline untuk build tension",
          "Use hand gestures more - movement = engagement (tapi tidak berlebihan)",
          "Vary your pacing - fast untuk build up, slow untuk emphasis",
        ],
        quickWins: [
          "Start video dengan gerakan tiba-tiba atau suara loud (pattern interrupt)",
          "First sentence harus question atau shocking statement",
          "Hand gestures di setiap point penting - 3x lebih engaging",
          "Cut every 2-3 seconds - fast cuts = perceived high energy",
        ],
        examples: {
          dos: [
            "Start dengan hook energetic: 'GUYS! Gak bakal percaya...'",
            "Vary vocal tone - loud untuk excitement, whisper untuk emphasis",
            "Move! Jangan static - hand gestures, body movement",
            "Fast pacing di build-up, slow down di key points",
          ],
          donts: [
            "Mulai slow/flat: 'Hai guys... jadi hari ini...' (instant scroll)",
            "Monotone sepanjang video (no vocal variety)",
            "Standing still seperti robot (no body language)",
            "Too much high energy non-stop (exhausting, no dynamics)",
          ],
        },
        templates: [
          "Hook Formula: [LOUD START] → 'Gak nyangka [shocking fact]!' → [immediate payoff in 3 sec]",
          "Energy Curve: Start HIGH (10/10) → Dip slightly (7/10 for context) → Peak again (10/10 for punchline) → End HIGH",
          "Cut Rhythm: Fast cuts (every 2 sec) for excitement, hold longer (4-5 sec) for emotional moments",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'interaction':
      return {
        description: score >= 70
          ? "Community engagement Anda excellent! Reply rate dan CTA effectiveness tinggi. Double down on what's working."
          : score >= 40
          ? "Interaction decent tapi could be more strategic. Reply timing dan CTA placement bisa optimize untuk algorithm boost."
          : "Engagement strategy perlu serious work. Algorithm prioritize creators yang engage with audience. Low interaction = low reach.",
        strengths: score >= 60 ? [
          "Responsive terhadap comment - good for algorithm",
          "CTA kadang ada di video (call audience to action)",
          "Awareness untuk build community",
        ] : [
          "Ada beberapa interaksi dengan followers",
          "Potensi untuk build engaged community",
        ],
        opportunities: [
          "Reply 50-100 comment pertama dalam 1 jam after posting = massive algorithm boost",
          "Add clear CTA di EVERY video - ask question, tag friend, share opinion",
          "Pin comment dengan question untuk encourage reply (algorithm hack)",
          "Go live minimum 1x/week untuk build deeper connection",
        ],
        quickWins: [
          "Reply dengan voice reply (bukan text) - 3x higher engagement",
          "Pin comment yang ask question - contoh: 'Siapa yang pernah alami ini?'",
          "End video dengan specific CTA: 'Comment 'YES' kalau setuju!'",
          "Set reminder reply comment di golden hour (first 60 min after post)",
        ],
        examples: {
          dos: [
            "Pin strategic question di comment pertama",
            "Reply dengan personality - bukan generic 'thanks'",
            "Ask controversial question untuk spark discussion",
            "Create content dari comment request (shows you listen)",
          ],
          donts: [
            "Ignore comments (algorithm punish this)",
            "Generic reply atau copy-paste response",
            "No CTA di video sama sekali",
            "Only reply ke positive comment (engage with everyone)",
          ],
        },
        templates: [
          "CTA Formula: 'Comment [specific word/emoji] kalau [relatable statement]'",
          "Pin Comment: 'Question: [provocative question]? Jawab di comment!'",
          "Reply Strategy: Reply 50 comment in first hour → 10/hour for next 5 hours → spot check after",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'linguistic':
      return {
        description: score >= 70
          ? "Caption game Anda strong! Hook dan hashtag strategy effective. Test long-form caption untuk experiment."
          : score >= 40
          ? "Caption decent tapi bisa lebih strategic. Hashtag selection dan caption length optimization needed."
          : "Linguistic strategy weak. Caption dan hashtag adalah SEO for TikTok - bad caption = invisible content.",
        strengths: score >= 60 ? [
          "Caption kadang catchy dan relatable",
          "Hashtag usage present (aware of importance)",
          "Text overlay di video cukup readable",
        ] : [
          "Ada awareness untuk tulis caption",
          "Pakai beberapa hashtag",
        ],
        opportunities: [
          "Caption hook formula: [Emoji] + [Shocking statement/question] + [Value promise]",
          "Hashtag strategy: 3 broad (10M+ posts) + 4 medium (100K-1M) + 3 niche (<100K)",
          "Test panjang caption - long caption = higher engagement IF valuable",
          "Capitalize on trending phrases - track TikTok language trends",
        ],
        quickWins: [
          "Caption line 1 HARUS hook - stop scroll dalam 1 detik reading",
          "Research hashtag - mix viral + niche (tidak semua #fyp #foryou)",
          "Add line breaks - wall of text = skip, spaced caption = readable",
          "Test ALL CAPS untuk hook words - tapi jangan overuse",
        ],
        examples: {
          dos: [
            "Hook caption: 'STOP scrolling! Ini yang...'",
            "Mix hashtag: #tiktokindonesia (broad) + #tipsbisnis (niche)",
            "Short & punchy: Max 150 characters atau break to multiple lines",
            "Natural language - write how you talk",
          ],
          donts: [
            "Generic caption: 'Check this out' (no value)",
            "10+ hashtag random (#fyp #foryou #viral spam style)",
            "Caption panjang tanpa spacing (wall of text)",
            "Formal/kaku language yang tidak match TikTok vibe",
          ],
        },
        templates: [
          "Caption Template: [Hook emoji] [Shocking statement] → [Why it matters] → [CTA] → [Hashtags]",
          "Example: '90% orang tidak tau ini! → Ini rahasia yang bikin [result] → Comment kalau kamu salah satunya! #tipstiktok #viral'",
          "Hashtag Mix: 30% Trending + 40% Medium + 30% Niche = optimal reach + relevance",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'contextual':
      return {
        description: score >= 70
          ? "Niche positioning Anda clear! Content consistency dan trend adaptation bagus. Explore sub-niches untuk expand."
          : score >= 40
          ? "Content direction ada tapi bisa lebih focused. Niche clarity dan trend-jacking bisa lebih strategic."
          : "Content terlalu random - no clear niche. TikTok algorithm reward consistency. Pick niche and dominate it!",
        strengths: score >= 60 ? [
          "Ada clear niche/tema yang consistent",
          "Kadang capitalize on trending topics",
          "Audience tau expect apa dari content Anda",
        ] : [
          "Upload content regularly",
          "Ada awareness untuk follow trends",
        ],
        opportunities: [
          "Define niche ultra-specific - contoh: bukan 'food' tapi 'makanan pedas budget 20K'",
          "Track trending topics di niche Anda daily - be first to create content",
          "Create content series (Part 1, 2, 3) untuk build anticipation",
          "Collaborate dengan creators di niche yang sama untuk cross-pollinate audience",
        ],
        quickWins: [
          "Pick 1 niche dan create 10 videos dalam niche itu (algorithm akan categorize Anda)",
          "Check TikTok Creative Center for trending hashtag di niche Anda",
          "Repurpose trending content dengan twist Anda (trending topic + your niche)",
          "Post timing: Test different times, track best performing time, stick to it",
        ],
        examples: {
          dos: [
            "Niche clarity: 'Motivasi untuk Gen Z' bukan cuma 'Motivasi'",
            "Trend-jack: Take trending sound/format, apply to YOUR niche",
            "Content series: 'Tips #1', 'Tips #2' (build loyalty)",
            "Cross-promote: Tag relevant creators, build network",
          ],
          donts: [
            "Random topics tiap video (bingung algorithm & audience)",
            "Ignore trends completely (miss huge reach opportunities)",
            "Trend-jack without adapting to your niche (feels forced)",
            "Post random times (inconsistency confuse algorithm)",
          ],
        },
        templates: [
          "Niche Formula: [Broad category] + [Specific angle] + [Target audience] → Ex: 'Finance' + 'Budget hacks' + 'Mahasiswa'",
          "Trend-jack Template: [Trending format/sound] + [Your niche expertise] = Viral potential",
          "Content Calendar: 70% niche-specific + 20% trend-jack + 10% experimental",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'environmental':
      return {
        description: score >= 70
          ? "Posting strategy Anda on point! Timing dan location awareness bagus. Optimize untuk timezone maksimal reach."
          : score >= 40
          ? "Environmental factors decent tapi bisa lebih intentional. Post timing dan audience timezone perlu research lebih."
          : "Posting strategy random - no consideration untuk best times atau audience location. Simple fix, huge impact!",
        strengths: score >= 60 ? [
          "Post di waktu yang cukup consistent",
          "Content kadang location-specific (relatable for local audience)",
          "Awareness untuk peak hours",
        ] : [
          "Upload content regularly",
          "Ada beberapa content dengan local context",
        ],
        opportunities: [
          "Analyze your audience timezone - kalau 60% Jakarta, post jam 19:00-21:00 WIB",
          "Test different posting times selama seminggu - track mana yang highest engagement",
          "Local content = higher engagement for small creators - reference local places/culture",
          isLargeCreator ? "Consider international audience - stagger posts untuk multiple timezones" : "Fokus dominasi local market dulu before go international",
        ],
        quickWins: [
          "Post jam 7-9 pagi (breakfast scroll), 12-1 siang (lunch break), 7-10 malam (prime time)",
          "Tambah location tag di video (algorithm boost for local FYP)",
          "Reference local culture/slang untuk build connection",
          "Check TikTok analytics - see when YOUR audience paling aktif",
        ],
        examples: {
          dos: [
            "Post di peak hours audience Anda (check analytics)",
            "Location tag strategic - boost local FYP",
            "Reference local context (tempat, event, culture)",
            "Consistent schedule - same time daily (algorithm friendly)",
          ],
          donts: [
            "Post random time tiap hari (inconsistent)",
            "Ignore timezone audience majority",
            "Generic content yang tidak relatable untuk target location",
            "Post saat audience tidur (wasted content)",
          ],
        },
        templates: [
          "Peak Hours Indonesia: 07:00-09:00, 12:00-13:00, 19:00-22:00 WIB",
          "Posting Schedule: 1-2 video/hari di consistent time = algorithm reward",
          "Location Strategy: Tag kota besar (Jakarta, Surabaya, Bandung) untuk local FYP boost",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    case 'governance':
      return {
        description: score >= 70
          ? "Account integrity excellent! Follower quality tinggi, engagement authentic. Maintain this untuk brand deal opportunities."
          : score >= 40
          ? "Governance decent tapi ada warning signs. Beberapa bot followers atau engagement suspicious. Clean up needed."
          : "ALERT: Account health at risk! High bot followers atau fake engagement detected. Ini bisa sabotage reach dan brand deal potential!",
        strengths: score >= 60 ? [
          "Engagement rate healthy (real audience, bukan bot)",
          "Follower growth organic dan sustainable",
          "Content compliant dengan TikTok guidelines",
        ] : [
          "Masih ada organic followers",
          "Awareness untuk build real community",
        ],
        opportunities: [
          score < 50 ? "URGENT: Remove bot followers - pakai 'Block fake accounts' feature" : "Monitor engagement quality - real comments vs generic spam",
          "Content compliance check - avoid grey-area topics (politik, religion extreme views)",
          "Build authentic engagement - giveaway yang require effort (bukan cuma 'follow & comment')",
          "Track follower/following ratio - ideal 10:1 atau lebih untuk credibility",
        ],
        quickWins: [
          "Block spam accounts yang comment generic stuff ('Nice', 'Cool', emoji spam)",
          "Content audit - delete video yang violate atau perform buruk (clean profile)",
          "Organic growth tactics - collaborate, duet, stitch dengan real creators",
          "Check analytics - sudden follower spike = red flag, investigate source",
        ],
        examples: {
          dos: [
            "Grow organic - real engagement beats fake numbers",
            "Giveaway smart - require thoughtful comment, not just 'follow'",
            "Content clean - avoid controversial/grey topics",
            "Block bot account immediately (protect account health)",
          ],
          donts: [
            "Buy followers/likes (detected by algorithm, ruin account)",
            "Engagement pods atau sub4sub (fake engagement kill reach)",
            "Post content yang borderline violate (risk strike/banned)",
            "Follow/unfollow spam tactics (low-quality growth)",
          ],
        },
        templates: [
          "Healthy Metrics: Engagement rate 5-15%, Follower/Following ratio >5:1, Comment quality >80% real",
          "Growth Strategy: Organic content + Strategic collab + Community engagement = Sustainable growth",
          "Red Flags: Sudden follower spike + Low engagement + Generic comments = Bot attack or fake growth",
        ],
        benchmarks: {
          poor: 39,
          average: 59,
          good: 79,
          excellent: 80,
        },
      };

    default:
      return {
        description: "Detailed analysis for this layer.",
        strengths: ["Good performance overall"],
        opportunities: ["Continue improving"],
        quickWins: ["Implement best practices"],
        examples: {
          dos: ["Follow guidelines"],
          donts: ["Avoid common mistakes"],
        },
      };
  }
};
