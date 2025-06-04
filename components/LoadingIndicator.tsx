
import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-lg shadow-xl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-6"></div>
      <p className="text-xl font-semibold text-slate-200">{message}</p>
      <p className="text-slate-400 mt-2">AI is thinking hard, this might take a moment.</p>
    </div>
  );
};
