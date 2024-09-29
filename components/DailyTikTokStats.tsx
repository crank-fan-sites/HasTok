import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DailyTikTokStatsProps {
  dailyStats: { 
    date: string; 
    hearts: number; 
    followers: number;
    videos: number;
    friends: number;
    accountCount: number 
  }[];
}

const DailyTikTokStats: React.FC<DailyTikTokStatsProps> = ({ dailyStats }) => {
  const createChartData = (label: string, data: number[], color: string) => ({
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: `${color}33`,
        yAxisID: 'y',
      },
      {
        label: 'Account Count',
        data: dailyStats.map(stat => stat.accountCount),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        yAxisID: 'y1',
      },
    ],
  });

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Daily TikTok Stats',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Count',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Account Count',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const charts = [
    { label: 'Hearts', data: dailyStats.map(stat => stat.hearts), color: 'rgba(255, 99, 132, 1)' },
    { label: 'Followers', data: dailyStats.map(stat => stat.followers), color: 'rgba(54, 162, 235, 1)' },
    { label: 'Videos', data: dailyStats.map(stat => stat.videos), color: 'rgba(255, 206, 86, 1)' },
    { label: 'Friends', data: dailyStats.map(stat => stat.friends), color: 'rgba(75, 192, 192, 1)' },
  ];

  return (
    <div className="mt-8 space-y-8">
      {charts.map((chart, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <Line options={{...options, plugins: {...options.plugins, title: {...options.plugins.title, text: `Daily ${chart.label} Stats`}}}} data={createChartData(chart.label, chart.data, chart.color)} />
        </div>
      ))}
    </div>
  );
};

export default DailyTikTokStats;