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
                <p className="text-white font-semibold">Havish Tagore.L</p>
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




