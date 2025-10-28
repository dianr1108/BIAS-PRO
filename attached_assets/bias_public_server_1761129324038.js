
// ===============================
// BIAS Public TikTok Connector (Open Data Mode)
// v2026 - Created for Behavioral Intelligence Audit System
// ===============================

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ======== Root test =========
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "BIAS Public TikTok Connector active 🚀",
  });
});

// ======== TikTok Analyzer Route =========
app.post("/analyze", async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "No TikTok URL or username provided." });

  try {
    // Deteksi username atau URL
    let url = "";
    if (input.includes("tiktok.com")) {
      url = input;
    } else {
      url = `https://www.tiktok.com/@${input.replace("@", "")}`;
    }

    // Ambil HTML publik dari TikTok
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      },
    });
    const html = await response.text();

    // Analisis sederhana dari halaman (open data)
    const followersMatch = html.match(/"followerCount":(\d+)/);
    const likesMatch = html.match(/"heartCount":(\d+)/);
    const videosMatch = html.match(/"videoCount":(\d+)/);
    const nicknameMatch = html.match(/"nickname":"([^"]+)"/);

    const result = {
      username: input,
      nickname: nicknameMatch ? nicknameMatch[1] : "Unknown",
      followers: followersMatch ? parseInt(followersMatch[1]) : 0,
      likes: likesMatch ? parseInt(likesMatch[1]) : 0,
      videos: videosMatch ? parseInt(videosMatch[1]) : 0,
      data_source: "OpenData",
      status: "success",
    };

    res.json(result);
  } catch (err) {
    console.error("Error fetching TikTok:", err);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
});

app.listen(PORT, () => console.log(`✅ BIAS Public Server running on port ${PORT}`));
