"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";
import Link from "next/link";

export function AboutStudioSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              We Help You Stay Healthy
            </h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation>
          <div className="premium-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-center">
              KR FITNESS STUDIO
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed text-center mb-8">
              KR Fitness Studio is your partner in achieving your health and fitness aspirations. We specialise in providing excellent personal training to meet your goals be it transformation ( Bulking & Fat loss ) or Strength & Conditioning, irrespective of your current physical condition. KR Fitness is a destination that encourages you to re-discover the strength of your own Mind and body.
            </p>
            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 text-base font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                Learn More About Keerthi Raj
                <span>→</span>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}




