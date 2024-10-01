import type { NextPage } from "next";
import Image from "next/image";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { BsFillPlayFill, BsBookmark } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import millify from "millify";
import { TikTokVideoType } from "../../types/tiktok";

const fallbackImageUrl = "/red-eyes.jpg";

const TikTokVideo: NextPage<TikTokVideoType> = ({
  tiktok_id,
  author,
  created,
  desc,
  hearts,
  collected,
  comments,
  plays,
  shares,
  cover,
  duration,
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="relative h-auto">
      <div className="border border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col h-full bg-gray-800 text-white">
        <div className="relative">
          <a 
            href={`https://tiktok.com/@${author.unique_id}/video/${tiktok_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-full h-64">
              <Image 
                src={cover || fallbackImageUrl}
                alt={`TikTok by ${author.nickname}`} 
                fill
                style={{ objectFit: "cover" }}
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImageUrl;
                }}
              />
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-1 rounded">
              {formatDistanceToNow(new Date(created), { addSuffix: true })}
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-1 rounded">
              {formatDuration(duration)}
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
              <div className="relative w-10 h-10 mr-2">
                <Image 
                  src={author.avatar || fallbackImageUrl}
                  alt={author.unique_id} 
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  unoptimized={true}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImageUrl;
                  }}
                />
              </div>
              <h2 className="font-bold text-lg text-white truncate max-w-[200px]">{author.nickname}</h2>
            </a>
          </div>
          <p className="text-sm mb-4 overflow-hidden max-h-[8.4em] line-clamp-6 text-gray-300 italic">{desc}</p>
          <div className="mt-auto">
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 font-semibold text-sm">
              <div className="flex items-center">
                <BsFillPlayFill className="mr-1 text-green-500" />
                <span>{millify(plays)}</span>
              </div>
              <div className="flex items-center">
                <FaHeart className="mr-1 text-red-500" />
                <span>{millify(hearts)}</span>
              </div>
              <div className="flex items-center">
                <BsBookmark className="mr-1 text-blue-500" />
                <span>{millify(collected)}</span>
              </div>
              <div className="flex items-center">
                <FaComment className="mr-1 text-yellow-500" />
                <span>{millify(comments)}</span>
              </div>
              <div className="flex items-center">
                <FaShare className="mr-1 text-purple-500" />
                <span>{millify(shares)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokVideo;
