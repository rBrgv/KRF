"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Target, Brain, Activity } from "lucide-react";

export function WhyChooseSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              Your Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              You are here for a reason & that reason could be?
            </h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { letter: "A", title: "Transform through weight loss", icon: "🔥" },
            { letter: "B", title: "Transform through weight gain", icon: "💪" },
            { letter: "C", title: "Strength & Conditioning", icon: "🏋️" },
            { letter: "D", title: "Improve a medical condition", icon: "❤️" },
          ].map((item, idx) => (
            <ScrollAnimation key={idx} delay={idx * 100}>
              <div className="premium-card rounded-2xl p-6 text-center hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-3xl font-extrabold text-red-500 mb-2">{item.letter}.</div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              A fit body and mind is key to a healthier lifestyle. How can we help you?
            </h3>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollAnimation delay={0}>
            <div className="premium-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Trainer</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                A team of dedicated trainers, well experienced and certified, in personal training will guide you, step by step, in helping you achieve your goals….
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={150}>
            <div className="premium-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-3xl">🏋️</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Studio</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                A place dedicated to you!!! Our well equipped studio is designed to give you ample space and freedom to exercise, at your own pace, under close supervision.
              </p>
            </div>
          </ScrollAnimation>
        </div>

        <ScrollAnimation>
          <div className="mt-12 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
              How will it benefit you?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { letter: "A", title: "Meet your fitness goals", icon: "🎯" },
                { letter: "B", title: "Achieve a calm and active lifestyle", icon: "🧘" },
                { letter: "C", title: "Learn about your body and mind", icon: "🧠" },
              ].map((item, idx) => (
                <div key={idx} className="premium-card rounded-xl p-6">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-extrabold text-red-500 mb-2">{item.letter}.</div>
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}




