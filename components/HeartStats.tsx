import React from 'react';
import { FaHeart } from 'react-icons/fa';

interface HeartStatsProps {
  totalHearts: number;
  heartGainLast24Hours: number;
  heartGainLast7Days: number;
  heartGainLast30Days: number;
}

const HeartStats: React.FC<HeartStatsProps> = ({
  totalHearts,
  heartGainLast24Hours,
  heartGainLast7Days,
  heartGainLast30Days
}) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaHeart className="text-red-500 mr-2" /> Heart Stats
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm">Total Hearts:</p>
          <p className="text-2xl font-bold">{totalHearts.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm">Gained (24h):</p>
          <p className="text-2xl font-bold">{heartGainLast24Hours.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm">Gained (7d):</p>
          <p className="text-2xl font-bold">{heartGainLast7Days.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm">Gained (30d):</p>
          <p className="text-2xl font-bold">{heartGainLast30Days.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default HeartStats;