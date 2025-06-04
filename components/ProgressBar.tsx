
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-1 text-slate-300">
        <span className="text-sm font-medium">Step {current} of {total}</span>
        <span className="text-sm font-medium">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
