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

interface DailyHeartStatsProps {
  dailyStats: { date: string; hearts: number; accountCount: number }[];
}

const DailyHeartStats: React.FC<DailyHeartStatsProps> = ({ dailyStats }) => {
  const data = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Hearts',
        data: dailyStats.map(stat => stat.hearts),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Account Count',
        data: dailyStats.map(stat => stat.accountCount),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

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
        text: 'Daily Heart Stats and Account Count',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Hearts',
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

  return (
    <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md">
      <Line options={options} data={data} />
    </div>
  );
};

export default DailyHeartStats;
