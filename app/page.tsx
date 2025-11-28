import Link from "next/link";
import type { Metadata } from "next";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { FAQ } from "@/components/FAQ";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TransformationGallery } from "@/components/TransformationGallery";
import { BlogPreview } from "@/components/BlogPreview";
import { ReviewsSection } from "@/components/ReviewsSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { OurApproachSection } from "@/components/OurApproachSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { AboutStudioSection } from "@/components/AboutStudioSection";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";

export const metadata: Metadata = {
  title: "KR Fitness - Personal Fitness Trainer in Bangalore | Transform Your Body",
  description:
    "Personal Fitness Trainer in Bangalore offering training methods designed to fit your unique fitness journey. Push past limits with personalized training designed just for you. EREPS Level 4 certified with 15+ years experience.",
  keywords: "personal trainer bangalore, fitness trainer, gym trainer, personal training studio, weight loss trainer, strength training, EREPS certified trainer, Keerthi Raj",
  openGraph: {
    title: "KR Fitness - Personal Fitness Trainer in Bangalore",
    description:
      "Fitness is not a destination; it's a way of life - start at the gym. Transform your body and mind with personalized training programs.",
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              Elite Personal Training.
              <br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                One Client. One Coach.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light max-w-2xl mx-auto">
              Push past limits with personalized training designed just for you
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
              Fitness is not a destination; it's a way of life - start at the gym
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow"
              >
                <span className="relative z-10">Book Your Spot Now At Rs. 99 only</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/transformations"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-700 px-10 py-4 text-base font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 backdrop-blur-sm"
              >
                View Transformations
              </Link>
            </div>
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

      {/* Why Hire Personal Fitness Trainers in Bangalore */}
      <section className="relative py-20 px-4 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950 to-gray-900"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Why hire personal fitness trainers in Bangalore</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Hiring a personal fitness trainer in Bangalore can be a game-changer for your fitness journey. Here are a few reasons why it's a smart choice:
              </p>
            </div>
          </ScrollAnimation>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6">
              {[
                { title: "Focused Attention", desc: "Get one-on-one guidance tailored to your specific needs and goals." },
                { title: "Improved Technique", desc: "Learn proper form and technique to maximize results and prevent injuries." },
                { title: "Challenge & Progress Tracking", desc: "Stay motivated with personalized challenges and regular progress assessments." },
                { title: "Flexible Scheduling", desc: "Access to flexible training schedules that adapt to your busy lifestyle." },
                { title: "Tailored Fitness Approach", desc: "Completely tailored fitness experience designed for your unique journey." }
              ].map((item, idx) => (
                <ScrollAnimation key={idx} delay={idx * 100}>
                  <li className="group premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-red-400 font-bold text-xl">✓</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </li>
                </ScrollAnimation>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.03),transparent_50%)]"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                What You Get
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Benefits of a Personal Fitness Trainer</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Hiring a personal fitness trainer in Bangalore offers a wealth of benefits that can help you achieve your fitness goals more effectively and efficiently.
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Personalized Training Plans", desc: "Completely tailored fitness experience designed for your unique goals and needs.", icon: "🎯" },
              { title: "Nutritional Guidance", desc: "Receive a customized nutrition plan to complement your training and optimize your results.", icon: "🥗" },
              { title: "In Studio Training", desc: "Access to studio to transform with science-backed methods and professional equipment.", icon: "💪" },
              { title: "Expert Trainers", desc: "Work with certified professionals with over 15 years of training experience.", icon: "🏆" },
              { title: "Flexible Membership Plans", desc: "Choose from various membership options that fit your schedule and budget.", icon: "📅" },
              { title: "Accountability and Motivation", desc: "Stay on track with regular check-ins and continuous support throughout your journey.", icon: "🔥" }
            ].map((benefit, idx) => (
              <ScrollAnimation key={idx} delay={idx * 100}>
                <div className="group premium-card rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{benefit.desc}</p>
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                The Process
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">How It Works</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Your transformation journey in four simple steps
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Consultation", desc: "Free initial assessment to understand your goals, limitations, and lifestyle", icon: "📋" },
              { step: "02", title: "Custom Plan", desc: "Personalized training program designed specifically for your needs", icon: "📝" },
              { step: "03", title: "Train", desc: "One-on-one sessions with expert guidance and real-time form correction", icon: "💪" },
              { step: "04", title: "Transform", desc: "Track progress, celebrate milestones, and achieve lasting results", icon: "🎯" }
            ].map((item, idx) => (
              <ScrollAnimation key={idx} delay={idx * 150}>
                <div className="group relative">
                  <div className="premium-card rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.03] h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <div className="text-5xl font-extrabold text-gray-800 group-hover:text-red-500/20 transition-colors">{item.step}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                    {idx < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-700 to-transparent transform -translate-y-1/2">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-gray-600 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-24 px-4 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <ScrollAnimation>
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-6">
              Our Philosophy
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white leading-tight">
              Fitness is not a destination;<br />
              <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">it's a way of life</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Fitness is more than just reaching a specific goal, it's about embracing a lifestyle that prioritizes health, strength, and well-being. By working with a Personal Fitness Trainer in Bangalore, you take the first step towards a journey of consistent self-improvement.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                It's not just about short-term achievements but building habits that sustain a healthier, happier and more active life.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Certifications */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Credentials
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Certified In</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Internationally recognized certifications ensuring the highest standards</p>
            </div>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ScrollAnimation delay={0}>
              <div className="group premium-card rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">🏅</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Personal Training Certificate</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">EREPS level 4, MDUK LEVEL 1, SKILL INDIA</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <div className="group premium-card rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Additional Certifications</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">NSCA, FUNCTIONAL TRAINING FSSA, INFS, THAI BODY WORKS</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Why Choose Section */}
      <ScrollAnimation>
        <WhyChooseSection />
      </ScrollAnimation>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Experience Section */}
      <ScrollAnimation>
        <ExperienceSection />
      </ScrollAnimation>

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
                      src="/book.png"
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

      {/* Reviews Section */}
      <ScrollAnimation>
        <ReviewsSection />
      </ScrollAnimation>

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

      {/* Our Approach Section */}
      <ScrollAnimation>
        <OurApproachSection />
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

      {/* Blog Preview */}
      <ScrollAnimation>
        <BlogPreview />
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-6">
            Transformations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
            From challenge to change - <br />
            <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">watch yourself grow stronger</span>
          </h2>
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
