import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, CheckCircle, ExternalLink } from "lucide-react";
import { SiInstagram, SiYoutube, SiX } from "react-icons/si";

interface ProfileHeaderProps {
  username: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  followers: number;
  following?: number;
  likes: number;
  videos: number;
  externalLinks?: Array<{
    platform: string;
    url: string;
  }>;
  timestamp: string;
  onExport?: () => void;
  onShare?: () => void;
}

export function ProfileHeader({
  username,
  nickname,
  bio,
  avatarUrl,
  isVerified,
  followers,
  following,
  likes,
  videos,
  externalLinks,
  timestamp,
  onExport,
  onShare,
}: ProfileHeaderProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <SiInstagram className="h-4 w-4" />;
      case 'youtube': return <SiYoutube className="h-4 w-4" />;
      case 'twitter': return <SiX className="h-4 w-4" />;
      case 'x': return <SiX className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-20 w-20 ring-2 ring-primary/10">
          <AvatarImage src={avatarUrl} alt={nickname} />
          <AvatarFallback className="text-2xl">{nickname.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight" data-testid="text-nickname">{nickname}</h1>
                {isVerified && (
                  <CheckCircle className="h-5 w-5 text-primary fill-primary/20" data-testid="icon-verified" />
                )}
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-username">@{username}</p>
              {bio && (
                <p className="text-sm mt-2 max-w-2xl text-muted-foreground" data-testid="text-bio">{bio}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onShare} data-testid="button-share">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={onExport} data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-3">
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums" data-testid="metric-followers">{formatNumber(followers)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            {following !== undefined && (
              <div>
                <p className="text-2xl font-bold font-mono tabular-nums" data-testid="metric-following">{formatNumber(following)}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            )}
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums" data-testid="metric-likes">{formatNumber(likes)}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tabular-nums" data-testid="metric-videos">{formatNumber(videos)}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Analyzed {timestamp}
            </Badge>
            {externalLinks && externalLinks.length > 0 && (
              <>
                <span className="text-muted-foreground">•</span>
                {externalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-external-${link.platform.toLowerCase()}`}
                  >
                    {getPlatformIcon(link.platform)}
                    <span>{link.platform}</span>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
