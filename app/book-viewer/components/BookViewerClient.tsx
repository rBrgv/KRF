'use client';

import { useState } from 'react';
import { FlipbookViewer } from '@/components/FlipbookViewer';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Download, BookOpen } from 'lucide-react';

export function BookViewerClient() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const pdfPath = '/kr-book-final-draft.pdf';

  const handlePurchase = () => {
    // TODO: Integrate with payment gateway
    // For now, redirect to contact page
    window.location.href = '/contact?purchase=book';
  };

  const handleUnlock = () => {
    // This would typically be called after successful payment
    setIsUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
                <BookOpen className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Your Complete
                <br />
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Transformation Guide
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Flip through the pages below. Preview selected pages free, then unlock the full book to download.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Book Viewer Section */}
      <section className="relative py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <FlipbookViewer
            pdfPath={pdfPath}
            previewPages={[1, 4, 7, 9, 10, 99]} // Show specific pages: 1, 4, 7, 9, 10, 99
            isUnlocked={isUnlocked}
            onPurchase={handlePurchase}
            coverImage="/Book.png"
            backCoverImage="/BACK COVER.jpg"
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">1</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Preview Free</h3>
                  <p className="text-gray-400">
                    Flip through selected preview pages to see what's inside
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">2</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Unlock Full Book</h3>
                  <p className="text-gray-400">
                    Purchase to unlock all pages and get full access
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">3</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Download & Keep</h3>
                  <p className="text-gray-400">
                    Download the complete PDF to keep forever
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}


