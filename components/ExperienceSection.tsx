"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Sparkles, Dumbbell } from "lucide-react";

export function ExperienceSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              Training Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              EXPERIENCE THE NEXT LEVEL OF TRAINING
            </h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollAnimation delay={0}>
            <div className="premium-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Motivation</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Every trainer is different, but so is every client. A personal studio is a place where a one-on-one session can benefit you because there is constant communication between the trainer and you on the importance of the exercises being done and how to perform the exercises correctly.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={150}>
            <div className="premium-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Equipment</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                With the entire space at your disposal and access to all the equipment without waiting for it, can enable the trainer to do workouts alongside their clients to help correct form or challenge the client.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}




