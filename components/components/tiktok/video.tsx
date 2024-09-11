import type { NextPage } from "next";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { BsFillPlayFill } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import millify from "millify";

interface TikTokVideoProps {
  tiktok_id: string;
  author: {
    nickname: string;
    unique_id: string;
    avatar: string;
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
      <div className="border border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col h-full bg-gray-800 text-white">
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
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <a 
              href={`https://tiktok.com/@${author.unique_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={author.avatar} alt={author.unique_id} className="w-10 h-10 rounded-full mr-2" />
              <h2 className="font-bold text-lg text-white">{author.nickname}</h2>
            </a>
          </div>
            <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(created), { addSuffix: true })}</div>
          <p className="text-sm mb-4 overflow-hidden max-h-[8.4em] line-clamp-6 text-gray-300 italic">{desc}</p>
          <div className="mt-auto">
            <div className="grid grid-cols-2 ml-5 gap-x-4 gap-y-2 font-semibold">
              <div className="flex items-center">
                <BsFillPlayFill className="mr-1 text-green-500 text-sm" />
                <span className="">{millify(plays)}</span>
              </div>
              <div className="flex items-center">
                <FaHeart className="mr-1 text-green-500 text-xs" />
                <span className="text-md">{millify(collected)}</span>
              </div>
              <div className="flex items-center">
                <FaComment className="mr-1 text-green-500 text-xs" />
                <span className="text-md">{millify(comments)}</span>
              </div>
              <div className="flex items-center">
                <FaShare className="mr-1 text-green-500 text-xs" />
                <span className="text-md">{millify(shares)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;
