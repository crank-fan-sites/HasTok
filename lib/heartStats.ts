import { createDirectus, rest, authentication, readItems } from "@directus/sdk";

if (!process.env.DIRECTUS_URL) throw new Error('DIRECTUS_URL is not defined');
const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(rest())
  .with(authentication());

export async function getHeartStats() {
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
        fields: ['timestamp', 'hearts', 'user'],
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
      
      if (!acc[date]) {
        acc[date] = { total: 0, users: {}, accountCount: 0 };
      }
      
      // Sum hearts for each user on this date
      if (!acc[date].users[stat.user]) {
        acc[date].users[stat.user] = hearts;
        acc[date].total += hearts;
        acc[date].accountCount++;
      } else if (hearts > acc[date].users[stat.user]) {
        // If we have a higher heart count for this user on this date, update it
        acc[date].total += hearts - acc[date].users[stat.user];
        acc[date].users[stat.user] = hearts;
      }
      
      return acc;
    }, {} as Record<string, { total: number, users: Record<string, number>, accountCount: number }>);

    const dailyStats = Object.entries(processedStats).map(([date, data]) => ({ 
      date, 
      hearts: data.total,
      accountCount: data.accountCount
    }));
    dailyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalHearts = dailyStats[dailyStats.length - 1]?.hearts || 0;
    const heartGainLast24Hours = totalHearts - (dailyStats[dailyStats.length - 2]?.hearts || 0);
    const heartGainLast7Days = totalHearts - (dailyStats[Math.max(0, dailyStats.length - 8)]?.hearts || 0);
    const heartGainLast30Days = totalHearts - (dailyStats[0]?.hearts || 0);

    return {
      totalHearts,
      heartGainLast24Hours,
      heartGainLast7Days,
      heartGainLast30Days,
      dailyStats,
    };
  } catch (error) {
    console.error("Error fetching heart statistics:", error);
    throw error;
  }
}
