'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS, SECTIONS, getQuestionsBySection } from '@/lib/questions';
import { QuestionRenderer } from './QuestionRenderer';
import { ResultsView } from './ResultsView';
import { AssessmentResult } from '@/lib/types/health-assessment';
import { ArrowRight, ArrowLeft, Check, Download, AlertCircle } from 'lucide-react';
import { generatePDFReport } from '@/lib/pdf-generator';
import { getRecommendations } from '@/lib/recommendations';

type WizardStep = 'landing' | 'assessment' | 'lead-capture' | 'results' | 'existing-assessment';

const STORAGE_KEY = 'health_assessment_progress';

export function HealthAssessmentWizard() {
  const [step, setStep] = useState<WizardStep>('landing');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [leadInfo, setLeadInfo] = useState({ name: '', phone: '', email: '', goal: '', ageGroup: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingAssessment, setExistingAssessment] = useState<AssessmentResult & { name?: string; phone?: string; email?: string | null; answers?: Record<string, any>; createdAt?: string } | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [lookupInfo, setLookupInfo] = useState({ email: '', phone: '' });
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [foundAssessment, setFoundAssessment] = useState<AssessmentResult & { name?: string; phone?: string; email?: string | null; answers?: Record<string, any>; createdAt?: string } | null>(null);

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

  // Load saved progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const progress = JSON.parse(saved);
          if (progress.answers && Object.keys(progress.answers).length > 0) {
            setHasSavedProgress(true);
          }
        } catch (e) {
          console.error('Error loading saved progress:', e);
        }
      }
    }
  }, []);

  // Save progress whenever answers, section, or question changes
  useEffect(() => {
    if (step === 'assessment' && Object.keys(answers).length > 0) {
      const progress = {
        answers,
        currentSectionIndex,
        currentQuestionIndex,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [answers, currentSectionIndex, currentQuestionIndex, step]);

  // Validation functions
  const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    // Only allow letters, spaces, and common name characters (apostrophes, hyphens)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name.trim())) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    // Check if it starts with valid Indian mobile number prefix (6-9)
    if (!/^[6-9]/.test(digitsOnly)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return null; // Email is optional
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validateGoal = (goal: string): string | null => {
    if (!goal.trim()) {
      return 'Fitness goal is required';
    }
    return null;
  };

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
    
    // Handle multiple choice questions (arrays)
    if (currentQuestion.type === 'choice' && currentQuestion.multiple) {
      if (!Array.isArray(value) || value.length === 0) {
        setErrors(prev => ({ ...prev, [currentQuestion.id]: 'Please select at least one option' }));
        return false;
      }
      return true;
    }
    
    // Handle single value questions
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

  // Check for existing assessment
  const checkExistingAssessment = async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const phoneDigits = leadInfo.phone.replace(/\D/g, '');
      const email = leadInfo.email.trim() || null;
      
      const response = await fetch('/api/health-assessments/check-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneDigits,
          email: email,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[Health Assessment] Non-JSON response from check-existing:', text.substring(0, 200));
        return false;
      }
      
      if (data.success && data.assessment) {
        // Generate recommendations for existing assessment
        const recommendations = getRecommendations(data.assessment.scores, data.assessment.answers || {});
        const assessmentWithRecs = {
          ...data.assessment,
          recommendations,
        };
        setExistingAssessment(assessmentWithRecs);
        setStep('existing-assessment');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking existing assessment:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartNew = () => {
    // Clear saved progress
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setAnswers({});
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setHasSavedProgress(false);
    setStep('assessment');
  };

  const handleResume = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const progress = JSON.parse(saved);
          setAnswers(progress.answers || {});
          setCurrentSectionIndex(progress.currentSectionIndex || 0);
          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setStep('assessment');
        } catch (e) {
          console.error('Error resuming progress:', e);
          handleStartNew();
        }
      }
    }
  };

  const handleLookupAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    
    if (!lookupInfo.email.trim() && !lookupInfo.phone.trim()) {
      setLookupError('Please enter either email or phone number');
      return;
    }

    setIsLookingUp(true);
    try {
      const phoneDigits = lookupInfo.phone.replace(/\D/g, '');
      const email = lookupInfo.email.trim() || null;
      
      if (!email && phoneDigits.length !== 10) {
        setLookupError('Please enter a valid 10-digit phone number or email');
        setIsLookingUp(false);
        return;
      }

      const response = await fetch('/api/health-assessments/check-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneDigits.length === 10 ? phoneDigits : undefined,
          email: email,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[Health Assessment] Non-JSON response from lookup:', text.substring(0, 200));
        setLookupError('Error checking for assessment. Please try again.');
        setIsLookingUp(false);
        return;
      }
      
      if (data.success && data.assessment) {
        // Generate recommendations for found assessment
        const recommendations = getRecommendations(data.assessment.scores, data.assessment.answers || {});
        const assessmentWithRecs = {
          ...data.assessment,
          recommendations,
        };
        setFoundAssessment(assessmentWithRecs);
      } else {
        setLookupError('No previous assessment found with this email or phone number.');
      }
    } catch (error: any) {
      console.error('Error looking up assessment:', error);
      setLookupError('Error checking for assessment. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleDownloadFoundReport = async () => {
    if (!foundAssessment) return;
    
    try {
      await generatePDFReport(foundAssessment, {
        name: foundAssessment.name || '',
        phone: foundAssessment.phone || '',
        email: foundAssessment.email || undefined,
        answers: foundAssessment.answers,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(leadInfo.name);
    if (nameError) newErrors.name = nameError;
    
    const phoneError = validatePhone(leadInfo.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const emailError = validateEmail(leadInfo.email);
    if (emailError) newErrors.email = emailError;
    
    const goalError = validateGoal(leadInfo.goal);
    if (goalError) newErrors.goal = goalError;
    
    const ageGroupError = !leadInfo.ageGroup ? 'Age group is required' : '';
    if (ageGroupError) newErrors.ageGroup = ageGroupError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for existing assessment first
    const exists = await checkExistingAssessment();
    if (exists) {
      return; // Stop here, show existing assessment view
    }

    setIsSubmitting(true);
    
    try {
      const phoneDigits = leadInfo.phone.replace(/\D/g, '');
      
      const response = await fetch('/api/health-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadInfo.name.trim(),
          phone: phoneDigits,
          email: leadInfo.email.trim() || undefined,
          goal: leadInfo.goal.trim() || undefined,
          ageGroup: leadInfo.ageGroup,
          answers,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, read as text to see what we got
        const text = await response.text();
        console.error('[Health Assessment] Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned an error. Status: ${response.status}`);
      }

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.error || 'Failed to submit assessment';
        const details = data.details ? `\n\nDetails: ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}` : '';
        throw new Error(errorMsg + details);
      }

      // Clear saved progress on successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
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
        
        {/* Returning Customer Lookup */}
        {!foundAssessment && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-600/50 rounded-lg">
            <p className="text-blue-300 mb-3 font-semibold">
              Returning Customer? Download Your Previous Assessment
            </p>
            <form onSubmit={handleLookupAssessment} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={lookupInfo.email}
                  onChange={(e) => {
                    setLookupInfo(prev => ({ ...prev, email: e.target.value }));
                    setLookupError('');
                  }}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-400 self-center">OR</span>
                <input
                  type="tel"
                  value={lookupInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setLookupInfo(prev => ({ ...prev, phone: value }));
                    setLookupError('');
                  }}
                  placeholder="Enter your phone"
                  maxLength={10}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLookingUp}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLookingUp ? 'Checking...' : 'Find My Assessment'}
                </button>
              </div>
              {lookupError && (
                <p className="text-red-400 text-sm">{lookupError}</p>
              )}
            </form>
          </div>
        )}

        {/* Found Assessment Display */}
        {foundAssessment && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-600/50 rounded-lg">
            <p className="text-green-300 mb-2 font-semibold">
              Assessment Found!
            </p>
            <p className="text-gray-300 text-sm mb-3">
              Completed on {foundAssessment.createdAt 
                ? new Date(foundAssessment.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'a previous date'} - Score: {foundAssessment.scores.overall}/100
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDownloadFoundReport}
                className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
              <button
                onClick={() => {
                  setFoundAssessment(null);
                  setLookupInfo({ email: '', phone: '' });
                  setLookupError('');
                }}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Lookup Another
              </button>
            </div>
          </div>
        )}

        {/* Saved Progress */}
        {hasSavedProgress && !foundAssessment && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
            <p className="text-yellow-300 mb-3">
              You have a saved assessment in progress. Would you like to resume?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleResume}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all"
              >
                Resume Assessment
              </button>
              <button
                onClick={handleStartNew}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Start Fresh
              </button>
            </div>
          </div>
        )}
        
        {/* Start New Assessment */}
        {!hasSavedProgress && !foundAssessment && (
          <button
            onClick={() => setStep('assessment')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/50 hover:scale-105"
          >
            Start Assessment
          </button>
        )}
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
              onChange={(e) => {
                setLeadInfo(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.name;
                    return newErrors;
                  });
                }
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={leadInfo.phone}
              onChange={(e) => {
                // Only allow digits, limit to 10
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setLeadInfo(prev => ({ ...prev, phone: value }));
                if (errors.phone) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.phone;
                    return newErrors;
                  });
                }
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter your 10-digit phone number"
              maxLength={10}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Email <span className="text-gray-400 text-sm">(Optional)</span>
            </label>
            <input
              type="email"
              value={leadInfo.email}
              onChange={(e) => {
                setLeadInfo(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                  });
                }
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Age Group <span className="text-red-400">*</span>
            </label>
            <select
              value={leadInfo.ageGroup}
              onChange={(e) => {
                setLeadInfo(prev => ({ ...prev, ageGroup: e.target.value }));
                if (errors.ageGroup) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.ageGroup;
                    return newErrors;
                  });
                }
              }}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.ageGroup ? 'border-red-500' : 'border-gray-700'
              }`}
            >
              <option value="">Select your age group</option>
              <option value="18-25">18-25 years</option>
              <option value="26-35">26-35 years</option>
              <option value="36-45">36-45 years</option>
              <option value="46-55">46-55 years</option>
              <option value="56-65">56-65 years</option>
              <option value="65+">65+ years</option>
            </select>
            {errors.ageGroup && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.ageGroup}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Fitness Goal <span className="text-red-400">*</span>
            </label>
            <textarea
              value={leadInfo.goal}
              onChange={(e) => {
                setLeadInfo(prev => ({ ...prev, goal: e.target.value }));
                if (errors.goal) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.goal;
                    return newErrors;
                  });
                }
              }}
              rows={4}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                errors.goal ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Tell us about your fitness goals..."
            />
            {errors.goal && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.goal}
              </p>
            )}
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
              disabled={isSubmitting || isChecking}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : isSubmitting ? 'Processing...' : 'Get My Results'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Existing Assessment Screen
  if (step === 'existing-assessment' && existingAssessment) {
    const handleDownloadExistingReport = async () => {
      try {
        await generatePDFReport(existingAssessment, {
          name: existingAssessment.name || leadInfo.name,
          phone: existingAssessment.phone || leadInfo.phone,
          email: existingAssessment.email || leadInfo.email || undefined,
          answers: existingAssessment.answers,
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF report. Please try again.');
      }
    };

    return (
      <div className="premium-card rounded-2xl p-6 md:p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Assessment Already Completed
          </h2>
          <p className="text-gray-300 mb-4">
            We found that you've already taken the health assessment.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Your previous assessment was completed on{' '}
            {existingAssessment.createdAt 
              ? new Date(existingAssessment.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'a previous date'}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <p className="text-white font-semibold mb-2">Your Previous Health Score</p>
          <div className="text-5xl font-extrabold text-red-500 mb-2">
            {existingAssessment.scores.overall}
            <span className="text-3xl text-gray-400">/100</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleDownloadExistingReport}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/50 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download Your PDF Report
          </button>
          
          <button
            onClick={() => {
              setStep('landing');
              setExistingAssessment(null);
              setLeadInfo({ name: '', phone: '', email: '', goal: '', ageGroup: '' });
              setAnswers({});
            }}
            className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === 'results' && result) {
    return <ResultsView result={result} />;
  }

  return null;
}

