export interface TikTokVideo {
  id: string;
  // Add other TikTok-specific fields as needed
}

export interface TikTokPapiData {
  initialVideos: TikTokVideo[];
  totalVideos: number;
  pageSize: number;
  initialSortBy: 'created' | 'plays';
}

export interface SocialMediaData {
  tiktok: TikTokPapiData;
  // Add other social media platforms here as needed
  // For example:
  // instagram: { ... };
  // youtube: { ... };
}

export interface HasTokProps {
  socialMediaData: SocialMediaData;
}