import { Metadata } from 'next';
import { HealthAssessmentWizard } from './components/HealthAssessmentWizard';

export const metadata: Metadata = {
  title: 'Health & Fitness Diagnostic - KR Fitness',
  description: 'Take our comprehensive health assessment to discover your personalized health score and receive expert recommendations.',
};

export default function HealthCheckPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Health & Fitness Diagnostic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Health & Fitness Diagnostic is a comprehensive 30+ question assessment that evaluates your physical health, nutrition, lifestyle, mental fitness, pain & mobility, and goal readiness. You'll receive a personalized health score (0-100) and expert recommendations."
        }
      },
      {
        "@type": "Question",
        "name": "How long does the assessment take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The assessment takes less than 60 seconds to complete. It's designed to be quick and easy while providing comprehensive insights into your health and fitness status."
        }
      },
      {
        "@type": "Question",
        "name": "What information do I need to provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll need to provide basic information like name, phone, email, and optionally your height and weight. The assessment includes questions about your physical activity, nutrition habits, lifestyle, mental wellness, and fitness goals."
        }
      },
      {
        "@type": "Question",
        "name": "Will my information be kept private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all your information is kept confidential and secure. We use your data only to create personalized fitness recommendations. Please review our Privacy Policy for more details."
        }
      },
      {
        "@type": "Question",
        "name": "What happens after I complete the assessment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After completing the assessment, you'll receive your personalized health score, category breakdowns, and detailed recommendations. You can download a PDF report and we'll create a lead in our system so our team can follow up with you."
        }
      },
      {
        "@type": "Question",
        "name": "Is the assessment free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the Health & Fitness Diagnostic is completely free. There's no cost to take the assessment and receive your personalized health score and recommendations."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="max-w-4xl mx-auto">
        <HealthAssessmentWizard />
      </div>
    </div>
  );
}



