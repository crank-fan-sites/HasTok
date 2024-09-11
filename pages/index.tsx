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
    <div className="bg-scanlines bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TiktokVideos feed={tiktokVideos} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

  // Call the update API routes
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lamatok/updateUser`);
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lamatok/updateMedia`);

  // Fetch tiktok_videos from Directus with author relationship, sorted by latest
  const response = await directus.request(
    readItems('tiktok_videos', {
      limit: -1, // Fetch all items
      fields: ['*', 'author.*'], // Include all fields from tiktok_videos and author
      sort: ['-created'], // Sort by created in descending order (latest first)
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
