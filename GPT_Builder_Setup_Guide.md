# 🤖 BIAS ChatGPT GPT Builder Setup Guide
**Cara Bikin Custom GPT dengan BIAS API**

---

## 📋 APA ITU?

Guide ini ngajarin lo cara bikin **Custom ChatGPT** (GPT Builder) yang bisa langsung akses BIAS API buat analisis TikTok creator secara real-time.

**Hasil akhir:** Lo bisa chat dengan ChatGPT, ketik "analyze @username", dan langsung dapet full audit report dari BIAS! 🚀

---

## 🎯 KEBUTUHAN

- [ ] ChatGPT Plus account (untuk akses GPT Builder)
- [ ] File `gpt-builder-manifest.json` (udah ada di repo ini)
- [ ] 10-15 menit waktu setup

---

## 🚀 LANGKAH-LANGKAH SETUP

### **Step 1: Buka GPT Builder**

1. Login ke ChatGPT (https://chat.openai.com)
2. Klik nama lo di pojok kiri bawah
3. Pilih **"My GPTs"**
4. Klik **"Create a GPT"**

---

### **Step 2: Configure GPT**

Di tab **"Create"**, kasih instruksi berikut:

```
Create a TikTok intelligence assistant named "BIAS" that analyzes TikTok creators using 8 behavioral layers. 

It should:
- Analyze profiles when asked (e.g., "analyze @username")
- Provide trending sounds and hashtags
- Give actionable growth strategies
- Respond in casual Indonesian (Bahasa Indonesia)
- Be friendly, supportive, and motivating

Use the BIAS API at https://bias23.replit.app
```

---

### **Step 3: Configure Actions (PENTING!)**

1. **Klik tab "Configure"** (di atas)

2. **Scroll ke bawah** sampai nemu section **"Actions"**

3. **Klik "Create new action"**

4. **Import Schema:** Ada 2 cara

   **Cara A - Upload JSON (Recommended):**
   - Klik **"Import from URL"**
   - Atau upload file `gpt-builder-manifest.json`
   - Schema auto-import ✅

   **Cara B - Manual (Kalau gak ada file):**
   - Copy-paste OpenAPI schema dari `gpt-builder-manifest.json`
   - Paste ke schema editor
   - Klik **"Save"**

5. **Verify Endpoints:**
   Lo harus lihat 4 endpoints muncul:
   - `analyzeProfile` - GET /api/analyze
   - `getTrends` - GET /api/trends
   - `getCompetitors` - GET /api/competitors
   - `getLiveStreams` - GET /api/live

6. **Test Authentication:**
   - Authentication Type: **None**
   - Klik **"Test"** untuk verify endpoints bisa diakses

---

### **Step 4: Customize GPT Profile**

Di tab **"Configure"**, isi:

**Name:**
```
BIAS - TikTok Intelligence
```

**Description:**
```
Analyze TikTok creators with 8-layer behavioral scoring. Get insights on profile performance, trending sounds, competitor intelligence, and live stream analytics.
```

**Instructions:**
```
You are BIAS AI, a TikTok intelligence assistant specializing in creator analysis. 

When users ask about TikTok accounts:
1. Use analyzeProfile() to get comprehensive behavioral analysis
2. Interpret the 8 layers: VBM (visual), ABM (audio), BIFS (energy), EPM (interaction), NLP (linguistic), BRM (contextual), EnvTech (environmental), BMIL (governance)
3. Use getTrends() to recommend trending sounds/hashtags
4. Use getCompetitors() and getLiveStreams() when available
5. Provide insights in casual Indonesian (Bahasa Indonesia) unless asked in English
6. Focus on actionable recommendations, not just numbers
7. Explain scores in simple terms (80+ = excellent, 60-79 = good, 40-59 = average, <40 = needs improvement)
8. Always mention governance/bot detection if BMIL < 70
9. Give growth strategies based on weak layers
10. Be friendly, supportive, and motivating

Example response style:
"Wah @username punya 50K followers dengan engagement rate 1.2% - ini BAGUS! 🔥 Visual score 85 menunjukkan kualitas video udah oke banget. Tapi interaction score 45 agak rendah - coba lebih aktif reply komentar dan bikin konten yang encourage engagement ya!"
```

**Conversation Starters:**
```
Analyze @charlidamelio
What's trending on TikTok right now?
Compare my account with competitors
How can I improve my engagement rate?
```

**Upload Logo (Optional):**
- Upload BIAS logo atau skip dulu

---

### **Step 5: Test Your GPT!**

1. **Klik "Save"** di pojok kanan atas

2. **Test di chat window:**
   ```
   analyze @newsmaker23_talk
   ```

3. **Lo harus dapet response** dengan:
   - Profile stats (followers, videos, engagement)
   - 8 layer scores (VBM, ABM, BIFS, dll)
   - AI insights dan recommendations
   - Governance/bot detection info

4. **Test trending sounds:**
   ```
   What's trending on TikTok?
   ```

5. **Kalau semua work** → ✅ **GPT lo udah ready!**

---

### **Step 6: Publish (Optional)**

Kalau mau share ke orang lain:

1. Klik **"Publish"** di pojok kanan atas
2. Pilih visibility:
   - **"Only me"** - Private
   - **"Anyone with a link"** - Semi-public
   - **"Public"** - Listed di GPT Store
3. Klik **"Confirm"**

---

## 🎨 EXAMPLE CONVERSATIONS

### **Analyze Profile:**
```
User: analyze @charlidamelio

BIAS GPT: 
Wah @charlidamelio ini LEGEND! 🔥

📊 Profile Stats:
- Followers: 152M
- Videos: 2,840
- Engagement Rate: 2.3% (EXCELLENT untuk akun besar!)

🎯 8-Layer Analysis:
✅ VBM (Visual): 95/100 - Video quality top tier!
✅ ABM (Audio): 92/100 - Music choice on point
✅ BIFS (Energy): 98/100 - Energi super tinggi!
... (dst)

💡 Insights:
Lo bisa belajar dari Charli tentang...
```

### **Get Trends:**
```
User: What's trending right now?

BIAS GPT:
Ini 5 trending sounds yang lagi HOT banget! 🔥

🎵 Trending Sounds:
1. Cupid - FIFTY FIFTY (Sped Up)
   - Viral Score: 95/100
   - Opportunity: HIGH
   - Best time to post: 19:00, 21:00
...
```

---

## 🔧 TROUBLESHOOTING

### **Problem: "Action failed to execute"**

**Solution:**
- Check API endpoint: https://bias23.replit.app/api/analyze?username=@test
- Verify CORS enabled (should be auto)
- Re-import schema di Actions tab

### **Problem: "Invalid schema"**

**Solution:**
- Delete existing action
- Re-create with fresh import dari `gpt-builder-manifest.json`
- Make sure OpenAPI format valid

### **Problem: GPT gak ngerti command**

**Solution:**
- Update Instructions di Configure tab
- Tambahkan conversation starters yang lebih spesifik
- Test dengan example prompts di atas

### **Problem: "No data available"**

**Solution:**
- Untuk competitors & live streams: Data harus di-analyze dulu via web app (bias23.replit.app)
- Profile analysis: Real-time, harusnya langsung work

---

## 💡 TIPS & BEST PRACTICES

### **Untuk Users:**
- ✅ Selalu sertakan @ sebelum username
- ✅ Gunakan bahasa Indonesia buat response yang lebih natural
- ✅ Tanya follow-up questions buat insight lebih dalam
- ✅ Request competitor comparison setelah analyze profile

### **Untuk Creators:**
- ✅ Analyze profile sendiri dulu sebelum competitor
- ✅ Check trending sounds sebelum bikin konten
- ✅ Follow recommendations buat improve weak layers
- ✅ Track progress dengan analyze ulang tiap minggu

---

## 📊 LAYER ABBREVIATIONS (Quick Reference)

| Layer | Full Name | What It Measures |
|-------|-----------|------------------|
| **VBM** | Visual Behavioral Metrics | Video quality, composition, aesthetics |
| **ABM** | Audio Behavioral Metrics | Sound quality, music choice, voice clarity |
| **BIFS** | Behavioral Interaction & Follower Signals | Energy, pacing, enthusiasm |
| **EPM** | Engagement & Participation Metrics | Comments, shares, interactions |
| **NLP** | Natural Language Processing | Caption quality, hashtags, messaging |
| **BRM** | Brand Relevance Metrics | Contextual alignment with trends |
| **EnvTech** | Environmental & Technical Metrics | Lighting, setting, production quality |
| **BMIL** | Bot/Manipulation Integrity Level | Authenticity, fake follower detection |

**Score Interpretation:**
- 🔥 **80-100:** Excellent - Top tier performance
- ✅ **60-79:** Good - Above average, solid work
- ⚠️ **40-59:** Average - Room for improvement
- 🚨 **0-39:** Needs Work - Focus area for growth

---

## 🎯 ADVANCED FEATURES

### **Multi-Account Analysis:**
```
Compare @account1, @account2, and @account3
```

### **Trend-Based Recommendations:**
```
analyze @myaccount and recommend trending sounds that match my style
```

### **Growth Strategy:**
```
I have 10K followers, help me get to 50K in 3 months
```

---

## 📝 CHECKLIST FINAL

Before publishing your GPT, make sure:

- [ ] All 4 API endpoints tested dan working
- [ ] Instructions clear dan comprehensive
- [ ] Conversation starters relevan
- [ ] Privacy setting sesuai kebutuhan
- [ ] Description menarik buat potential users
- [ ] Test dengan minimal 3 different profiles

---

## 🎉 SELESAI!

Lo udah berhasil bikin BIAS Custom GPT! Sekarang lo punya:

✅ Real-time TikTok creator analysis  
✅ Trending sounds & hashtags  
✅ Competitor intelligence  
✅ AI-powered insights  
✅ Conversational interface  

**Next steps:**
1. Share ke creator friends
2. Analyze competitors
3. Build growth strategies
4. Track performance over time

---

## 📞 SUPPORT

**Butuh bantuan?**
- Web App: https://bias23.replit.app
- API Docs: `BIAS_API_Documentation.md`
- Manifest File: `gpt-builder-manifest.json`

**Found a bug?**
- Report via web app
- Include error message & screenshots

---

**Happy analyzing! 🚀💯**

*Built with ❤️ by BIAS Team*
