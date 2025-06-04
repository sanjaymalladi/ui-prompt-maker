
import React, { useState } from 'react';

interface UserInputFormProps {
  initialText: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ initialText, onChange, onSubmit, isProcessing }) => {
  const [text, setText] = useState(initialText);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const characterCount = text.length;
  const recommendedMinLength = 100; // Arbitrary minimum to encourage detail

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8 transform transition-all duration-500 hover:scale-[1.01]">
      <h2 className="text-2xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
        Describe Your UI Project
      </h2>
      <p className="text-slate-400 mb-4 text-sm">
        Tell us about the UI you envision. What is its main purpose? Who is it for? What's the desired look and feel?
        The more detail you provide, the better the AI can assist in blueprinting it.
      </p>
      
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="e.g., I'm building a mobile app for local community event discovery. It should be vibrant, easy to navigate for all ages, and help people find and share events..."
        rows={10}
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-slate-100 placeholder-slate-500 resize-y"
        aria-label="Describe your UI project"
        disabled={isProcessing}
      />
      <div className="text-right text-xs text-slate-500 mt-1 pr-1">
        {characterCount} characters {characterCount < recommendedMinLength && characterCount > 0 && `(more detail is helpful!)`}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-md transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isProcessing || !text.trim()}
          aria-live="polite"
        >
          {isProcessing ? 'Processing...' : 'Generate UI Blueprint'}
        </button>
      </div>
    </form>
  );
};
