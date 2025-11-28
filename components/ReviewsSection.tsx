"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Star } from "lucide-react";

export function ReviewsSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              Trusted By Thousands
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              What Our Clients Say
            </h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Google Reviews */}
          <ScrollAnimation delay={0}>
            <div className="premium-card rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-5xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                5/5
              </div>
              <div className="text-2xl font-bold text-white mb-2">2,394 Ratings</div>
              <div className="text-gray-400 text-sm mb-4">Google Reviews</div>
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-300 italic mb-3">
                  "One of the best fitness studios you can ever come across, lovely atmosphere, well maintained and hygienic."
                </p>
                <p className="text-white font-semibold mb-4">Havish Tagore.L</p>
                <a
                  href="https://www.google.com/search?q=kr+fitness+studio+reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  View All Google Reviews
                </a>
              </div>
            </div>
          </ScrollAnimation>

          {/* BBB Rating */}
          <ScrollAnimation delay={150}>
            <div className="premium-card rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-5xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                5/5
              </div>
              <div className="text-2xl font-bold text-white mb-2">39 Student Reviews</div>
              <div className="text-gray-400 text-sm mb-4">BBB Rating</div>
              <div className="text-4xl font-bold text-green-500 mb-2">A+</div>
              <p className="text-gray-400 text-sm">Better Business Bureau</p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}




