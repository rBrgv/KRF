import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { TransformationGallery } from '@/components/TransformationGallery';
import { YouTubePlaylist } from '@/components/YouTubePlaylist';

export const metadata: Metadata = {
  title: 'Best Gym Trainer in Bangalore | Discover KR Fitness | Keerthi Raj',
  description: 'Discover KR Fitness with Keerthi Raj, best gym trainer in Bangalore and founder of KR Fitness gym. Over 15 years of experience. See client transformations, read the book, watch podcasts, and read reviews from best gym in Bengaluru.',
  keywords: 'best gym trainer bangalore, gym trainer keerthi raj, gym trainer bengaluru, expert gym trainer bangalore, certified gym trainer, discover kr fitness',
};

export default function AboutCoachPage() {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll overscroll-y-none md:h-auto md:snap-none md:overflow-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Section 1: Keerthi Raj Info Box */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-950 snap-start snap-always md:min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                <div className="flex-shrink-0">
                  <div className="premium-card rounded-2xl overflow-hidden aspect-[3/4] w-48 md:w-64">
                    <img
                      src="/about/keerthi-raj-2.jpg"
                      alt="Keerthi Raj - Founder and Lead Trainer"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                    Discover KR Fitness
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                    MR. KEERTHI RAJ
                  </h1>
                  <p className="text-xl text-gray-300 mb-4">
                    Founder and Lead Trainer at KR Fitness Studio
                  </p>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    With an unwavering passion for fitness and a commitment to personal well-being, I am certified in various aspects of fitness and bring a wealth of knowledge and expertise to the fitness industry.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Transitioning from an MBA professional to a fitness expert, he brings over 15 years of training experience and holds multiple international certifications. His dedication to personal training has empowered numerous clients to achieve their fitness goals.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Section 2: Client Transformations */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-900 snap-start snap-always md:min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <TransformationGallery />
        </div>
      </section>

      {/* Section 3: Book and YouTube */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-950 snap-start snap-always md:min-h-screen">
        <div className="container mx-auto max-w-6xl">
          {/* Book Section */}
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src="/Book.png"
                      alt="I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation"
                      className="relative w-48 md:w-64 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
                    Published Author
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Discover the incredible journeys of transformation through real stories of perseverance, dedication, and life-changing results. This book shares 9 inspiring stories that prove transformation is possible for anyone willing to commit to their fitness journey.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
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

          {/* YouTube Section */}
          <ScrollAnimation>
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
                Podcast Series
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Watch My Podcast Playlist
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto">
                Explore insightful conversations, fitness tips, and transformation stories through my podcast series. Learn from real experiences and expert insights on health, fitness, and personal transformation.
              </p>
            </div>
            <YouTubePlaylist 
              playlistId="PL9HYtTMWoRPIVqpx3WlmMKAW4-Ae8XpcC"
              maxVideos={6}
            />
          </ScrollAnimation>
        </div>
      </section>

      {/* Section 4: Google Reviews */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-900 snap-start snap-always md:min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Client Reviews
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                Read real reviews from clients who have transformed their lives with KR Fitness
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-4xl">⭐</span>
                ))}
              </div>
              <div className="text-5xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
                5/5
              </div>
              <div className="text-2xl font-bold text-white mb-2">2,394 Ratings</div>
              <div className="text-gray-400 text-sm mb-8">Google Reviews</div>
              <div className="pt-4 border-t border-gray-800 mb-8">
                <p className="text-gray-300 italic mb-3 text-lg">
                  "One of the best fitness studios you can ever come across, lovely atmosphere, well maintained and hygienic."
                </p>
                <p className="text-white font-semibold">Havish Tagore.L</p>
              </div>
              <a
                href="https://www.google.com/search?q=kr+fitness+studio+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
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
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

