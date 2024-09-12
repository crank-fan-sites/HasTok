export interface TikTokVideo {
  id: string;
  // Add other fields as needed
}

export interface HasTokProps {
  initialVideos: TikTokVideo[];
  pageSize: number;
  totalVideos: number;
  initialSortBy: 'created' | 'plays';
}