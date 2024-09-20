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
  let userCount = 0;
  let updateCount = 0;

  await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

  try {
    const tiktokUsers = await directus.request(
      readItems('tiktok_users', {
        limit: -1,
      })
    );

    for (const user of tiktokUsers) {
      userCount++;
      console.log('updateUser: checking if should update for', user.id, user.unique_id);
      const shouldUpdate = await checkIfShouldUpdate(user);
      if (shouldUpdate) {
        await updateUser(user);
        updateCount++;
      }
    }

    console.log('Total users, updates processed:', userCount, updateCount);
    res.status(200).json({ msg: "TikTok users updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating TikTok users" });
  }
}

async function checkIfShouldUpdate(user: any): Promise<boolean> {
  if (user.last_updated === null) return true;

  const now = new Date().getTime();
  const lastUpdated = new Date(user.last_updated).getTime();
  const interval = user.interval * 60 * 60 * 1000; // Convert hours to milliseconds
  return now - lastUpdated > interval;
}

async function updateUser(user: any) {
  console.log('updateUser: fetching TikTok user data for', user.id, user.unique_id);
  const data = await fetchTikTokUser(user.unique_id);
  await saveTikTokUser(data, user.id, user.unique_id);

  await updateLastUpdated(user.id);
  console.log('updateUser: saved TIkTok user data + updated last_updated for user', user.id, user.unique_id);
}

async function fetchTikTokUser(
  username: string
) {
  const url = new URL(process.env.TIKTOK_PAPI_URL + "/user/by/username");
  url.searchParams.append("username", username);

  const response = await axios.get(url.toString(), {
    headers: {
      "x-access-key": process.env.TIKTOK_PAPI_KEY,
    },
  });
  return response.data;
}

async function saveTikTokUser(
  data: any,
  userId: string,
  username: string
): Promise<void> {
  const firstData = data.users[username]
  const stats = data.stats[username]

  const finalData = {
    tiktok_id: firstData.id,
    nickname: firstData.nickname,
    signature: firstData.signature,
    avatar: firstData.avatarMedium,
    created: firstData.createTime,
    verified: firstData.verified,
    sec_uid: firstData.secUid,
    bio_link: firstData.bioLink?.link || null,
    private: firstData.privateAccount,
    followers: stats.followerCount,
    following: stats.followingCount,
    hearts: stats.heartCount,
    videos: stats.videoCount,
    friends: stats.friendCount
  }

  await directus.request(
    updateItem('tiktok_users', userId, finalData)
  );
}

async function updateLastUpdated(userId: string) {
  await directus.request(
    updateItem('tiktok_users', userId, {
      last_updated: new Date().getTime(),
    })
  );
}
