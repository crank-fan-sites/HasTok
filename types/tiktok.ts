export interface TikTokVideoType {
  id?: string;
  tiktok_id: string;
  author: {
    unique_id: string;
    nickname: string;
    avatar: string;
  };
  created: string | number; // Assuming it's a timestamp or date string
  desc: string;
  collected: number;
  comments: number;
  plays: number;
  shares: number;
  cover: string;
  duration: number;
}

export interface TikTokPapiData {
  initialVideos: TikTokVideoType[];
  totalVideos: number;
  pageSize: number;
  initialSortBy: 'created' | 'plays';
  username?: string;  // Add this line
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
  username?: string;
}