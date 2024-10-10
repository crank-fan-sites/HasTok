import type { NextPage } from "next";
import TikTokVideo from "./video";
import { TikTokVideoType } from '@/types/tiktok';

interface TiktokVideosProps {
  feed: TikTokVideoType[];
  internal?: boolean;
}

const TiktokVideos: NextPage<TiktokVideosProps> = ({ feed, internal = true }) => {
  return (
    <div className="flex flex-wrap -m-2">
      {feed.map((video) => (
        <div key={video.id} className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <TikTokVideo
            {...video}
            internal={internal}
          />
        </div>
      ))}
    </div>
  );
};

export default TiktokVideos;
