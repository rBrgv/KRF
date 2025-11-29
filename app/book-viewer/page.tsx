import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookViewerClient } from './components/BookViewerClient';

export const metadata: Metadata = {
  title: 'Book Preview - KR Fitness | Flip Through Your Guide',
  description:
    'Preview and read the complete guide. Flip through pages with our interactive book viewer. Free preview available, unlock full access to download.',
  keywords: 'book preview, flipbook, interactive book, fitness guide, transformation guide, KR Fitness book',
  openGraph: {
    title: 'Book Preview - KR Fitness',
    description: 'Flip through your guide with our interactive book viewer.',
    type: 'website',
  },
};

export default function BookViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <div className="text-xl">Loading book viewer...</div>
          </div>
        </div>
      }
    >
      <BookViewerClient />
    </Suspense>
  );
}

