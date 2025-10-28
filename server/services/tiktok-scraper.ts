import type { TikTokProfile } from "@shared/schema";

export async function scrapeTikTokProfile(input: string): Promise<TikTokProfile> {
  try {
    let url = "";
    if (input.includes("tiktok.com")) {
      url = input;
    } else {
      const cleanUsername = input.replace("@", "");
      url = `https://www.tiktok.com/@${cleanUsername}`;
    }

    console.log(`[TikTok Scraper] Fetching profile: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`TikTok account not found. Please check the username and try again.`);
      } else if (response.status === 403) {
        throw new Error(`Access denied. This account may be private or region-restricted.`);
      } else if (response.status === 429) {
        throw new Error(`Too many requests. Please wait a moment and try again.`);
      }
      throw new Error(`Failed to fetch TikTok profile (Status: ${response.status})`);
    }

    const html = await response.text();

    // Extract basic metrics
    const followersMatch = html.match(/"followerCount":(\d+)/);
    const followingMatch = html.match(/"followingCount":(\d+)/);
    const likesMatch = html.match(/"heartCount":(\d+)/);
    const videosMatch = html.match(/"videoCount":(\d+)/);
    const nicknameMatch = html.match(/"nickname":"([^"]+)"/);
    const usernameMatch = html.match(/"uniqueId":"([^"]+)"/) || 
                         html.match(/@([a-zA-Z0-9_.]+)/);

    // Extract bio/description
    const bioMatch = html.match(/"signature":"([^"]+)"/);
    const bio = bioMatch ? bioMatch[1].replace(/\\n/g, '\n').replace(/\\u[\dA-F]{4}/gi, '') : undefined;

    // Extract avatar URL
    const avatarMatch = html.match(/"avatarLarger":"([^"]+)"/);
    const avatarUrl = avatarMatch ? avatarMatch[1].replace(/\\u002F/g, '/') : undefined;

    // Extract verified status
    const verifiedMatch = html.match(/"verified":(true|false)/);
    const isVerified = verifiedMatch ? verifiedMatch[1] === 'true' : false;

    // Extract external links
    const externalLinks: Array<{platform: string, url: string}> = [];
    
    // Instagram link
    const instagramMatch = html.match(/"instagram":"([^"]+)"/);
    if (instagramMatch && instagramMatch[1]) {
      externalLinks.push({
        platform: 'Instagram',
        url: `https://instagram.com/${instagramMatch[1]}`
      });
    }

    // YouTube link
    const youtubeMatch = html.match(/"youtube":"([^"]+)"/);
    if (youtubeMatch && youtubeMatch[1]) {
      externalLinks.push({
        platform: 'YouTube',
        url: `https://youtube.com/${youtubeMatch[1]}`
      });
    }

    // Twitter link
    const twitterMatch = html.match(/"twitter":"([^"]+)"/);
    if (twitterMatch && twitterMatch[1]) {
      externalLinks.push({
        platform: 'Twitter',
        url: `https://twitter.com/${twitterMatch[1]}`
      });
    }

    // Extract bioLink if available
    const bioLinkMatch = html.match(/"bioLink":\{"link":"([^"]+)"/);
    if (bioLinkMatch && bioLinkMatch[1]) {
      externalLinks.push({
        platform: 'Website',
        url: bioLinkMatch[1]
      });
    }

    const extractedUsername = usernameMatch 
      ? usernameMatch[1] 
      : input.replace("@", "").split("/").pop() || "unknown";

    if (!followersMatch && !likesMatch && !videosMatch) {
      console.warn(`[TikTok Scraper] Could not extract profile data. Account may be private or TikTok changed their page structure.`);
      throw new Error(`Could not extract profile data. The account may be private, blocked, or the page structure has changed.`);
    }

    const profile = {
      username: extractedUsername,
      nickname: nicknameMatch ? nicknameMatch[1] : "Unknown User",
      bio,
      avatarUrl,
      isVerified,
      followers: followersMatch ? parseInt(followersMatch[1]) : 0,
      following: followingMatch ? parseInt(followingMatch[1]) : undefined,
      likes: likesMatch ? parseInt(likesMatch[1]) : 0,
      videos: videosMatch ? parseInt(videosMatch[1]) : 0,
      externalLinks: externalLinks.length > 0 ? externalLinks : undefined,
    };

    console.log(`[TikTok Scraper] Successfully scraped @${profile.username}:`);
    console.log(`  - ${profile.followers} followers, ${profile.following || '?'} following`);
    console.log(`  - ${profile.videos} videos, ${profile.likes} total likes`);
    console.log(`  - Verified: ${profile.isVerified ? 'Yes' : 'No'}`);
    console.log(`  - Bio: ${profile.bio ? profile.bio.substring(0, 50) + '...' : 'None'}`);
    console.log(`  - External links: ${externalLinks.length}`);

    return profile;
  } catch (error) {
    throw new Error(`Failed to scrape TikTok profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}
