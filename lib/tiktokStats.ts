import { createDirectus, rest, authentication, readItems } from "@directus/sdk";

if (!process.env.DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export async function getTikTokStats() {
  try {
    const email = process.env.DIRECTUS_ADMIN_EMAIL;
    const password = process.env.DIRECTUS_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('Directus admin credentials are not set in environment variables');
    }
    await directus.login(email, password);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isoDate = thirtyDaysAgo.toISOString();

    const stats = await directus.request(
      readItems('tiktok_user_stats_history', {
        fields: ['timestamp', 'hearts', 'followers', 'videos', 'friends', 'user'],
        sort: ['timestamp'],
        filter: {
          timestamp: {
            _gte: isoDate,
          },
        },
        limit: -1, // Fetch all results
      })
    );

    // Process the stats
    const processedStats = stats.reduce((acc, stat) => {
      const date = new Date(stat.timestamp).toISOString().split('T')[0];
      const hearts = parseInt(stat.hearts, 10) || 0;
      const followers = parseInt(stat.followers, 10) || 0;
      const videos = parseInt(stat.videos, 10) || 0;
      const friends = parseInt(stat.friends, 10) || 0;
      
      if (!acc[date]) {
        acc[date] = { 
          hearts: 0, 
          followers: 0, 
          videos: 0, 
          friends: 0, 
          users: {}, 
          accountCount: 0 
        };
      }
      
      // Sum stats for each user on this date
      if (!acc[date].users[stat.user]) {
        acc[date].users[stat.user] = { hearts, followers, videos, friends };
        acc[date].hearts += hearts;
        acc[date].followers += followers;
        acc[date].videos += videos;
        acc[date].friends += friends;
        acc[date].accountCount++;
      } else {
        // Update if we have higher counts for this user on this date
        const user = acc[date].users[stat.user];
        if (hearts > user.hearts) {
          acc[date].hearts += hearts - user.hearts;
          user.hearts = hearts;
        }
        if (followers > user.followers) {
          acc[date].followers += followers - user.followers;
          user.followers = followers;
        }
        if (videos > user.videos) {
          acc[date].videos += videos - user.videos;
          user.videos = videos;
        }
        if (friends > user.friends) {
          acc[date].friends += friends - user.friends;
          user.friends = friends;
        }
      }
      
      return acc;
    }, {} as Record<string, { 
      hearts: number, 
      followers: number, 
      videos: number, 
      friends: number, 
      users: Record<string, { hearts: number, followers: number, videos: number, friends: number }>, 
      accountCount: number 
    }>);

    const dailyStats = Object.entries(processedStats).map(([date, data]) => ({ 
      date, 
      hearts: data.hearts,
      followers: data.followers,
      videos: data.videos,
      friends: data.friends,
      accountCount: data.accountCount
    }));
    dailyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const latestStats = dailyStats[dailyStats.length - 1] || { hearts: 0, followers: 0, videos: 0, friends: 0 };
    const previousDayStats = dailyStats[dailyStats.length - 2] || { hearts: 0, followers: 0, videos: 0, friends: 0 };
    const sevenDaysAgoStats = dailyStats[Math.max(0, dailyStats.length - 8)] || { hearts: 0, followers: 0, videos: 0, friends: 0 };
    const thirtyDaysAgoStats = dailyStats[0] || { hearts: 0, followers: 0, videos: 0, friends: 0 };

    return {
      totalHearts: latestStats.hearts,
      totalFollowers: latestStats.followers,
      totalVideos: latestStats.videos,
      totalFriends: latestStats.friends,
      heartsGainLast24Hours: latestStats.hearts - previousDayStats.hearts,
      followersGainLast24Hours: latestStats.followers - previousDayStats.followers,
      videosGainLast24Hours: latestStats.videos - previousDayStats.videos,
      friendsGainLast24Hours: latestStats.friends - previousDayStats.friends,
      heartsGainLast7Days: latestStats.hearts - sevenDaysAgoStats.hearts,
      followersGainLast7Days: latestStats.followers - sevenDaysAgoStats.followers,
      videosGainLast7Days: latestStats.videos - sevenDaysAgoStats.videos,
      friendsGainLast7Days: latestStats.friends - sevenDaysAgoStats.friends,
      heartsGainLast30Days: latestStats.hearts - thirtyDaysAgoStats.hearts,
      followersGainLast30Days: latestStats.followers - thirtyDaysAgoStats.followers,
      videosGainLast30Days: latestStats.videos - thirtyDaysAgoStats.videos,
      friendsGainLast30Days: latestStats.friends - thirtyDaysAgoStats.friends,
      dailyStats,
    };
  } catch (error) {
    console.error("Error fetching TikTok statistics:", error);
    throw error;
  }
}
