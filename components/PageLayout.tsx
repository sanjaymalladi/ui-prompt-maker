
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      <div className="w-full max-w-4xl flex flex-col flex-grow">
        {children}
      </div>
    </div>
  );
};
