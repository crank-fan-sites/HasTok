import { useState, useCallback, useEffect } from 'react';
import { createDirectus, rest, authentication, readItems, aggregate } from '@directus/sdk';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import TopLinks from '@/components/topLinks';
import TiktokVideos from '@/components/tiktok/videos';
import { TikTokUser, TikTokVideoType } from '@/types/tiktok';
import Head from 'next/head';

if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest())
  .with(authentication());

interface UserPageProps {
  user: TikTokUser;
  initialVideos: TikTokVideoType[];
  totalVideos: number;
  pageSize: number;
  initialSortBy: 'created' | 'plays';
}

const UserPage: React.FC<UserPageProps> = ({ user, initialVideos, totalVideos, pageSize, initialSortBy }) => {
  const [videos, setVideos] = useState<TikTokVideoType[]>(initialVideos);
  const [hasMore, setHasMore] = useState(initialVideos.length < totalVideos);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'plays'>(initialSortBy);
  const [isSwitchingSort, setIsSwitchingSort] = useState(false);
  const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');

  const fetchVideos = useCallback(async (newSortBy: 'created' | 'plays', newDateFilter: 'day' | 'week' | 'month' | 'year' | 'all') => {
    setIsSwitchingSort(true);
    try {
      const response = await fetch(`/api/videos?page=1&pageSize=${pageSize}&sortBy=${newSortBy}&dateFilter=${newDateFilter}&usernames=${user.unique_id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const newVideos = await response.json();
      setVideos(newVideos);
      setPage(1);
      setHasMore(newVideos.length < totalVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsSwitchingSort(false);
    }
  }, [pageSize, totalVideos, user.unique_id]);

  useEffect(() => {
    fetchVideos(sortBy, dateFilter);
  }, [sortBy, dateFilter, fetchVideos]);

  const changeSortBy = (newSortBy: 'created' | 'plays') => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
    }
  };

  const changeDateFilter = (newDateFilter: 'day' | 'week' | 'month' | 'year' | 'all') => {
    if (newDateFilter !== dateFilter) {
      setDateFilter(newDateFilter);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const response = await fetch(`/api/videos?page=${nextPage}&pageSize=${pageSize}&sortBy=${sortBy}&dateFilter=${dateFilter}&usernames=${user.unique_id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const newVideos = await response.json();

      if (newVideos && newVideos.length > 0) {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setPage(nextPage);
        setHasMore((videos.length + newVideos.length) < totalVideos);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, isLoading, hasMore, videos.length, totalVideos, sortBy, dateFilter, user.unique_id]);

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
          <div className="mb-4 text-center text-white">
            <button
              onClick={() => changeSortBy('created')}
              className={`px-4 py-2 rounded mr-2 ${
                sortBy === 'created' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Sort by Date
            </button>
            <button
              onClick={() => changeSortBy('plays')}
              className={`px-4 py-2 rounded ${
                sortBy === 'plays' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Sort by Popularity
            </button>
          </div>
          <div className="mb-4 text-center text-white">
            <button
              onClick={() => changeDateFilter('day')}
              className={`px-3 py-1 text-md rounded mr-2 ${
                dateFilter === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Day
            </button>
            <button
              onClick={() => changeDateFilter('week')}
              className={`px-3 py-1 text-md rounded mr-2 ${
                dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Week
            </button>
            <button
              onClick={() => changeDateFilter('month')}
              className={`px-3 py-1 text-md rounded mr-2 ${
                dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Month
            </button>
            <button
              onClick={() => changeDateFilter('year')}
              className={`px-3 py-1 text-md rounded mr-2 ${
                dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              Year
            </button>
            <button
              onClick={() => changeDateFilter('all')}
              className={`px-3 py-1 text-md rounded ${
                dateFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={isSwitchingSort}
            >
              All
            </button>
          </div>
          <div className="mb-4 text-center text-white">
            Showing <b className="text-lg text-red-500">{videos.length}</b> of <b className="text-lg text-red-500">{totalVideos}</b> videos
          </div>
          {isSwitchingSort ? (
            <div className="text-center text-white">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-2">Switching sort order...</p>
            </div>
          ) : isLoading && videos.length === 0 ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <TiktokVideos feed={videos} />
          )}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
                onClick={loadMoreVideos}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          <div className="mt-3 mb-4 text-center text-white">
            Showing <b className="text-lg text-red-500">{videos.length}</b> of <b className="text-lg text-red-500">{totalVideos}</b> videos
          </div>
          {!hasMore && videos.length < totalVideos && (
            <p className="mt-8 text-center text-white">
              You have seen all {totalVideos} videos
            </p>
          )}
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

    const initialSortBy = 'created';
    const pageSize = 24;

    const [initialVideos, totalCountResult] = await Promise.all([
      directus.request(
        readItems('tiktok_videos', {
          filter: { author: { unique_id: uniqueId } },
          sort: [`-${initialSortBy}`],
          limit: pageSize,
          fields: ['*', 'author.*'],
        })
      ),
      directus.request(
        aggregate('tiktok_videos', {
          aggregate: { count: 'id' },
          filter: { author: { unique_id: uniqueId } },
        })
      )
    ]);

    const totalVideos = totalCountResult[0]?.count?.id ?? 0;

    return {
      props: {
        user,
        initialVideos,
        totalVideos,
        pageSize,
        initialSortBy,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { notFound: true };
  }
};

export default UserPage;