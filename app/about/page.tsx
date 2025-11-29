import type { Metadata } from 'next';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { CertificationsGallery } from '@/components/CertificationsGallery';
import { YouTubePlaylist } from '@/components/YouTubePlaylist';

export const metadata: Metadata = {
  title: 'About Best Gym Trainer in Bangalore | KR Fitness Gym | Meet Your Coach',
  description:
    'Meet Keerthi Raj, founder and lead trainer at KR Fitness gym in Bangalore. Best gym trainer in Bengaluru with over 15 years of training experience and multiple international certifications. Expert gym trainer for online and offline training.',
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
                Meet Your Coach
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

          {/* Published Author Section */}
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src="/book.png"
                      alt="I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation by Keerthi Raj"
                      className="relative w-48 md:w-56 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                
                {/* Book Info */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-3">
                    Published Author
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    I CAN GET TRANSFORMED: 9 Stories of Unbelievable Transformation
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Discover the incredible journeys of transformation through real stories of perseverance, dedication, and life-changing results. This book shares 9 inspiring stories that prove transformation is possible for anyone willing to commit to their fitness journey.
                  </p>
                  
                  {/* Purchase Links */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {/* Flipkart Button - Authentic Style with Yellow */}
                    <a
                      href="https://dl.flipkart.com/s/9KdIZkuuuN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-white hover:bg-gray-50 transition-all shadow-sm hover:shadow-md border border-gray-200"
                    >
                      {/* Flipkart Logo with Yellow */}
                      <div className="flex items-center gap-2">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Shopping Cart Icon - Flipkart Style */}
                          <rect x="3" y="6" width="18" height="14" rx="2" fill="#FFC700" stroke="#2874f0" strokeWidth="1.5"/>
                          <circle cx="8" cy="19" r="1.5" fill="#2874f0"/>
                          <circle cx="19" cy="19" r="1.5" fill="#2874f0"/>
                          <path d="M3 8h18" stroke="#2874f0" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M7 12h10" stroke="#2874f0" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[#2874f0] font-bold text-sm">Flipkart</span>
                      </div>
                      <span className="text-gray-600 text-sm font-medium">Buy Now</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    
                    {/* Amazon Button - Authentic Style */}
                    <a
                      href="https://amzn.in/d/5m90BjH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-[#FF9900] hover:bg-[#FF8800] transition-all shadow-sm hover:shadow-md"
                    >
                      {/* Amazon Arrow */}
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span className="text-white font-semibold text-sm">Buy on Amazon</span>
                      <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation>
            <h2 className="text-3xl font-bold mt-12 mb-8 text-white text-center">Certifications</h2>
            
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
