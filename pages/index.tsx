import type { NextPage, GetStaticProps } from "next";
import HasTok from './hastok';
import { HasTokProps } from '../types/tiktok';
import { getSocialMediaData } from '../lib/socialMediaApi';

const Home: NextPage<HasTokProps> = (props) => {
  return <HasTok {...props} />;
};

export const getStaticProps: GetStaticProps<HasTokProps> = async () => {
  try {
    // If you want to manually set a username, you can do it here
    const username = null; // or 'someusername' if you want to filter
    const socialMediaData = await getSocialMediaData(username);

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
            username: null, // or 'someusername' if you set it above
          },
        },
      },
      revalidate: 60 * 5
    };
  }
};

export default Home;
