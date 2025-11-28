"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "I started personal training at KR FITNESS STUDIO after visiting multiple gyms. I decided to join KR Fitness because of the ambiance and Mr. Keerthi Raj's knowledge. The best part of this personal training studio is the customised program design based on your requirements and fat percentage check. They focus on fat loss rather than weight loss every week. If you are looking for personal training, I strongly recommend trying it and experiencing the best personal training. Also, the trainer is highly certified and knowledgeable.",
    name: "Arpitha MJ appu",
    role: "Verified Client",
    rating: 5,
  },
  {
    text: "K R Fitness personal training studio is a place where one gets personal attention and guidance to meet their fitness goals. The efforts Keerthiraj sir puts to analyse each persons body type and design workouts for individual is commendable. With his guidance I have seen noticable results in just 3 months. This place has motivating and positive vibes. The studio is well equiped and clean.",
    name: "Rashmi bhat",
    role: "Verified Client",
    rating: 5,
  },
  {
    text: "Hands down, best choice I've made training at KR fitness personal training studio. Our coach, Keerthi Raj sir is so upbeat, motivating, knowledgeable and encouraging. The community we have built at this studio is incredible, and it is such a joy working out here. I really like how my coach give me tips and tricks to get the most out of every workouts are always new and engaging. Our coach care about not only getting you to sweat, but also making sure you are staying safe. Would highly recommend for anyone looking for a better version of themselves!",
    name: "Tirtha Vijaykumar",
    role: "Verified Client",
    rating: 5,
  },
  {
    text: "I've never felt more motivated! The personalized training and expert guidance helped me reach my fitness goals faster than I expected. Highly recommend it!",
    name: "Priya S.",
    role: "Weight Loss Success",
    rating: 5,
  },
  {
    text: "Training with a personal fitness trainer has completely transformed my fitness journey. I now have a routine that works for me and the results speak for themselves!",
    name: "Rahul M.",
    role: "Strength Building",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 mb-6">Real results from real people</p>
          <a
            href="https://www.google.com/search?q=kr+fitness+studio+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read More Reviews on Google
          </a>
        </div>

        <div className="relative">
          {/* Testimonial Card */}
          <div className="premium-card rounded-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-6 justify-center">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <p className="text-xl text-gray-300 mb-8 italic text-center leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-gray-500 text-sm">{testimonials[currentIndex].role}</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 hidden md:flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 hidden md:flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-red-500"
                    : "w-2 bg-gray-700 hover:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

