import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';

const services: Record<string, { title: string; description: string; details: string[] }> = {
  'weight-loss': {
    title: 'Weight Loss Program',
    description: 'Customized weight loss programs designed to help you shed pounds safely and sustainably.',
    details: [
      'Personalized nutrition guidance',
      'Cardio and strength training mix',
      'Progress tracking and adjustments',
      'Lifestyle modification support',
    ],
  },
  'weight-gain': {
    title: 'Weight Gain Program',
    description: 'Structured muscle-building programs for healthy weight gain and strength development.',
    details: [
      'Progressive strength training',
      'Nutrition planning for muscle growth',
      'Recovery and rest protocols',
      'Body composition tracking',
    ],
  },
  'strength-conditioning': {
    title: 'Strength & Conditioning',
    description: 'Build functional strength and improve athletic performance with our conditioning programs.',
    details: [
      'Functional movement patterns',
      'Power and agility training',
      'Sport-specific conditioning',
      'Injury prevention focus',
    ],
  },
  'rehab': {
    title: 'Rehabilitation Program',
    description: 'Recovery-focused training programs for injury rehabilitation and prevention.',
    details: [
      'Injury assessment and planning',
      'Therapeutic exercise protocols',
      'Mobility and flexibility work',
      'Gradual return to activity',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    return {
      title: 'Service Not Found - KR Fitness',
    };
  }

  return {
    title: `${service.title} - KR Fitness`,
    description: service.description,
    openGraph: {
      title: `${service.title} - KR Fitness`,
      description: service.description,
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    notFound();
  }

  const serviceUrl = `https://krfitnessstudio.com/services/${slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is included in the ${service.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": service.details.join(", ")
        }
      },
      {
        "@type": "Question",
        "name": "How long does the program take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Program duration varies based on your goals and progress. We'll create a personalized timeline during your initial consultation."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need any equipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Equipment requirements depend on the program. Some programs can be done at home with minimal equipment, while others utilize our fully equipped studio."
        }
      },
      {
        "@type": "Question",
        "name": "What certifications do your trainers have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our lead trainer is certified with EREPS Level 4, MDUK LEVEL 1, SKILL INDIA, NSCA, FUNCTIONAL TRAINING FSSA, INFS, and THAI BODY WORKS."
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Fitness Training",
            "name": service.title,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "KR Fitness Studio",
              "url": "https://krfitnessstudio.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shiv krupa complex No.133 4th cross, Uttarahalli Hobli",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560061",
                "addressCountry": "IN"
              }
            },
            "areaServed": {
              "@type": "City",
              "name": "Bengaluru"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": service.title,
              "itemListElement": service.details.map((detail, index) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": detail
                }
              }))
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://krfitnessstudio.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://krfitnessstudio.com/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": service.title,
                "item": serviceUrl
              }
            ]
          }),
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-gray-700 mb-6">{service.description}</p>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
              <ul className="space-y-2">
                {service.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">✓</span>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Train with KR Fitness */}
            <div className="mb-8 bg-orange-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Why Train with KR Fitness?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>EREPS Level 4 certified trainer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Personalized programs tailored to your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Proven track record of successful transformations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Holistic support including nutrition and lifestyle coaching</span>
                </li>
              </ul>
            </div>

            {/* Testimonials */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Client Success Stories</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-2">
                    "The personalized approach and expert guidance helped me achieve results I
                    never thought possible."
                  </p>
                  <p className="text-sm font-semibold">- Satisfied Client</p>
                </div>
              </div>
            </div>

            {/* Transformations Link */}
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-gray-700 mb-2">See real transformation results</p>
              <Link
                href="/transformations"
                className="text-orange-600 font-semibold hover:text-orange-700"
              >
                View Transformations →
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Interested in This Program?</h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you with more details and pricing information.
              </p>
              <Suspense fallback={<div>Loading form...</div>}>
                <LeadForm source="services_page" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

