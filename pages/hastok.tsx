import type { NextPage } from "next";
import { useState, useCallback, useEffect } from 'react';
import TiktokVideos from "@/components/components/tiktok/videos";
import { HasTokProps, TikTokVideo } from '../types/tiktok';

interface TikTokVideo {
  id: string;
  // Add other fields as needed
}

interface HasTokProps {
  initialVideos: TikTokVideo[];
  pageSize: number;
  totalVideos: number;
  initialSortBy: 'created' | 'plays';
}

const HasTok: NextPage<HasTokProps> = ({ initialVideos, pageSize, totalVideos, initialSortBy }) => {
  const [videos, setVideos] = useState(initialVideos);
  const [hasMore, setHasMore] = useState(videos.length < totalVideos);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'plays'>(initialSortBy);
  const [isSwitchingSort, setIsSwitchingSort] = useState(false);

  const fetchVideos = useCallback(async (newSortBy: 'created' | 'plays') => {
    setIsSwitchingSort(true);
    try {
      const response = await fetch(`/api/videos?page=1&pageSize=${pageSize}&sortBy=${newSortBy}`);
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
  }, [pageSize, totalVideos]);

  useEffect(() => {
    fetchVideos(sortBy);
  }, [sortBy, fetchVideos]);

  const changeSortBy = (newSortBy: 'created' | 'plays') => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const response = await fetch(`/api/videos?page=${nextPage}&pageSize=${pageSize}&sortBy=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const newVideos = await response.json();

      if (newVideos.length > 0) {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setPage(nextPage);
        setHasMore(videos.length + newVideos.length < totalVideos);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, isLoading, hasMore, videos.length, totalVideos, sortBy]);

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-500 tracking-wide py-2">
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
    </div>
  );
};

export default HasTok;