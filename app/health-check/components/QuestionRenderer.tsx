'use client';

import { Question } from '@/lib/types/health-assessment';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function QuestionRenderer({ question, value, onChange, error }: QuestionRendererProps) {
  if (question.type === 'scale') {
    return (
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-white mb-4">
          {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`flex-1 py-4 px-2 rounded-lg font-semibold transition-all ${
                value === num
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
  
  if (question.type === 'choice') {
    return (
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-white mb-4">
          {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div className="space-y-2">
          {question.choices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => onChange(choice.value)}
              className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-all ${
                value === choice.value
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {choice.label}
            </button>
          ))}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
  
  if (question.type === 'numeric') {
    return (
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-white mb-4">
          {question.question}
          {!question.optional && <span className="text-red-400 ml-1">*</span>}
          {question.optional && <span className="text-gray-400 ml-2 text-sm">(Optional)</span>}
        </label>
        
        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val ? (question.unit === 'kg' ? parseFloat(val) : parseInt(val)) : null);
            }}
            min={question.min}
            max={question.max}
            placeholder={`Enter ${question.unit || 'value'}`}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {question.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {question.unit}
            </span>
          )}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }
  
  return null;
}



