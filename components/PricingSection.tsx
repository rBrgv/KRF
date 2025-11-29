"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "11 Days Free Mindset + Fitness Trial",
    price: "Free",
    priceNote: "Zero Cost",
    description: "Perfect for people who are confused, stuck, or scared to start.",
    features: [
      "Daily 15–20 min tasks (mindset, fitness, breathing, habits)",
      '"Switch On My Fitness Genes" ritual to activate discipline',
      "Simple method that anyone can follow",
      "11 days habit transformation blueprint",
      "Access to the workshop after completing the challenge",
      "Designed to remove confusion, fear & overthinking",
    ],
    perfectFor: "Beginners, overthinkers, people restarting, and anyone who wants clarity before committing.",
    popular: false,
    cta: "Start Free Trial",
    link: "/programs/11-day-trial",
  },
  {
    name: "4 Weeks Starter Program",
    price: "₹999",
    priceNote: "Beginner Friendly",
    description: "Best for people who want a plan, guidance, and accountability without spending big.",
    features: [
      "4-week structured workout plan (home or gym)",
      "Weekly progress check-in (photos, measurements, habits)",
      "Simple nutrition guidance—easy to follow for busy people",
      "WhatsApp support for questions, form checks & motivation",
      "Goal clarity session to set your transformation roadmap",
      "Perfect balance of affordability + professional coaching",
      "Build consistency, strength & discipline in just 30 days",
    ],
    perfectFor: "People who are confused on how to start, need structure, or want the push to get back on track.",
    popular: true,
    cta: "Start Your 4-Week Program",
    link: "/contact",
  },
  {
    name: "Master Transformation Program",
    price: "₹5,899",
    priceNote: "Premium Online Coaching - 12 Weeks",
    description: "Your signature, high-value 12-week program to get serious, guaranteed transformation.",
    features: [
      "12-week complete customised training plan updated when needed",
      "Personalised nutrition plan based on lifestyle, work schedule, and eating habits",
      "Weekly 1-on-1 call with Coach Keerthi Raj (12 calls over 12 weeks)",
      "Daily WhatsApp accountability (voice notes, check-ins, form correction)",
      "Mindset coaching system – identity shift, habit rewiring, discipline building",
      "Lifestyle coaching – sleep, stress, routine, digestion, recovery",
      "Progress tracking dashboard",
      "Premium result-focused guidance—fat loss, muscle gain, body recomposition",
      "Faster and long-term transformation guaranteed when you follow 100%",
    ],
    perfectFor: "People serious about transformation, busy professionals, athletes, and anyone who wants long-term results with expert guidance.",
    popular: false,
    cta: "Enroll in Master Program",
    link: "/contact",
  },
];

export function PricingSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            Transformation Path
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Choose Your Transformation Path
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Flexible programs for every lifestyle — online, remote, or hybrid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`premium-card rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.03] hover:border-red-500/50 ${
                plan.popular ? "border-2 border-red-500/50" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    {plan.price}
                  </div>
                  {plan.priceNote && (
                    <div className="text-sm text-gray-400 mt-1">{plan.priceNote}</div>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.perfectFor && (
                <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Perfect for:</p>
                  <p className="text-sm text-gray-300">{plan.perfectFor}</p>
                </div>
              )}
              <Link
                href={plan.link || "/contact"}
                className="block w-full text-center rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">All programs include personalized nutrition guidance</p>
          <Link
            href="/book"
            className="inline-flex items-center text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Book a free consultation to discuss your goals →
          </Link>
        </div>
      </div>
    </section>
  );
}

