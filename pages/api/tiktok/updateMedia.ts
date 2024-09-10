import type { NextApiRequest, NextApiResponse } from "next";
import { createDirectus, rest, authentication, readItems, updateItem, createItem } from "@directus/sdk";
import axios from "axios";

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

  try {
    const tiktokUsers = await directus.request(
      readItems('tiktok_users', {
        limit: -1,
      })
    );

    for (const user of tiktokUsers) {
      const shouldUpdate = await checkIfShouldUpdate(user);
      if (shouldUpdate) {
        await updateUserVideos(user);
      }
    }

    res.status(200).json({ msg: "TikTok videos updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating TikTok videos" });
  }
}

async function checkIfShouldUpdate(user: any): Promise<boolean> {
  if (user.last_media_updated === null) return true;

  const now = new Date().getTime();
  const lastUpdated = new Date(user.last_media_updated).getTime();
  const mediaInterval = user.media_interval * 60 * 60 * 1000; // Convert hours to milliseconds

  return now - lastUpdated > mediaInterval;
}

async function updateUserVideos(user: any) {
  const isFirstUpdate = user.last_media_updated === null;
  let nextPageId = null;

  do {
    const tiktokVideoData = await fetchTikTokVideos(user.unique_id, nextPageId);
    await saveTikTokVideos(tiktokVideoData.response, user.id);
    // this way only doing more than the first page if this is not the first update that goes thru all the pages. This is not the best way. 
    // @TODO when working fix this up -- The best way is if the last item of the current page from lamatok is new, then to get the next page. Right now as long as there is no down time (which could happen), there will not be a time where that many new media will be posted (if 12 per page that is 6 items per day if checking every 2 days).
    nextPageId = isFirstUpdate ? tiktokVideoData.next_page_id : null;
  } while (nextPageId);

  await updateLastUpdated(user.id);
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
  console.log('Video data structure:', JSON.stringify(videoData, null, 2));

  const itemList = videoData.itemList || videoData.items || [];

  if (!Array.isArray(itemList)) {
    console.error('itemList is not an array:', itemList);
    return false;
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
      created: item.createTime * 1000,
      desc: item.desc,
      collected: parseInt(item.statsV2?.collectCount?.value || '0'),
      comments: parseInt(item.statsV2?.commentCount?.value || '0'),
      plays: parseInt(item.statsV2?.playCount?.value || '0'),
      shares: parseInt(item.statsV2?.shareCount?.value || '0'),
      cover: item.video?.cover,
      duration: item.video?.duration,
      dynamic_cover: item.video?.dynamicCover,
    };

    if (existingVideo.data && existingVideo.data.length > 0) {
      // Update existing video
      await directus.request(
        updateItem('tiktok_videos', existingVideo.data[0].id, video)
      );
    } else {
      // Create new video
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
      last_media_updated: new Date().getTime(),
    })
  );
}
