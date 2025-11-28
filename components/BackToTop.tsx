"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-110 group"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" />
    </button>
  );
}




