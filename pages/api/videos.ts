import type { NextApiRequest, NextApiResponse } from 'next';
import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page, pageSize, sortBy } = req.query;

  // Validate sortBy parameter
  const validSortBy = ['created', 'plays'].includes(sortBy as string) ? sortBy : 'created';

  try {
    await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

    const videos = await directus.request(
      readItems('tiktok_videos', {
        limit: Number(pageSize),
        page: Number(page),
        fields: ['*', 'author.*'],
        sort: [`-${validSortBy}`], // Use the sortBy parameter here
      })
    );

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
}