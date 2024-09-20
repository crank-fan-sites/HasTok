import type { NextPage, GetStaticProps } from "next";
import HasTok from './hastok';
import { HasTokProps } from '../types/tiktok';
import { getSocialMediaData } from '../lib/socialMediaApi';

const Home: NextPage<HasTokProps> = (props) => {
  return <HasTok {...props} />;
};

export const getStaticProps: GetStaticProps<HasTokProps> = async () => {
  try {
    // an array, pass as one or multiple usernames
    const usernames: string[] = []; // Explicitly type as string array
    const socialMediaData = await getSocialMediaData(usernames);

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
            usernames: null,
          },
        },
      },
      revalidate: 60 * 5
    };
  }
};

export default Home;
