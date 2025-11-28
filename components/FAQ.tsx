"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How often should I train with a personal trainer?",
    answer: "The frequency depends on your goals, schedule, and fitness level. Most clients see great results with 2-3 sessions per week. We'll work with you to create a schedule that fits your lifestyle and maximizes your progress.",
  },
  {
    question: "Do you provide nutrition guidance?",
    answer: "Yes! We provide personalized nutrition plans and guidance to complement your training. Nutrition is a crucial part of achieving your fitness goals, and we ensure a holistic approach to your transformation.",
  },
  {
    question: "What certifications do your trainers have?",
    answer: "Our lead trainer is certified with EREPS Level 4, MDUK LEVEL 1, SKILL INDIA, NSCA, FUNCTIONAL TRAINING FSSA, INFS, and THAI BODY WORKS. We maintain the highest international standards in exercise science and training methodology.",
  },
  {
    question: "Can I train if I have a medical condition?",
    answer: "Absolutely! We specialize in training for various medical conditions. During your initial consultation, we'll assess your condition and create a safe, effective program tailored to your needs. Always consult with your doctor first.",
  },
  {
    question: "What's the difference between Silver, Gold, and Platinum programs?",
    answer: "Silver is for solo training at your own pace. Gold is for small groups of 2-3 like-minded individuals. Platinum is our online customized program for home workouts with weights or resistance bands. Each is designed for different preferences and lifestyles.",
  },
  {
    question: "How do you track progress?",
    answer: "We use various assessment tools and regular check-ins to monitor your progress. This includes body measurements, strength assessments, photos, and goal tracking. We adjust your plan based on results and celebrate your achievements along the way.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about training with KR Fitness
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="premium-card rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-white pr-4 group-hover:text-red-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-red-400" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




