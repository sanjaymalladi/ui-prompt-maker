import React from 'react';

interface UIDesignPromptDisplayProps {
  prompt: string;
  onRestart: () => void;
}

export const UIDesignPromptDisplay: React.FC<UIDesignPromptDisplayProps> = ({ prompt, onRestart }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => alert('UI Design Prompt copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8 text-center">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Your AI-Generated UI Design Prompt!</h2>
      <p className="text-slate-400 mb-6">
        Use this detailed specification to guide your UI design process, collaborate with your team, or instruct an AI design tool.
      </p>
      
      <div className="bg-slate-900 p-6 rounded-md border border-slate-700 text-left mb-6 max-h-[60vh] overflow-y-auto">
        <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">{prompt}</pre>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleCopyToClipboard}
          className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-md transition-all transform hover:scale-105"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};