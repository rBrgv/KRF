import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { CertificationsGallery } from '@/components/CertificationsGallery';
import { YouTubePlaylist } from '@/components/YouTubePlaylist';

export const metadata: Metadata = {
  title: 'About Best Gym Trainer in Bangalore | KR Fitness Gym | Discover KR Fitness',
  description:
    'Discover KR Fitness with Keerthi Raj, founder and lead trainer at KR Fitness gym in Bangalore. Best gym trainer in Bengaluru with over 15 years of training experience and multiple international certifications. Expert gym trainer for online and offline training.',
  keywords: 'gym trainer bangalore, best gym trainer bangalore, gym trainer in bengaluru, online gym trainer, fitness trainer bangalore gym',
};

export default function AboutPage() {
  const playlistId = "PL9HYtTMWoRPIVqpx3WlmMKAW4-Ae8XpcC";
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "KR Fitness Podcast Series",
            "description": "Explore insightful conversations, fitness tips, and transformation stories through our podcast series. Learn from real experiences and expert insights on health, fitness, and personal transformation.",
            "thumbnailUrl": "https://krfitnessstudio.com/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png",
            "uploadDate": "2024-01-01",
            "contentUrl": playlistUrl,
            "embedUrl": `https://www.youtube.com/embed/videoseries?list=${playlistId}`,
            "publisher": {
              "@type": "Organization",
              "name": "KR Fitness Studio",
              "logo": {
                "@type": "ImageObject",
                "url": "https://krfitnessstudio.com/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png"
              }
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
                "name": "About",
                "item": "https://krfitnessstudio.com/about"
              }
            ]
          }),
        }}
      />
      {/* Hero Section with Images */}
      <section className="relative py-20 px-4 bg-gray-950">
        <div className="container mx-auto max-w-7xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Discover KR Fitness
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">MR. KEERTHI RAJ</h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Meet the driving force behind KR Fitness Studio - Founder and lead trainer Keerthi Raj
              </p>
            </div>
          </ScrollAnimation>

          {/* Image Display */}
          <div className="flex justify-center mb-12">
            <ScrollAnimation>
              <div className="premium-card rounded-2xl overflow-hidden aspect-[3/4] max-w-md w-full">
                <img
                  src="/about/keerthi-raj-2.jpg"
                  alt="Keerthi Raj - Founder and Lead Trainer"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-300 mb-6">
                With an unwavering passion for fitness and a commitment to personal well-being, I am certified in various aspects of fitness and bring a wealth of knowledge and expertise to the fitness industry.
              </p>
              <p className="text-gray-400 mb-6">
                Mr. Keerthi Raj is the founder and lead trainer at KR Fitness Studio in Bangalore, India. Transitioning from an MBA professional to a fitness expert, he brings over 15 years of training experience and holds multiple international certifications.
              </p>
              <p className="text-gray-400 mb-6">
                His dedication to personal training has empowered numerous clients to achieve their fitness goals. He offers personalized training programs tailored to individual needs, focusing on areas such as strength and conditioning, transformation (fat loss/bulking), and training for various medical conditions.
              </p>
            </div>
          </ScrollAnimation>

          {/* YouTube Podcast Playlist Section */}
          <ScrollAnimation>
            <div className="mb-12">
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
              
              {/* YouTube Playlist Embed */}
              <YouTubePlaylist 
                playlistId="PL9HYtTMWoRPIVqpx3WlmMKAW4-Ae8XpcC"
                maxVideos={6}
              />
            </div>
          </ScrollAnimation>
        </div>

        {/* Published Author Section */}
        <div className="relative pt-20 pb-12 px-4 overflow-hidden">
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
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative pt-12 pb-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold mb-8 text-white text-center">Certifications</h2>
            
            {/* Personal Training Certificate */}
            <div className="premium-card rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">🏅</span>
                </div>
                <h3 className="text-xl font-bold text-white">Personal Training Certificate</h3>
              </div>
              <p className="text-gray-400">EREPS level 4, MDUK LEVEL 1, SKILL INDIA</p>
              <p className="text-gray-500 text-sm mt-3">
                Having done the personal training certification, I have learned the fundamentals of fitness, movement, exercise science, training, and coaching. It also provided me with the knowledge base necessary to help clients meet their goals safely and effectively.
              </p>
            </div>

            {/* Certification Images Gallery */}
            <CertificationsGallery />

            {/* Certification Details */}
            <div className="premium-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">About These Certifications</h3>
              <div className="space-y-3 text-gray-400 text-sm">
                <p>
                  <strong className="text-gray-300">FSSA Functional Training:</strong> Helps each individual to keep functionally fit with right workout selection which helps you to do your day to day activities without injury and with lot of confidence.
                </p>
                <p>
                  <strong className="text-gray-300">INFS Nutrition:</strong> Nutrition certificate helps coach to help you to support your workout with right nutrition and mindful eating which is the supporting element in your transformation journey.
                </p>
                <p>
                  <strong className="text-gray-300">Thai Bodyworks:</strong> Specialized training in Thai bodywork techniques for enhanced flexibility and recovery.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <h2 className="text-3xl font-bold mt-12 mb-6 text-white">Our Mission</h2>
            <div className="premium-card rounded-2xl p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                KR Fitness Studio is your partner in achieving your health and fitness aspirations. We specialise in providing excellent personal training to meet your goals be it transformation (Bulking & Fat loss) or Strength & Conditioning, irrespective of your current physical condition. KR Fitness is a destination that encourages you to re-discover the strength of your own Mind and body.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation>
            <h2 className="text-3xl font-bold mt-12 mb-6 text-white">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { title: "Transform through weight loss", icon: "🔥" },
                { title: "Transform through weight gain", icon: "💪" },
                { title: "Strength & Conditioning", icon: "🏋️" },
                { title: "Improve a medical condition", icon: "❤️" },
              ].map((item, idx) => (
                <div key={idx} className="premium-card rounded-xl p-6 flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <p className="text-gray-300 font-semibold">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="premium-card rounded-2xl p-6 text-center">
              <p className="text-xl text-gray-300 font-semibold mb-2">
                A fit body and mind is key to a healthier lifestyle.
              </p>
              <p className="text-gray-400">How can we help you?</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
