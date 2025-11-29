"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Transformation images from https://krfitnessstudio.com/transformation/
// These are the actual WhatsApp transformation images downloaded from the website
const transformationImages = [
  { 
    src: "/transformations/whatsapp-14.jpeg", 
    alt: "Client Transformation - Before & After 1"
  },
  { 
    src: "/transformations/whatsapp-12.jpeg", 
    alt: "Client Transformation - Before & After 2"
  },
  { 
    src: "/transformations/whatsapp-9.jpeg", 
    alt: "Client Transformation - Before & After 3"
  },
  { 
    src: "/transformations/whatsapp-7.jpeg", 
    alt: "Client Transformation - Before & After 4"
  },
  { 
    src: "/transformations/whatsapp-5.jpeg", 
    alt: "Client Transformation - Before & After 5"
  },
  { 
    src: "/transformations/whatsapp-6.jpeg", 
    alt: "Client Transformation - Before & After 6"
  },
  { 
    src: "/transformations/whatsapp-3.jpeg", 
    alt: "Client Transformation - Before & After 7"
  },
  { 
    src: "/transformations/whatsapp-4.jpeg", 
    alt: "Client Transformation - Before & After 8"
  },
  { 
    src: "/transformations/whatsapp-10.jpeg", 
    alt: "Client Transformation - Before & After 9"
  },
  { 
    src: "/transformations/whatsapp-2.jpeg", 
    alt: "Client Transformation - Before & After 10"
  },
  { 
    src: "/transformations/whatsapp-1.jpeg", 
    alt: "Client Transformation - Before & After 11"
  },
  { 
    src: "/transformations/whatsapp-11.jpeg", 
    alt: "Client Transformation - Before & After 12"
  },
  { 
    src: "/transformations/whatsapp-base.jpeg", 
    alt: "Client Transformation - Before & After 13"
  },
  { 
    src: "/transformations/whatsapp-15.jpeg", 
    alt: "Client Transformation - Before & After 14"
  },
  { 
    src: "/transformations/whatsapp-13.jpeg", 
    alt: "Client Transformation - Before & After 15"
  },
];

export function TransformationGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel - very slow
  useEffect(() => {
    if (!isAutoPlaying || selectedImage !== null) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % transformationImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedImage]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + transformationImages.length) % transformationImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % transformationImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume after 8 seconds
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsAutoPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsAutoPlaying(true);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    if (direction === "prev") {
      setSelectedImage(
        selectedImage === 0 ? transformationImages.length - 1 : selectedImage - 1
      );
    } else {
      setSelectedImage(
        selectedImage === transformationImages.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <>
      <section className="relative py-20 px-4 bg-gray-900 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Real Results, Real People
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See the incredible transformations achieved by our dedicated clients
            </p>
          </div>

          {/* Main Carousel */}
          <div className="relative mb-8">
            <div className="relative mx-auto max-w-sm md:max-w-md lg:max-w-lg">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden premium-card bg-gray-950">
                <img
                  src={transformationImages[currentIndex].src}
                  alt={transformationImages[currentIndex].alt}
                  className="w-full h-full object-cover transition-opacity duration-1000"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'%3E%3Crect fill='%231f2937' width='1200' height='700'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ETransformation%3C/text%3E%3C/svg%3E`;
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent cursor-pointer"
                  onClick={() => openLightbox(currentIndex)}
                >
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-white font-semibold text-sm mb-1">Click to view full size</p>
                    <p className="text-gray-400 text-xs">{currentIndex + 1} / {transformationImages.length}</p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 backdrop-blur-sm border border-gray-700 text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 backdrop-blur-sm border border-gray-700 text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {transformationImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? "border-red-500 scale-110 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                      : "border-gray-700 hover:border-gray-500 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {transformationImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-red-500"
                      : "w-2 bg-gray-700 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-900 border border-gray-800 text-white hover:bg-red-600 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 p-3 rounded-full bg-gray-900 border border-gray-800 text-white hover:bg-red-600 transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 p-3 rounded-full bg-gray-900 border border-gray-800 text-white hover:bg-red-600 transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[90vh]">
            <img
              src={transformationImages[selectedImage].src}
              alt={transformationImages[selectedImage].alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                // Fallback to placeholder if image doesn't exist
                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%231f2937' width='800' height='600'/%3E%3Ctext fill='%236b7280' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E`;
              }}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} / {transformationImages.length}
          </div>
        </div>
      )}
    </>
  );
}

