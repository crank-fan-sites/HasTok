import type { NextApiRequest, NextApiResponse } from 'next';
import { createDirectus, rest, authentication, readItems, aggregate } from '@directus/sdk';

if (!process.env.DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = '1', pageSize = '20', sortBy = 'followers' } = req.query;

  try {
    const email = process.env.DIRECTUS_ADMIN_EMAIL;
    const password = process.env.DIRECTUS_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('Directus admin credentials are not set in environment variables');
    }
    await directus.login(email, password);

    const [users, totalCountResult] = await Promise.all([
      directus.request(
        readItems('tiktok_users', {
          fields: ['id', 'unique_id', 'nickname', 'avatar', 'followers', 'following', 'hearts', 'videos', 'last_video_activity'],
          sort: [`-${sortBy}`],
          limit: Number(pageSize),
          page: Number(page),
        })
      ),
      directus.request(
        aggregate('tiktok_users', {
          aggregate: { count: 'id' },
        })
      )
    ]);
    
    // to avoid having to deal with
    // "Property 'id' does not exist on type 'string'."
    // @ts-expect-error: Property 'id' does not exist on type 'string'
    const totalUsers = totalCountResult[0]?.count?.id ?? 0;

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    console.error('Error fetching TikTok users:', error);
    res.status(500).json({ message: 'Error fetching TikTok users' });
  }
}