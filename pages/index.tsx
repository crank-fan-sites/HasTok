/* eslint-disable @next/next/no-img-element */
import type { NextPage, GetStaticProps } from "next";
import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

import TiktokVideos from "@/components/components/tiktok/videos";

// Define the TikTokVideo type
interface TikTokVideo {
  id: string;
  // Add other fields as needed
}

interface HomeProps {
  tiktokVideos: TikTokVideo[];
}

// Initialize Directus client
const directus = createDirectus(process.env.DIRECTUS_URL || "http://localhost:8055")
  .with(rest())
  .with(authentication());

const Home: NextPage<HomeProps> = ({ tiktokVideos }) => {
  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3">
          <div className="bg-gray-200 p-4">Post 1</div>
          <div className="bg-gray-200 p-4">Post 2</div>
          <div className="bg-gray-200 p-4">Post 3</div>
          <div className="bg-gray-200 p-4">Post 4</div>
          <div className="bg-gray-200 p-4">Post 5</div>
          <div className="bg-gray-200 p-4">Post 6</div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-5">TikTok Videos</h1>
      <TiktokVideos feed={tiktokVideos} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5', 'Post 6'].map((post, index) => (
          <div key={index} className="bg-gray-100 p-5 text-center">
            {post}
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);
  // Call the updateMedia API route
  // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updateMedia`);

  // Fetch tiktok_videos from Directus
  const response = await directus.request(
    readItems('tiktok_videos', {
      limit: -1, // Fetch all items
      // Add any necessary filters or sorting options
    })
  );

  return {
    props: {
      tiktokVideos: response || [],
    },
    revalidate: 60 * 5, // 5 min
  };
};

export default Home;
