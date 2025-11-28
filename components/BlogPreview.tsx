"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "nutrition-basics",
    title: "Nutrition Basics for Fitness Success",
    excerpt: "Learn the fundamentals of nutrition that complement your training and accelerate your results.",
    date: "2024-01-15",
    category: "Nutrition",
  },
  {
    slug: "workout-motivation",
    title: "Staying Motivated: Tips from Top Trainers",
    excerpt: "Discover proven strategies to maintain motivation and consistency in your fitness journey.",
    date: "2024-01-10",
    category: "Motivation",
  },
  {
    slug: "recovery-importance",
    title: "Why Recovery is Just as Important as Training",
    excerpt: "Understanding the role of rest and recovery in achieving optimal fitness results.",
    date: "2024-01-05",
    category: "Training",
  },
];

export function BlogPreview() {
  return (
    <section className="relative py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            Blog
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Latest Fitness Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Expert tips, nutrition advice, and success stories to help you achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.slug}`}
              className="group premium-card rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-700 px-8 py-3 text-base font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5"
          >
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}




