import type { NextPage } from "next";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { BsFillPlayFill } from "react-icons/bs";

interface TikTokVideoProps {
  tiktok_id: string;
  author: {
    nickname: string;
  };
  created: string;
  desc: string;
  collected: number;
  comments: number;
  plays: number;
  shares: number;
  cover: string;
  duration: number;
}

const TikTokVideo: NextPage<TikTokVideoProps> = ({
  tiktok_id,
  author,
  created,
  desc,
  collected,
  comments,
  plays,
  shares,
  cover,
  duration,
}) => {
  return (
    <div className="relative h-auto">
      <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <a 
            href={`https://tiktok.com/@${author.unique_id}/video/${tiktok_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={cover} alt={`TikTok by ${author.nickname}`} className="w-full h-64 object-cover" />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {duration}s
            </div>
          </a>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <a 
              href={`https://tiktok.com/@${author.unique_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={author.avatar} alt={author.unique_id} className="w-10 h-10 rounded-full mr-2" />
              <h2 className="font-bold text-lg">{author.nickname}</h2>
            </a>
          </div>
          <p className="text-sm mb-2">{desc}</p>
          <p className="text-xs text-gray-500 mb-4">Created: {new Date(created).toLocaleDateString()}</p>
          <div className="flex justify-between text-gray-600">
            <div className="flex items-center">
              <FaHeart className="mr-1" />
              <span>{collected}</span>
            </div>
            <div className="flex items-center">
              <FaComment className="mr-1" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center">
              <BsFillPlayFill className="mr-1" />
              <span>{plays}</span>
            </div>
            <div className="flex items-center">
              <FaShare className="mr-1" />
              <span>{shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;
