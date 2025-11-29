'use client';

import { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Lock, Download, ZoomIn, ZoomOut } from 'lucide-react';

// Load PDF.js from CDN to avoid webpack bundling issues
let pdfjsLib: any = null;
let pdfjsLoaded = false;
let pdfjsLoading = false;

const loadPDFJS = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  
  if (pdfjsLoaded && pdfjsLib) {
    return pdfjsLib;
  }
  
  // If already loading, wait for it
  if (pdfjsLoading) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (pdfjsLoaded && pdfjsLib) {
          clearInterval(checkInterval);
          resolve(pdfjsLib);
        }
      }, 100);
    });
  }
  
  pdfjsLoading = true;
  
  return new Promise((resolve, reject) => {
    // Check if PDF.js is already loaded globally (from previous load)
    if ((window as any).pdfjsLib) {
      pdfjsLib = (window as any).pdfjsLib;
      pdfjsLoaded = true;
      pdfjsLoading = false;
      resolve(pdfjsLib);
      return;
    }
    
    // Check if script already exists
    const existingScript = document.querySelector('script[data-pdfjs]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if ((window as any).pdfjsLib) {
          clearInterval(checkLoaded);
          pdfjsLib = (window as any).pdfjsLib;
          pdfjsLoaded = true;
          pdfjsLoading = false;
          resolve(pdfjsLib);
        }
      }, 100);
      return;
    }
    
    // Load PDF.js from CDN using script tag (v3.11.174 is more stable with Next.js)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    script.async = true;
    script.setAttribute('data-pdfjs', 'true');
    
    script.onload = () => {
      // PDF.js v3 exposes itself as a global 'pdfjsLib'
      // Wait a moment for it to initialize
      setTimeout(() => {
        pdfjsLib = (window as any).pdfjsLib;
        
        if (!pdfjsLib) {
          pdfjsLoading = false;
          reject(new Error('PDF.js loaded but global object not found'));
          return;
        }
        
        // Set up worker
        if (pdfjsLib.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        }
        
        // Store globally for reuse
        (window as any).pdfjsLib = pdfjsLib;
        
        pdfjsLoaded = true;
        pdfjsLoading = false;
        resolve(pdfjsLib);
      }, 100);
    };
    
    script.onerror = (error) => {
      pdfjsLoading = false;
      console.error('Failed to load PDF.js from CDN:', error);
      reject(new Error('Failed to load PDF.js library from CDN'));
    };
    
    document.head.appendChild(script);
  });
};

interface FlipbookViewerProps {
  pdfPath: string;
  previewPages?: number; // Number of free preview pages (e.g., 5)
  isUnlocked?: boolean; // Whether user has purchased
  onPurchase?: () => void;
}

interface PageImage {
  src: string;
  pageNum: number;
  isLocked: boolean;
}

export function FlipbookViewer({ 
  pdfPath, 
  previewPages = 5, 
  isUnlocked = false,
  onPurchase 
}: FlipbookViewerProps) {
  const flipBookRef = useRef<any>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Set initial scale based on screen size
  const getInitialScale = () => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth < 640 ? 0.8 : 1;
  };
  const [scale, setScale] = useState(getInitialScale());
  const [bookSize, setBookSize] = useState({ width: 800, height: 1000 });
  const [error, setError] = useState<string | null>(null);

  // Calculate book size based on screen - optimized for mobile and desktop
  useEffect(() => {
    const updateSize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate aspect ratio (typical book is ~1.4:1)
      const bookAspectRatio = 1.4;
      
      if (width < 640) {
        // Mobile: Fit within viewport with safe margins
        // Account for controls (~120px), padding (32px), and safe area
        const availableWidth = width - 32; // 16px padding on each side
        const availableHeight = height - 180; // Space for controls, nav, and margins
        
        let bookWidth = availableWidth;
        let bookHeight = bookWidth * bookAspectRatio;
        
        // If height is too tall, scale down based on height instead
        if (bookHeight > availableHeight) {
          bookHeight = availableHeight;
          bookWidth = bookHeight / bookAspectRatio;
        }
        
        // Ensure minimum readable size
        const minWidth = 280;
        if (bookWidth < minWidth) {
          bookWidth = minWidth;
          bookHeight = bookWidth * bookAspectRatio;
        }
        
        setBookSize({ width: Math.floor(bookWidth), height: Math.floor(bookHeight) });
      } else if (width < 1024) {
        // Tablet: Fit within viewport
        const availableWidth = width - 128; // Account for padding and margins
        const availableHeight = height - 200; // Space for controls and nav
        
        let bookWidth = availableWidth;
        let bookHeight = bookWidth * bookAspectRatio;
        
        // If height is too tall, scale down based on height instead
        if (bookHeight > availableHeight) {
          bookHeight = availableHeight;
          bookWidth = bookHeight / bookAspectRatio;
        }
        
        setBookSize({ width: Math.floor(bookWidth), height: Math.floor(bookHeight) });
      } else {
        // Desktop: Fit within viewport with optimal margins
        const availableWidth = width - 200; // Account for padding, margins, and side space
        const availableHeight = height - 250; // Space for controls, nav, and top/bottom margins
        
        let bookWidth = availableWidth;
        let bookHeight = bookWidth * bookAspectRatio;
        
        // If height is too tall, scale down based on height instead
        if (bookHeight > availableHeight) {
          bookHeight = availableHeight;
          bookWidth = bookHeight / bookAspectRatio;
        }
        
        // Ensure maximum readable size (don't make it too large)
        const maxWidth = 1000;
        if (bookWidth > maxWidth) {
          bookWidth = maxWidth;
          bookHeight = bookWidth * bookAspectRatio;
        }
        
        setBookSize({ width: Math.floor(bookWidth), height: Math.floor(bookHeight) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSize, 100); // Wait for orientation change to complete
    });
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []); // Empty deps - only run on mount and resize

  // Load PDF and convert pages to images
  useEffect(() => {
    const loadPDF = async () => {
      if (typeof window === 'undefined') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Load PDF.js library first
        const pdfjs = await loadPDFJS();
        if (!pdfjs) {
          const errorMsg = 'Failed to load PDF.js library. Please check the browser console for details.';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        // Verify getDocument is available
        if (typeof pdfjs.getDocument !== 'function') {
          throw new Error('PDF.js loaded but getDocument is not a function');
        }
        
        // Load the PDF document
        // Use a simple configuration to avoid worker issues
        const loadingTask = pdfjs.getDocument(pdfPath);
        
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        const pageImages: PageImage[] = [];
        
        // Load pages sequentially to avoid overwhelming the browser
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          
          const imageSrc = canvas.toDataURL('image/png');
          pageImages.push({
            src: imageSrc,
            pageNum: i,
            isLocked: !isUnlocked && i > previewPages,
          });
        }
        
        setPages(pageImages);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error loading PDF:', error);
        setError(error.message || 'Failed to load PDF. Please try downloading it instead.');
        setIsLoading(false);
      }
    };
    
    loadPDF();
  }, [pdfPath, previewPages, isUnlocked]);

  const goToPrevPage = () => {
    if (flipBookRef.current && currentPage > 0) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (flipBookRef.current && currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      const page = pages[nextPage];
      
      // Check if next page is locked
      if (page && page.isLocked && onPurchase) {
        onPurchase();
        return;
      }
      
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handlePageChange = (e: any) => {
    setCurrentPage(e.data);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-900 rounded-2xl">
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <a
            href={pdfPath}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Download className="w-5 h-5" />
            Download PDF Instead
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-900 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Loading book...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-900 rounded-2xl">
        <div className="text-center text-white">
          <p>No pages to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controls - Compact on mobile */}
      <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-center px-2 md:px-4">
            <p className="text-white font-semibold text-sm md:text-base">
              <span className="hidden sm:inline">Page </span>{currentPage + 1}<span className="hidden sm:inline"> of {pages.length}</span>
              {!isUnlocked && previewPages < pages.length && (
                <span className="text-gray-400 text-xs md:text-sm ml-1 md:ml-2 hidden sm:inline">
                  ({previewPages} free preview)
                </span>
              )}
            </p>
            <p className="text-gray-400 text-xs sm:hidden">
              {currentPage + 1}/{pages.length}
            </p>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-1.5 md:p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <span className="text-white text-xs md:text-sm min-w-[50px] md:min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(2, scale + 0.1))}
            className="p-1.5 md:p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Flipbook Container - Optimized for mobile */}
      <div className="flex justify-center bg-gray-900 rounded-2xl p-2 md:p-4 lg:p-8 overflow-hidden">
        {pages.length > 0 && (
          <div 
            className="flipbook-wrapper w-full flex justify-center" 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <HTMLFlipBook
              ref={flipBookRef}
              width={bookSize.width}
              height={bookSize.height}
              minWidth={280}
              maxWidth={1200}
              minHeight={350}
              maxHeight={1600}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={handlePageChange}
              className="flipbook-container"
              style={{ 
                margin: '0 auto',
                maxWidth: '100%',
                height: 'auto'
              }}
            >
              {pages.map((page, index) => (
                <div
                  key={index}
                  className="page"
                  style={{
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  {page.isLocked ? (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 text-center p-8">
                      <Lock className="w-16 h-16 text-red-400 mb-6" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Unlock Full Access
                      </h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        This page is part of the full book. Purchase to unlock all {pages.length} pages and download the complete PDF.
                      </p>
                      {onPurchase && (
                        <button
                          onClick={onPurchase}
                          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                        >
                          Buy Full Book
                        </button>
                      )}
                    </div>
                  ) : (
                    <img
                      src={page.src}
                      alt={`Page ${page.pageNum}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        userSelect: 'none',
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* Download Button (if unlocked) */}
      {isUnlocked && (
        <div className="mt-6 text-center">
          <a
            href={pdfPath}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Full PDF
          </a>
        </div>
      )}

      {/* Preview Notice */}
      {!isUnlocked && pages.length > previewPages && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
          <p className="text-blue-400 text-sm">
            Preview: Pages 1-{previewPages} of {pages.length}. 
            <button
              onClick={onPurchase}
              className="ml-2 text-blue-300 hover:text-blue-200 font-semibold underline"
            >
              Unlock full book
            </button>
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Swipe left/right on mobile or click pages on desktop to navigate
        </p>
      </div>
    </div>
  );
}

