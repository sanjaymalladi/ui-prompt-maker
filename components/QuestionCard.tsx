
import React from 'react';
import { Question as QuestionType } from '../types'; // Renamed to avoid conflict

interface QuestionCardProps {
  question: QuestionType;
  answer: string;
  onChange: (id: keyof any, value: string) => void; // Using `any` for id type as it's a key of Answers
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onChange,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(question.id, e.target.value);
  };

  return (
    <div className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8 transform transition-all duration-500 hover:scale-[1.01]">
      <h2 className="text-2xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{question.text}</h2>
      {question.longText && <p className="text-slate-400 mb-4 text-sm">{question.longText}</p>}
      
      {question.type === 'textarea' ? (
        <textarea
          id={question.id}
          value={answer}
          onChange={handleChange}
          placeholder={question.placeholder || 'Your answer here...'}
          rows={5}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-slate-100 placeholder-slate-500"
        />
      ) : (
        <input
          id={question.id}
          type="text"
          value={answer}
          onChange={handleChange}
          placeholder={question.placeholder || 'Your answer here...'}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors text-slate-100 placeholder-slate-500"
        />
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-md transition-all transform hover:scale-105"
        >
          {isLastQuestion ? 'Review Masterplan' : 'Next'}
        </button>
      </div>
    </div>
  );
};
