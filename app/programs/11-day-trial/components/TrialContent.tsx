'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { TrialLeadForm } from '@/components/forms/TrialLeadForm';
import { Check, Download, ArrowRight, Sparkles, Target, Zap, Heart, CheckCircle } from 'lucide-react';

interface TrialContentProps {
  pdfPath: string;
}

export function TrialContent({ pdfPath }: TrialContentProps) {
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const handleLeadSuccess = (id: string) => {
    setLeadId(id);
    setLeadSubmitted(true);
    // Scroll to PDF section after a brief delay
    setTimeout(() => {
      const pdfSection = document.getElementById('pdf-section');
      if (pdfSection) {
        pdfSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-semibold uppercase tracking-wider text-green-400 mb-6">
                Zero Cost • Zero Commitment
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Start Your
                <br />
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Transformation Journey
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Perfect for people who are <span className="text-red-400 font-semibold">confused, stuck, or scared to start</span>. 
                This 11-day free trial removes all barriers and helps you activate your fitness genes.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Lead Capture Form Section - Show before PDF */}
      {!leadSubmitted && (
        <section className="relative py-20 px-4 bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <TrialLeadForm onSuccess={handleLeadSuccess} />
          </div>
        </section>
      )}

      {/* Success Message */}
      {leadSubmitted && (
        <section className="relative py-12 px-4 bg-gray-900">
          <div className="container mx-auto max-w-4xl">
            <ScrollAnimation>
              <div className="premium-card border-green-500/30 bg-green-500/10 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Success! Your Guide is Ready
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Thank you for joining us! Scroll down to view and download your free guide.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* What You Get Section */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                What You Get in This Free Trial
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Everything you need to break through confusion, fear, and overthinking
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Zap className="w-8 h-8 text-red-400" />,
                title: "Daily 15–20 Min Tasks",
                description: "Mindset, fitness, breathing, and habits - all in one simple routine",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-red-400" />,
                title: "Switch On Your Fitness Genes",
                description: "A powerful ritual to activate discipline and unlock your potential",
              },
              {
                icon: <Target className="w-8 h-8 text-red-400" />,
                title: "Simple Method for Everyone",
                description: "No equipment needed. Anyone can follow, regardless of fitness level",
              },
              {
                icon: <Heart className="w-8 h-8 text-red-400" />,
                title: "11 Days Habit Blueprint",
                description: "Transform your habits and build consistency that lasts",
              },
              {
                icon: <ArrowRight className="w-8 h-8 text-red-400" />,
                title: "Workshop Access",
                description: "Get access to the full workshop after completing the challenge",
              },
              {
                icon: <Check className="w-8 h-8 text-red-400" />,
                title: "Remove Confusion & Fear",
                description: "Designed specifically to eliminate overthinking and get you started",
              },
            ].map((benefit, idx) => (
              <ScrollAnimation key={idx} delay={idx * 100}>
                <div className="premium-card rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:border-red-500/50">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Viewer Section - Only show after form submission */}
      {leadSubmitted && (
        <section id="pdf-section" className="relative py-20 px-4 bg-gray-800/50">
          <div className="container mx-auto max-w-6xl">
            <ScrollAnimation>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                  Your Complete Guide
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                  Scroll through the guide below or download it to keep forever
                </p>
                <a
                  href={pdfPath}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 text-base font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                  <Download className="w-5 h-5" />
                  Download PDF Guide
                </a>
              </div>
            </ScrollAnimation>

            <ScrollAnimation>
              <div className="premium-card rounded-2xl p-4 md:p-8 overflow-hidden">
                <div className="w-full h-[600px] md:h-[800px] rounded-lg overflow-hidden border border-gray-700">
                  <iframe
                    src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full"
                    title="11 Day Trial Guide"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400 mb-4">
                    Having trouble viewing?{" "}
                    <a
                      href={pdfPath}
                      download
                      className="text-red-400 hover:text-red-300 font-semibold underline"
                    >
                      Download the PDF
                    </a>{" "}
                    to view on your device
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* Perfect For Section */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-6">
                Perfect For
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
                This Trial Is Perfect If You Are:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  "A beginner who's never started",
                  "An overthinker who needs clarity",
                  "Someone restarting their fitness journey",
                  "Anyone who wants to test before committing",
                  "Someone stuck in analysis paralysis",
                  "A person scared to take the first step",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                If any of these sound like you, this free trial is designed to help you break through and start your transformation journey.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              {leadSubmitted ? "Ready to Start Your Journey?" : "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {leadSubmitted
                ? "You've got your guide! Start your 11-day transformation today and see the results."
                : "Fill in your details above to get instant access to your free guide. Zero cost, zero commitment, maximum impact."}
            </p>
            {leadSubmitted ? (
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={pdfPath}
                  download
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Download Free Guide
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-700 px-10 py-4 text-lg font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 backdrop-blur-sm"
                >
                  Have Questions? Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <p className="text-gray-400">
                Scroll up to fill in your details and get instant access
              </p>
            )}
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

