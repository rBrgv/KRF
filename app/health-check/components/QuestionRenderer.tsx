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
        <label className="block text-base sm:text-lg font-semibold text-white mb-4 px-1">
          {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`flex-1 py-4 sm:py-5 px-2 sm:px-3 rounded-lg font-semibold transition-all text-lg sm:text-xl min-h-[56px] sm:min-h-[64px] active:scale-95 ${
                value === num
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm text-gray-400 px-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
      </div>
    );
  }
  
  if (question.type === 'choice') {
    const isMultiple = question.multiple === true;
    const selectedValues = isMultiple 
      ? (Array.isArray(value) ? value : [])
      : (value ? [value] : []);
    
    const handleChoiceClick = (choiceValue: string) => {
      if (isMultiple) {
        // Toggle selection for multiple choice
        const currentArray = Array.isArray(value) ? value : [];
        const newValue = currentArray.includes(choiceValue)
          ? currentArray.filter(v => v !== choiceValue)
          : [...currentArray, choiceValue];
        onChange(newValue.length > 0 ? newValue : null);
      } else {
        // Single selection
        onChange(choiceValue);
      }
    };
    
    return (
      <div className="space-y-4">
        <label className="block text-base sm:text-lg font-semibold text-white mb-4 px-1">
          {question.question}
          {question.required && <span className="text-red-400 ml-1">*</span>}
          {isMultiple && (
            <span className="text-gray-400 ml-2 text-xs sm:text-sm font-normal">(Select all that apply)</span>
          )}
        </label>
        
        <div className="space-y-2.5 sm:space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedValues.includes(choice.value);
            return (
              <button
                key={choice.value}
                type="button"
                onClick={() => handleChoiceClick(choice.value)}
                className={`w-full text-left py-3.5 sm:py-4 px-4 sm:px-5 rounded-lg font-medium transition-all flex items-center gap-3 sm:gap-4 min-h-[52px] sm:min-h-[56px] active:scale-[0.98] text-base sm:text-base ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600'
                }`}
              >
                {isMultiple && (
                  <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white border-white' 
                      : 'border-gray-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
                <span className="flex-1">{choice.label}</span>
              </button>
            );
          })}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
      </div>
    );
  }
  
  if (question.type === 'numeric') {
    return (
      <div className="space-y-4">
        <label className="block text-base sm:text-lg font-semibold text-white mb-4 px-1">
          {question.question}
          {!question.optional && <span className="text-red-400 ml-1">*</span>}
          {question.optional && <span className="text-gray-400 ml-2 text-xs sm:text-sm">(Optional)</span>}
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
            className="w-full px-4 py-3.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base min-h-[48px]"
          />
          {question.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
              {question.unit}
            </span>
          )}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
      </div>
    );
  }
  
  return null;
}



