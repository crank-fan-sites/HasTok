import type { NextApiRequest, NextApiResponse } from 'next';
import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page, pageSize, sortBy, dateFilter, usernames } = req.query;

  // Validate sortBy parameter
  const validSortBy = ['created', 'plays'].includes(sortBy as string) ? sortBy : 'created';

  // Calculate the date for filtering
  let filterDate;
  const day = 24 * 60 * 60 * 1000;
  switch (dateFilter) {
    case 'day':
      filterDate = new Date(Date.now() - day);
      break;
    case 'week':
      filterDate = new Date(Date.now() - 7 * day);
      break;
    case 'month':
      filterDate = new Date(Date.now() - 30 * day);
      break;
    case 'year':
      filterDate = new Date(Date.now() - 365 * day);
      break;
    default:
      filterDate = null;
  }

  try {
    await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

    const filter: any = {};
    if (filterDate) {
      filter.created = {
        _gte: filterDate.toISOString(),
      };
    }
    if (usernames) {
      filter.author = {
        unique_id: {
          _in: usernames
        }
      };
    }

    console.log('Filter:', JSON.stringify(filter, null, 2)); // Debug log

    const videos = await directus.request(
      readItems('tiktok_videos', {
        limit: Number(pageSize),
        page: Number(page),
        fields: ['*', 'author.*'],
        sort: [`-${validSortBy}`],
        filter: filter,
      })
    );

    console.log(`Fetched ${videos.length} videos`); // Debug log

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
}