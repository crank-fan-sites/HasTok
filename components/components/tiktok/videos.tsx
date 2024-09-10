import type { NextPage } from "next";
import TikTokVideo from "./video";

interface TiktokVideosProps {
  feed: TikTokVideo[];
}

const TiktokVideos: NextPage<TiktokVideosProps> = ({ feed }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -8px' }}>
      {feed.map((video, index) => (
        <div key={index} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', '@media (min-width: 640px)': { width: '50%' }, '@media (min-width: 1024px)': { width: '33.333%' } }}>
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
