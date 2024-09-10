import type { NextPage } from "next";
import TikTokVideo from "./video";

interface TiktokVideosProps {
  feed: TikTokVideo[];
}

const TiktokVideos: NextPage<TiktokVideosProps> = ({ feed }) => {
  return (
    <div className="flex flex-wrap -m-2">
      {feed.map((video, index) => (
        <div key={index} className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <TikTokVideo
            tiktok_id={video.tiktok_id}
            author={video.author}
            created={video.created}
            desc={video.desc}
            collected={video.collected}
            comments={video.comments}
            plays={video.plays}
            shares={video.shares}
            cover={video.cover}
            duration={video.duration}
          />
        </div>
      ))}
    </div>
  );
};

export default TiktokVideos;
