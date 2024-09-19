import type { NextPage } from "next";
import { useState, useCallback, useEffect } from 'react';
import TiktokVideos from "@/components/components/tiktok/videos";
import { HasTokProps, TikTokVideo } from '../types/tiktok';

const HasTok: React.FC<HasTokProps> = ({ socialMediaData }) => {
  const { initialVideos, totalVideos, pageSize, initialSortBy, usernames } = socialMediaData.tiktok;

  const [videos, setVideos] = useState<TikTokVideo[]>(initialVideos || []);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'plays'>(initialSortBy);
  const [isSwitchingSort, setIsSwitchingSort] = useState(false);
  const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');
  
  useEffect(() => {
    setVideos(initialVideos || []);
    setHasMore((initialVideos?.length || 0) < totalVideos);
  }, [initialVideos, totalVideos]);

  const fetchVideos = useCallback(async (newSortBy: 'created' | 'plays', newDateFilter: 'day' | 'week' | 'month' | 'year' | 'all') => {
    setIsSwitchingSort(true);
    try {
      const usernamesParam = usernames && usernames.length > 0 ? `&usernames=${usernames.join(',')}` : '';
      const response = await fetch(`/api/videos?page=1&pageSize=${pageSize}&sortBy=${newSortBy}&dateFilter=${newDateFilter}${usernamesParam}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const newVideos = await response.json();
      setVideos(newVideos);
      setPage(1);
      setHasMore((newVideos?.length || 0) < totalVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsSwitchingSort(false);
    }
  }, [pageSize, totalVideos, usernames]);

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
      const usernamesParam = usernames && usernames.length > 0 ? `&usernames=${usernames.join(',')}` : '';
      const response = await fetch(`/api/videos?page=${nextPage}&pageSize=${pageSize}&sortBy=${sortBy}&dateFilter=${dateFilter}${usernamesParam}`);
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
  }, [page, pageSize, isLoading, hasMore, videos.length, totalVideos, sortBy, dateFilter, usernames]);

  return (
    <div className="bg-scanlines bg-custom-purple"> {/* Base background */}
      <div className="relative w-full">
        <div className="w-full aspect-[680/130] relative"> {/* Added relative positioning */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-10" 
            style={{ backgroundImage: "url('/images/top-thin-rect.jpg')" }}
          ></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 z-30"> {/* Higher opacity, highest z-index */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-500 tracking-wide py-2">
              HasTok
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          Showing <b className="text-lg text-green-500">{videos.length}</b> of <b className="text-lg text-green-500">{totalVideos}</b> videos
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
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={loadMoreVideos}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
        <div className="mt-3 mb-4 text-center text-white">
          Showing <b className="text-lg text-green-500">{videos.length}</b> of <b className="text-lg text-green-500">{totalVideos}</b> videos
        </div>
        {!hasMore && videos.length < totalVideos && (
          <p className="mt-8 text-center text-white">
            You have seen all {totalVideos} videos
          </p>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-red-400">
          <a href="/">Home</a> | <a href="/about">About</a> | <a href="https://twitter.com/hasansproducer">HasanAbi Community Twitter</a> | <a href="https://tiktok.com/hasansproducer">HasanAbi Community TikTok</a>
        </p>
      </div>
    </div>
  );
};

export default HasTok;