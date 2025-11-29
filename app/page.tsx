import Link from "next/link";
import type { Metadata } from "next";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { FAQ } from "@/components/FAQ";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TransformationGallery } from "@/components/TransformationGallery";
import { AboutStudioSection } from "@/components/AboutStudioSection";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { HeroSection } from "@/components/HeroSection";

export const metadata: Metadata = {
  title: "Best Gym in Bangalore | Gym Near Me | Online Gym Training | KR Fitness",
  description:
    "Best gym in Bangalore with personal training and online gym programs. Find gym near me in Bengaluru. Transform your body with personalized training from EREPS Level 4 certified trainer with 15+ years experience. Gym in Bangalore offering weight loss, strength training, and fitness coaching.",
  keywords: "gym in bangalore, gym near me, online gym, best gym bangalore, gym bangalore, fitness gym bangalore, gym in bengaluru, gym near me bangalore, online gym training, home gym trainer bangalore, personal trainer bangalore, gym trainer bangalore, fitness studio bangalore, weight loss gym bangalore, strength training gym bangalore, EREPS certified trainer, Keerthi Raj",
  openGraph: {
    title: "Best Gym in Bangalore | Gym Near Me | Online Gym Training - KR Fitness",
    description:
      "Best gym in Bangalore with personal training and online gym programs. Find gym near me in Bengaluru. Transform your body and mind with personalized training programs.",
    type: "website",
    locale: "en_IN",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 bg-transparent overflow-hidden">
        {/* Video Background */}
        <HeroVideoBackground 
          youtubeUrl="https://www.youtube.com/watch?v=pQTgr2rk9oc"
          segments={[
            { start: 28, end: 35 },   // 00:28 - 00:35
            { start: 39, end: 44 },   // 00:39 - 00:44
            { start: 54, end: 65 },   // 00:54 - 1:05
            { start: 69, end: 82 },   // 1:09 - 1:22
            { start: 84, end: 109 },  // 1:24 - 1:49
            { start: 124, end: 132 }, // 2:04 - 2:12
          ]}
        />
        
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-20" style={{ zIndex: 1 }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-3xl" style={{ zIndex: 1 }}></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/3 rounded-full blur-3xl" style={{ zIndex: 1 }}></div>
        
        <div className="container mx-auto max-w-6xl relative" style={{ zIndex: 10 }}>
          <div className="text-center max-w-5xl mx-auto">
            <HeroSection />
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Display */}
      <section className="relative py-16 px-4 bg-gray-950 border-y border-gray-800/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Years of Excellence", sublabel: "Proven track record" },
              { number: "500+", label: "Successful Transformations", sublabel: "Real results" },
              { number: "100%", label: "Personalized Programs", sublabel: "Tailored to you" },
              { number: "EREPS", label: "Level 4 Certified", sublabel: "International standard" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="premium-card rounded-xl p-6 hover:border-red-500/30 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Published Author Section */}
      <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Published Author
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                TRANSFORMATION STORIES THAT INSPIRE
              </h2>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src="/Book.png"
                      alt="I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation by Keerthi Raj"
                      className="relative w-48 md:w-64 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                
                {/* Book Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    Discover the incredible journeys of transformation through real stories of perseverance, dedication, and life-changing results. This book shares 9 inspiring stories that prove transformation is possible for anyone willing to commit to their fitness journey.
                  </p>
                  
                  {/* Purchase Links */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Link
                      href="/book-viewer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Read Now
                    </Link>
                    <a
                      href="https://dl.flipkart.com/s/9KdIZkuuuN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Buy on Flipkart
                    </a>
                    <a
                      href="https://amzn.in/d/5m90BjH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Buy on Amazon
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>


      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Testimonial Carousel */}
      <ScrollAnimation>
        <TestimonialCarousel />
      </ScrollAnimation>

      {/* Transformation Gallery */}
      <ScrollAnimation>
        <TransformationGallery />
      </ScrollAnimation>


      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Pricing Section */}
      <ScrollAnimation>
        <PricingSection />
      </ScrollAnimation>

      {/* FAQ Section */}
      <ScrollAnimation>
        <FAQ />
      </ScrollAnimation>


      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* About Studio Section */}
      <ScrollAnimation>
        <AboutStudioSection />
      </ScrollAnimation>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-950"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <ScrollAnimation>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Beyond the gym walls, your Personal Fitness Trainer in Bangalore helps you achieve lasting results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/transformations"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow"
            >
              <span className="relative z-10">View Transformations</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-700 px-10 py-4 text-base font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 backdrop-blur-sm"
            >
              Book Free Consultation
            </Link>
          </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
