import React from 'react';
import { GetStaticProps } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import HeartStats from '@/components/HeartStats';
import DailyHeartStats from '@/components/DailyHeartStats';
import { getHeartStats } from '@/lib/heartStats';

interface HeartStatsPageProps {
  heartStats: {
    totalHearts: number;
    heartGainLast24Hours: number;
    heartGainLast7Days: number;
    heartGainLast30Days: number;
    dailyStats: { date: string; hearts: number }[];
  };
}

const HeartStatsPage: React.FC<HeartStatsPageProps> = ({ heartStats }) => {
  console.log(heartStats.dailyStats);
  return (
    <div className="bg-scanlines bg-custom-purple">
      <PageHeader>HasTok Heart Stats</PageHeader>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeartStats
          totalHearts={heartStats.totalHearts}
          heartGainLast24Hours={heartStats.heartGainLast24Hours}
          heartGainLast7Days={heartStats.heartGainLast7Days}
          heartGainLast30Days={heartStats.heartGainLast30Days}
        />
        <DailyHeartStats dailyStats={heartStats.dailyStats} />
        <div className="mt-8 text-center text-white">
          <p>These stats show the total number of hearts (likes) received on TikTok videos and the growth over different time periods.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HeartStatsPageProps> = async () => {
  try {
    const heartStats = await getHeartStats();

    return {
      props: {
        heartStats,
      },
      revalidate: 60 * 5, // 5 min
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        heartStats: {
          totalHearts: 0,
          heartGainLast24Hours: 0,
          heartGainLast7Days: 0,
          heartGainLast30Days: 0,
          dailyStats: [],
        },
      },
      revalidate: 60 * 5
    };
  }
};

export default HeartStatsPage;