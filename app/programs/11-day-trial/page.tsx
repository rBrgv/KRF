import type { Metadata } from "next";
import { Suspense } from "react";
import { TrialContent } from "./components/TrialContent";

export const metadata: Metadata = {
  title: "11 Days Free Mindset + Fitness Trial | Start Your Transformation Journey | KR Fitness",
  description:
    "Free 11-day mindset and fitness trial. Perfect for beginners, overthinkers, and anyone ready to start their transformation journey. Zero cost, zero commitment. Switch on your fitness genes today.",
  keywords: "free fitness trial, mindset transformation, 11 day challenge, beginner fitness program, free workout plan, fitness motivation, transformation journey, KR Fitness",
  openGraph: {
    title: "11 Days Free Mindset + Fitness Trial | KR Fitness",
    description: "Start your transformation journey with our free 11-day trial. Perfect for beginners and anyone ready to change their life.",
    type: "website",
  },
  alternates: {
    canonical: "/programs/11-day-trial",
  },
};

export default function ElevenDayTrialPage() {
  const pdfPath = "/activate-your-genetic-potential.pdf";

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    }>
      <TrialContent pdfPath={pdfPath} />
    </Suspense>
  );
}

