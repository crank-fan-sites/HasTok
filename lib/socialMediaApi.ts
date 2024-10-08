import { SocialMediaData } from '../types/tiktok';
import { getTikTokData } from './tiktokPapi';

export async function getSocialMediaData(usernames: string[] | null): Promise<SocialMediaData> {
  const tiktokData = await getTikTokData(24, 'created', usernames);

  return {
    tiktok: tiktokData,
    // Add other social media platforms here as they are implemented
  };
}