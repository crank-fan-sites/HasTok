/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { createDirectus, rest, authentication, readItems, updateItem, createItem } from "@directus/sdk";
import axios from "axios";

if (!process.env.DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Immediately send a response
  res.status(202).json({ msg: "TikTok video update process started." });

  // Call the core function without awaiting it
  await core().catch(error => {
    console.error("Error in core function:", error);
  });
}

async function core() {
  let userCount = 0;
  let updateCount = 0;

  const email = process.env.DIRECTUS_ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Directus admin credentials are not set in environment variables');
  }
  await directus.login(email, password);

  try {
    const tiktokUsers = await directus.request(
      readItems('tiktok_users', {
        limit: -1,
      })
    );

    for (const user of tiktokUsers) {
      userCount++;
      const shouldUpdate = await checkIfShouldUpdate(user);
      if (shouldUpdate) {
        await updateUserVideos(user);
        updateCount++;
      }
    }

    console.log('Total users, updates processed:', userCount, updateCount);
  } catch (error) {
    console.error("An error occurred while updating TikTok videos:", error);
  }
}

async function checkIfShouldUpdate(user: any): Promise<boolean> {
  if (user.last_media_updated === null) return true;

  const now = new Date()
  const lastUpdated = new Date(user.last_media_updated)
  const mediaInterval = user.media_interval * 60 * 1000; // Convert minutes to miliseconds

  const diff = now.getTime() - lastUpdated.getTime() > mediaInterval;
  console.log(`checkIfShouldUpdate: ${diff}. ${now.getTime() - lastUpdated.getTime()} | now - lastUpdated: ${now.toISOString()} - ${lastUpdated.toISOString()} | mediaInterval: ${user.media_interval} min`);
  return diff;
}

async function updateUserVideos(user: any) {
  const isFirstUpdate = user.last_media_updated === null;
  let nextPageId = null;

  do {
    const tiktokVideoData = await fetchTikTokVideos(user.unique_id, nextPageId);
    await saveTikTokVideos(tiktokVideoData.response, user.id);
    // @TODO better logic for whether to paginate or not. Task: https://t0ggles.com/chase-saddy/dcjfvjkmcxzup42psnlu
    nextPageId = isFirstUpdate ? tiktokVideoData.next_page_id : null;
  } while (nextPageId);

  await updateLastUpdated(user.id);
  console.log('updateMedia: saved TikTok user data + updated last_updated for user', user.id, user.unique_id);
}

async function fetchTikTokVideos(
  username: string,
  pageId: string | null = null
) {
  const url = new URL(process.env.TIKTOK_PAPI_URL + "/user/videos/by/username");
  url.searchParams.append("username", username);
  if (pageId) {
    url.searchParams.append("page_id", pageId);
  }

  const response = await axios.get(url.toString(), {
    headers: {
      "x-access-key": process.env.TIKTOK_PAPI_KEY,
    },
  });
  return response.data;
}

async function saveTikTokVideos(
  videoData: any,
  authorId: string
): Promise<boolean> {
  // console.log('Video data structure:', JSON.stringify(videoData, null, 2));

  const itemList = videoData.itemList || videoData.items || [];

  if (!Array.isArray(itemList)) {
    console.error('itemList is not an array:', itemList);
    return false;
  } else {
     console.log('saveTikTokVideos: itemList length', itemList.length);
  }

  for (const item of itemList) {
    const existingVideo = await directus.request(
      readItems('tiktok_videos', {
        filter: { tiktok_id: item.id },
        limit: 1,
      })
    );
        
    const video = {
      tiktok_id: item.id,
      author: authorId,
      created: new Date(item.createTime * 1000).toISOString(),
      desc: item.desc,
      collected: parseInt(item.statsV2?.collectCount || '0'),
      comments: parseInt(item.statsV2?.commentCount || '0'),
      plays: parseInt(item.statsV2?.playCount || '0'),
      shares: parseInt(item.statsV2?.shareCount || '0'),
      cover: item.video?.cover,
      duration: item.video?.duration,
      dynamic_cover: item.video?.dynamicCover,
    };

    if (existingVideo && existingVideo.length > 0) {
      console.log('saveTikTokVideos: updated video', video.tiktok_id, video.desc.slice(0, 30));
      await directus.request(
        updateItem('tiktok_videos', existingVideo[0].id, video)
      );
    } else {
      console.log('saveTikTokVideos: created video', video.tiktok_id, video.desc.slice(0, 30));
      await directus.request(
        createItem('tiktok_videos', video)
      );
    }
  }

  return true;
}

async function updateLastUpdated(userId: string) {
  await directus.request(
    updateItem('tiktok_users', userId, {
      last_media_updated: new Date().toISOString()
    })
  );
}
