import type { NextPage } from "next";
import Image from 'next/image';
import { TikTokUser } from '@/types/tiktok';
import { formatDistanceToNow } from 'date-fns';

interface TikTokUsersProps {
  users: TikTokUser[];
}

const TikTokUsers: NextPage<TikTokUsersProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <div key={user.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <a 
                href={`/users/${user.unique_id}`}
              >
                <Image
                  src={user.avatar || '/red-eyes.jpg'}
                  alt={user.nickname}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                  unoptimized={true}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/red-eyes.jpg';
                  }}
                />
              </a>
              <div>
                <a 
                  href={`/users/${user.unique_id}`}
                >
                  <h2 className="text-xl font-bold text-white">{user.nickname}</h2>
                  <p className="text-gray-400">@{user.unique_id}</p>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-white">
              <div>Followers: {user.followers.toLocaleString()}</div>
              <div>Following: {user.following.toLocaleString()}</div>
              <div>Hearts: {user.hearts.toLocaleString()}</div>
              <div>Videos: {user.videos.toLocaleString()}</div>
            </div>
          </div>
          {user.last_video_activity && (
            <div className="mt-2 text-sm text-white bg-green-600 p-2 text-center">
              <a 
                href={`/users/${user.unique_id}`}
              >
                Last activity: {formatDistanceToNow(new Date(user.last_video_activity), { addSuffix: true })}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TikTokUsers;