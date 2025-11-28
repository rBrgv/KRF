'use client';

import { useState } from 'react';
import { QUESTIONS, SECTIONS, getQuestionsBySection } from '@/lib/questions';
import { QuestionRenderer } from './QuestionRenderer';
import { ResultsView } from './ResultsView';
import { AssessmentResult } from '@/lib/types/health-assessment';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

type WizardStep = 'landing' | 'assessment' | 'lead-capture' | 'results';

export function HealthAssessmentWizard() {
  const [step, setStep] = useState<WizardStep>('landing');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSection = SECTIONS[currentSectionIndex];
  const sectionQuestions = getQuestionsBySection(currentSection);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = sectionQuestions[currentQuestionIndex];

  // Calculate progress
  const totalQuestions = QUESTIONS.filter(q => !q.optional).length;
  const answeredQuestions = Object.keys(answers).filter(
    key => answers[key] !== null && answers[key] !== undefined && answers[key] !== ''
  ).length;
  const progress = step === 'assessment' ? (answeredQuestions / totalQuestions) * 100 : 0;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentQuestion = (): boolean => {
    // Only validate the current question, not all questions in section
    if (!currentQuestion) return true;
    
    // Skip validation for optional questions
    if (currentQuestion.optional || !currentQuestion.required) {
      return true;
    }
    
    // Check if current question is answered
    const value = answers[currentQuestion.id];
    if (value === null || value === undefined || value === '') {
      setErrors(prev => ({ ...prev, [currentQuestion.id]: 'This field is required' }));
      return false;
    }
    
    // Clear error if valid
    if (errors[currentQuestion.id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[currentQuestion.id];
        return newErrors;
      });
    }
    
    return true;
  };

  const handleNext = () => {
    console.log('[Health Assessment] Next clicked', {
      currentQuestion: currentQuestion?.id,
      currentAnswer: answers[currentQuestion?.id],
      currentSectionIndex,
      currentQuestionIndex,
    });
    
    // Validate only the current question
    if (!validateCurrentQuestion()) {
      console.log('[Health Assessment] Validation failed');
      return;
    }

    // Move to next question in section
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      console.log('[Health Assessment] Moving to next question in section');
    } else {
      // Move to next section
      if (currentSectionIndex < SECTIONS.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        console.log('[Health Assessment] Moving to next section');
      } else {
        // All sections complete, move to lead capture
        setStep('lead-capture');
        console.log('[Health Assessment] All sections complete, moving to lead capture');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Move to previous section
      if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1);
        const prevSectionQuestions = getQuestionsBySection(SECTIONS[currentSectionIndex - 1]);
        setCurrentQuestionIndex(prevSectionQuestions.length - 1);
      }
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadInfo.name.trim() || !leadInfo.phone.trim()) {
      alert('Name and phone are required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/health-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadInfo.name,
          phone: leadInfo.phone,
          email: leadInfo.email || undefined,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assessment');
      }

      setResult(data.data);
      setStep('results');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      alert(error.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Landing Screen
  if (step === 'landing') {
    return (
      <div className="premium-card rounded-2xl p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Health & Fitness Diagnostic
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Take our comprehensive health assessment to discover your personalized health score and receive expert recommendations tailored to your goals.
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <Check className="w-5 h-5 text-green-400" />
            <span>30+ questions across 5 key areas</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <Check className="w-5 h-5 text-green-400" />
            <span>Personalized health score (0-100)</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <Check className="w-5 h-5 text-green-400" />
            <span>Customized recommendations</span>
          </div>
        </div>
        <button
          onClick={() => setStep('assessment')}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/50 hover:scale-105"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  // Assessment Screen
  if (step === 'assessment') {
    const sectionLabels: Record<string, string> = {
      physical: 'Physical Health',
      pain: 'Pain & Mobility',
      lifestyle: 'Lifestyle & Nutrition',
      mental: 'Mental Fitness',
      goal: 'Goal Readiness',
    };

    return (
      <div className="premium-card rounded-2xl p-6 md:p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Section {currentSectionIndex + 1} of {SECTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-red-700 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white font-semibold mt-2">{sectionLabels[currentSection]}</p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            error={errors[currentQuestion.id]}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            {currentSectionIndex === SECTIONS.length - 1 && currentQuestionIndex === sectionQuestions.length - 1
              ? 'Continue'
              : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Lead Capture Screen
  if (step === 'lead-capture') {
    return (
      <div className="premium-card rounded-2xl p-6 md:p-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">Almost There!</h2>
        <p className="text-gray-300 mb-8">
          Enter your details to receive your personalized health assessment results.
        </p>

        <form onSubmit={handleLeadSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={leadInfo.name}
              onChange={(e) => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={leadInfo.phone}
              onChange={(e) => setLeadInfo(prev => ({ ...prev, phone: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Email <span className="text-gray-400 text-sm">(Optional)</span>
            </label>
            <input
              type="email"
              value={leadInfo.email}
              onChange={(e) => setLeadInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('assessment')}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Get My Results'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Results Screen
  if (step === 'results' && result) {
    return <ResultsView result={result} />;
  }

  return null;
}

