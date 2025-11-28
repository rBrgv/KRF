import { Metadata } from 'next';
import { HealthAssessmentWizard } from './components/HealthAssessmentWizard';

export const metadata: Metadata = {
  title: 'Health & Fitness Diagnostic - KR Fitness',
  description: 'Take our comprehensive health assessment to discover your personalized health score and receive expert recommendations.',
};

export default function HealthCheckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <HealthAssessmentWizard />
      </div>
    </div>
  );
}



