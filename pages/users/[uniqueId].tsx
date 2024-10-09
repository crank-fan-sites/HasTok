import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import TopLinks from '@/components/topLinks';
import TiktokVideos from '@/components/tiktok/videos';
import { TikTokUser, TikTokVideoType } from '@/types/tiktok';

if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest())
  .with(authentication());

interface UserPageProps {
  user: TikTokUser;
  videos: TikTokVideoType[];
}

const UserPage: React.FC<UserPageProps> = ({ user, videos }) => {
  return (
    <>
      <Head>
        <title>{user.nickname} - HasTok User</title>
        <meta name="description" content={`TikTok profile and videos of ${user.nickname}`} />
      </Head>
      <div className="bg-scanlines bg-custom-purple">
        <PageHeader title={`${user.nickname}'s Profile`} />
        <TopLinks />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar || '/red-eyes.jpg'}
                  alt={user.nickname}
                  className="w-24 h-24 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.nickname}</h2>
                  <p className="text-gray-400">@{user.unique_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">{user.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">{user.following.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">{user.hearts.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Hearts</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-lg font-semibold text-white">{user.videos.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Videos</p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Videos</h3>
          <TiktokVideos feed={videos} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uniqueId } = context.params as { uniqueId: string };

  try {
    const email = process.env.DIRECTUS_ADMIN_EMAIL;
    const password = process.env.DIRECTUS_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('Directus admin credentials are not set in environment variables');
    }
    await directus.login(email, password);

    const users = await directus.request(
      readItems('tiktok_users', {
        filter: { unique_id: uniqueId },
        limit: 1,
      })
    );

    if (!users || users.length === 0) {
      return { notFound: true };
    }

    const user = users[0];

    const videos = await directus.request(
      readItems('tiktok_videos', {
        filter: { author: { unique_id: uniqueId } },
        sort: ['-created'],
        limit: -1,
        fields: ['*', 'author.*'],
      })
    );

    return {
      props: {
        user,
        videos,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { notFound: true };
  }
};

export default UserPage;
