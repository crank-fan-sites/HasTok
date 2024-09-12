import type { NextPage, GetStaticProps } from "next";
import HasTok from './hastok';
import { HasTokProps } from '../types/tiktok';
import { getSocialMediaData } from '../lib/socialMediaApi';

const Home: NextPage<HasTokProps> = (props) => {
  return <HasTok {...props} />;
};

export const getStaticProps: GetStaticProps<HasTokProps> = async () => {
  try {
    const socialMediaData = await getSocialMediaData();

    return {
      props: {
        socialMediaData,
      },
      revalidate: 60 * 5, // 5 min
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        socialMediaData: {
          tiktok: {
            initialVideos: [],
            totalVideos: 0,
            pageSize: 24,
            initialSortBy: 'created',
          },
        },
      },
      revalidate: 60 * 5
    };
  }
};

export default Home;
