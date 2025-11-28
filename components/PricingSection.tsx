"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "11-Day Genetic Activation Challenge",
    price: "Free",
    description: "A simple, science-based starter program built on epigenetic activation. Unlock better energy, discipline, and mindset in just 11 days.",
    features: [
      "15-minute daily routine",
      "Movement + breathwork + planning",
      "Identity-building affirmations",
      "Action templates from the challenge",
      "Beginner-friendly and zero equipment",
      "Based on Coach Keerthi's mindset system",
    ],
    popular: false,
    cta: "Learn More",
    link: "/contact",
  },
  {
    name: "4-Week Online Transformation Program",
    price: "₹999",
    priceNote: "One-time Payment",
    originalPrice: "₹12,000+",
    bonusValue: "₹7,600+",
    description: "Perfect for busy professionals who want structure, accountability, and real fat loss results without needing a gym.",
    features: [
      "Choose Any 4 Modules:",
      "• Nutrition: Simple guide for fat loss",
      "• DeskFit: 5-minute office workouts",
      "• Shift: Mindset identity upgrade",
      "• Code: 6–8 week fat-loss blueprint",
      "• TrackPro: Daily habit tracker",
      "• Access: Priority WhatsApp support",
      "• GymReady: Machine-confidence guide",
      "• Flex: Mobility routines",
      "• Origin: Keerthi's transformation secrets",
    ],
    guarantee: "7-day satisfaction guarantee. Try it risk-free.",
    popular: true,
    cta: "Start Your 4-Week Program",
    link: "/contact",
  },
  {
    name: "KR Fitness 3-Month Remote Coaching",
    price: "₹5,899",
    priceNote: "Complete Coaching Package",
    description: "A full coaching system for those who want professional guidance, structure, and accountability — from anywhere.",
    features: [
      "Initial Assessment (60 min)",
      "Personalised 12-Week Training Program",
      "Monthly 1:1 Consultations (3 calls)",
      "Weekly Check-ins",
      "Resource Pack",
      "Community Access (optional)",
      "Bonus: Printable progress tracker + workout cards",
    ],
    popular: false,
    cta: "Enroll in Remote Coaching",
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
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through mt-1">{plan.originalPrice}</div>
                  )}
                  {plan.bonusValue && (
                    <div className="text-sm text-green-400 mt-1">Bonus Value: {plan.bonusValue}</div>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.guarantee && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">{plan.guarantee}</p>
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

