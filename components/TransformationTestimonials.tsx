"use client";

import { ScrollAnimation } from "@/components/ScrollAnimation";

const transformationTestimonials = [
  {
    text: "I started personal training at KR FITNESS STUDIO after visiting multiple gyms. I decided to join KR Fitness because of the ambiance and Mr. Keerthi Raj's knowledge. The best part of this personal training studio is the customised program design based on your requirements and fat percentage check. They focus on fat loss rather than weight loss every week. If you are looking for personal training, I strongly recommend trying it and experiencing the best personal training. Also, the trainer is highly certified and knowledgeable.",
    name: "Arpitha MJ appu",
  },
  {
    text: "K R Fitness personal training studio is a place where one gets personal attention and guidance to meet their fitness goals. The efforts Keerthiraj sir puts to analyse each persons body type and design workouts for individual is commendable. With his guidance I have seen noticable results in just 3 months. This place has motivating and positive vibes. The studio is well equiped and clean.",
    name: "Rashmi bhat",
  },
  {
    text: "Hands down, best choice I've made training at KR fitness personal training studio. Our coach, Keerthi Raj sir is so upbeat, motivating, knowledgeable and encouraging. The community we have built at this studio is incredible, and it is such a joy working out here. I really like how my coach give me tips and tricks to get the most out of every workouts are always new and engaging. Our coach care about not only getting you to sweat, but also making sure you are staying safe. Would highly recommend for anyone looking for a better version of themselves!",
    name: "Tirtha Vijaykumar",
  },
];

export function TransformationTestimonials() {
  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
              Our Exclusive Client's
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Our Happy Clients!
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real testimonials from clients who transformed their lives with KR Fitness
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transformationTestimonials.map((testimonial, idx) => (
            <ScrollAnimation key={idx} delay={idx * 150}>
              <div className="group premium-card rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/30 to-red-700/20 border border-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-sm">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">Verified Client</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}




