"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";
import { ClipboardCheck, UtensilsCrossed, Target } from "lucide-react";

export function OurApproachSection() {
  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-7xl">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              Our Approach
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Our</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three pillars of transformation: Precision, Nutrition, and Training
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Precision Assessment */}
          <ScrollAnimation delay={0}>
            <div className="premium-card rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Precision Assessment</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Comprehensive Health Assessment:</strong> Perform a careful analysis of the client's medical history, present level of fitness, present health issues, and specified goals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Body Composition Analysis:</strong> To create a personalised exercise regimen, use cutting-edge techniques to assess your body's proportion of muscle to fat.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Mobility and Flexibility Assessment:</strong> Assess the client's posture, flexibility, and range of motion to find potential injury-prevention and improvement areas.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Strength and Endurance Testing:</strong> Determine the client's baseline fitness level and set attainable goals by testing their strength, endurance, and general fitness.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Goal-Setting and Programme Customization:</strong> Establish realistic fitness goals together, design a unique workout schedule, and set benchmarks to precisely monitor progress.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>

          {/* Personalized Nutrition */}
          <ScrollAnimation delay={150}>
            <div className="premium-card rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Personalized Nutrition</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Nutritional Assessment:</strong> Tailored analysis of your dietary habits, preferences, and goals to understand your unique nutritional needs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Customized Meal Plans:</strong> Creation of personalized meal plans designed to align with your fitness objectives, ensuring optimal nourishment.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Macronutrient Guidance:</strong> Expert advice on managing protein, fats, and carbohydrates to support muscle growth, fat loss, and overall performance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Ongoing Nutrition Support:</strong> Continuous monitoring and adjustments to your nutrition plan, providing guidance and support for sustained progress and well-being.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>

          {/* Targeted Training */}
          <ScrollAnimation delay={300}>
            <div className="premium-card rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Targeted Training</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Assessment and Goal Setting:</strong> We begin by understanding your fitness goals and conducting a thorough assessment of your current fitness level.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Personalized Workout Plans:</strong> Based on the assessment, we create a customized workout plan that aligns with your goals, ensuring targeted and effective training sessions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Focused Exercise Selection:</strong> Our trainers select exercises that specifically target the muscle groups you want to develop, optimizing your training regime.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Progress Tracking and Adjustments:</strong> We closely monitor your progress, making necessary adjustments to your workout plan to ensure consistent progress towards your goals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">Guidance and Support:</strong> Throughout your fitness journey, our trainers provide guidance and support, ensuring you perform exercises with proper form and technique for optimal results.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}




