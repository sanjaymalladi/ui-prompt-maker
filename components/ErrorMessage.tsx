
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRestart?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRestart }) => {
  return (
    <div className="bg-red-900/30 border border-red-700 text-red-300 px-6 py-8 rounded-lg shadow-xl text-center">
      <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-red-200">Oops! Something went wrong.</h3>
      <p className="text-red-300 mb-6">{message}</p>
      {onRestart && (
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
