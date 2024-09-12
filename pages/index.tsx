import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { createDirectus, rest, authentication, readItems, aggregate } from '@directus/sdk';

import HasTok from './hastok';

import { HasTokProps, TikTokVideo } from '../types/tiktok';

interface HomeProps {
  initialVideos: TikTokVideo[];
  pageSize: number;
  totalVideos: number;
  initialSortBy: 'created' | 'plays';
}

// Initialize Directus client
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055")
  .with(rest())
  .with(authentication());

const Home: NextPage<HasTokProps> = (props) => {
  return <HasTok {...props} />;
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

    const pageSize = 24;
    const initialSortBy = 'created';

    console.log('Fetching initial videos...');
    const initialVideos = await directus.request(
      readItems('tiktok_videos', {
        limit: pageSize,
        fields: ['*', 'author.*'],
        sort: [`-${initialSortBy}`],
      })
    );
    console.log(`Fetched ${initialVideos.length} initial videos`);

    console.log('Fetching total count...');
    const totalCountResult = await directus.request(
      aggregate('tiktok_videos', {
        aggregate: { count: 'id' }
      })
    );

    console.log('Total count result:', totalCountResult);

    let totalVideos = 0;
    if (totalCountResult && Array.isArray(totalCountResult) && totalCountResult.length > 0) {
      totalVideos = totalCountResult[0].count.id;
    } else {
      console.warn('Unable to get accurate total count. Falling back to initial videos length.');
      totalVideos = initialVideos.length;
    }

    console.log(`Total videos: ${totalVideos}`);

    return {
      props: {
        initialVideos: initialVideos || [],
        pageSize: pageSize,
        totalVideos: totalVideos,
        initialSortBy: initialSortBy,
      },
      revalidate: 60 * 5, // 5 min
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialVideos: [],
        pageSize: 24,
        totalVideos: 0,
      },
      revalidate: 60 * 5
    };
  }
};

export default Home;
