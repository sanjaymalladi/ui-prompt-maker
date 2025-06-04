
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 text-center">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Make Your Ideal UI
      </h1>
      <p className="mt-2 text-lg text-slate-300">
        Describe your UI vision, and let AI help you blueprint it and generate a UI design prompt.
      </p>
    </header>
  );
};
