'use client';

import Link from 'next/link';
import { Download } from 'lucide-react';
import { AssessmentResult } from '@/lib/types/health-assessment';
import { getOverallCategory } from '@/lib/recommendations';
import { generatePDFReport } from '@/lib/pdf-generator';

interface ResultsViewProps {
  result: AssessmentResult & {
    name?: string;
    phone?: string;
    email?: string | null;
    answers?: Record<string, any>;
  };
}

export function ResultsView({ result }: ResultsViewProps) {
  const category = getOverallCategory(result.scores.overall);
  
  const handleDownloadReport = async () => {
    if (!result.name || !result.phone) {
      alert('Unable to generate report: Missing personal information');
      return;
    }
    
    try {
      await generatePDFReport(result, {
        name: result.name,
        phone: result.phone,
        email: result.email || undefined,
        answers: result.answers,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };
  
  const categoryColors = {
    excellent: 'from-green-500 to-emerald-600',
    good: 'from-blue-500 to-cyan-600',
    warning: 'from-yellow-500 to-orange-600',
    high_alert: 'from-red-500 to-rose-600',
  };
  
  const categoryLabels = {
    excellent: 'Excellent',
    good: 'Good',
    warning: 'Needs Attention',
    high_alert: 'High Alert',
  };
  
  const scoreColors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    warning: 'text-yellow-400',
    high_alert: 'text-red-400',
  };
  
  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <div className={`premium-card rounded-2xl p-8 border-2 bg-gradient-to-br ${categoryColors[category]}`}>
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium mb-2">Your Health Score</p>
          <div className="text-7xl font-extrabold text-white mb-2">
            {result.scores.overall}
            <span className="text-4xl text-white/80">/100</span>
          </div>
          <p className={`text-xl font-semibold ${scoreColors[category]}`}>
            {categoryLabels[category]}
          </p>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="premium-card rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-2xl font-semibold text-white mb-6">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryBar label="Physical Health" score={result.scores.physical} max={25} />
          <CategoryBar label="Nutrition" score={result.scores.nutrition} max={15} />
          <CategoryBar label="Lifestyle" score={result.scores.lifestyle} max={15} />
          <CategoryBar label="Mental Fitness" score={result.scores.mental} max={20} />
          <CategoryBar label="Pain & Mobility" score={result.scores.pain_mobility} max={10} />
          <CategoryBar label="Goal Readiness" score={result.scores.goal_readiness} max={15} />
        </div>
      </div>
      
      {/* BMI removed - considered outdated metric */}
      
      {/* Recommendations */}
      <div className="premium-card rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-2xl font-semibold text-white mb-4">Personalized Recommendations</h3>
        <ul className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-300">
              <span className="text-xl mt-0.5">•</span>
              <span className="flex-1">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* CTA */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/50 hover:scale-105"
          >
            Book Free Consultation at KR Fitness Studio
          </Link>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-all border border-gray-700 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download PDF Report
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          Get personalized guidance from our expert trainers
        </p>
      </div>
    </div>
  );
}

function CategoryBar({ label, score, max }: { label: string; score: number; max: number }) {
  const percentage = (score / max) * 100;
  const colorClass = percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-semibold">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}


