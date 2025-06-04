
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 text-center text-slate-400 text-sm">
      <p>&copy; {new Date().getFullYear()} UI Blueprint AI. Powered by Gemini.</p>
    </footer>
  );
};
