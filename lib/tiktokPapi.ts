/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDirectus, rest, authentication, readItems, aggregate } from '@directus/sdk';
import { TikTokPapiData } from '../types/tiktok';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055")
  .with(rest())
  .with(authentication());

export async function getTikTokData(pageSize: number, sortBy: 'created' | 'plays', usernames: string[] | null): Promise<TikTokPapiData> {
  await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

  console.log('Fetching TikTok data...', usernames ? `for users: ${usernames.join(', ')}` : 'for all users');

  const filter: any = {};
  if (usernames && usernames.length > 0) {
    filter['author'] = {
      unique_id: {
        _in: usernames
      }
    };
  }

  try {
    const [initialVideos, totalCountResult] = await Promise.all([
      directus.request(
        readItems('tiktok_videos', {
          limit: pageSize,
          fields: ['*', 'author.*'],
          sort: [`-${sortBy}`],
          filter: filter,
        })
      ),
      directus.request(
        aggregate('tiktok_videos', {
          aggregate: { count: 'id' },
          filter: filter,
        })
      )
    ]);
    
    const totalVideos = totalCountResult && Array.isArray(totalCountResult) && totalCountResult.length > 0
      ? totalCountResult[0].count.id
      : 0;

    console.log(`Fetched ${initialVideos.length} initial TikTok videos. Total videos: ${totalVideos}`);

    return {
      initialVideos,
      totalVideos,
      pageSize,
      initialSortBy: sortBy,
      usernames: usernames || null,
    };
  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    throw error;
  }
}