/**
 * Meta Pixel Configuration and Helper Functions
 * 
 * This module provides configuration and helper functions for Meta Pixel tracking.
 * The Pixel ID is read from NEXT_PUBLIC_META_PIXEL_ID environment variable.
 * 
 * If the Pixel ID is not set, all tracking functions will safely no-op.
 */

// Declare fbq function for TypeScript
declare global {
  interface Window {
    fbq: (
      action: 'init' | 'track' | 'trackCustom',
      eventName: string,
      params?: Record<string, any>
    ) => void;
    _fbq: typeof window.fbq;
  }
}

/**
 * Meta Pixel ID from environment variable
 * Falls back to empty string if not set (will skip initialization)
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Test Event Code for Meta Pixel testing (optional)
 * Set NEXT_PUBLIC_META_PIXEL_TEST_CODE in .env.local to enable test mode
 */
export const META_PIXEL_TEST_CODE = process.env.NEXT_PUBLIC_META_PIXEL_TEST_CODE || '';

/**
 * Check if Meta Pixel is configured
 */
export const isMetaPixelEnabled = (): boolean => {
  return typeof window !== 'undefined' && !!META_PIXEL_ID && typeof window.fbq === 'function';
};

/**
 * Initialize Meta Pixel
 * This should be called once when the page loads
 */
export const initMetaPixel = (): void => {
  if (typeof window === 'undefined' || !META_PIXEL_ID) {
    if (typeof window !== 'undefined') {
      console.warn('[Meta Pixel] Pixel ID not configured. Set NEXT_PUBLIC_META_PIXEL_ID in .env.local');
    }
    return;
  }

  // If already initialized, don't reinitialize
  if (window.fbq && window.fbq.loaded) {
    return;
  }

  // Initialize fbq queue if not already initialized
  if (!window.fbq) {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      t.id = 'facebook-pixel-script';
      s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
  }

  // Wait for script to load, then initialize
  const checkFbqLoaded = () => {
    if (window.fbq && typeof window.fbq === 'function') {
      try {
        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView');
        console.log('[Meta Pixel] Initialized with ID:', META_PIXEL_ID);
      } catch (error) {
        console.error('[Meta Pixel] Error initializing:', error);
      }
    } else {
      // Retry after a short delay
      setTimeout(checkFbqLoaded, 100);
    }
  };

  // Start checking after a brief delay to allow script to start loading
  setTimeout(checkFbqLoaded, 50);
};

/**
 * Track a PageView event
 * This is called automatically on route changes
 */
export const trackPageView = (): void => {
  if (!isMetaPixelEnabled()) {
    return;
  }

  try {
    window.fbq('track', 'PageView');
  } catch (error) {
    console.warn('[Meta Pixel] Error tracking PageView:', error);
  }
};

/**
 * Track a ViewContent event
 * Use this when a user views specific content (e.g., a product page, assessment page)
 */
export const trackViewContent = (params?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}): void => {
  if (!isMetaPixelEnabled()) {
    return;
  }

  try {
    window.fbq('track', 'ViewContent', params || {});
  } catch (error) {
    console.warn('[Meta Pixel] Error tracking ViewContent:', error);
  }
};

/**
 * Track a Lead event
 * Use this when a user submits a form or completes a lead-generating action
 */
export const trackLead = (params?: {
  content_name?: string;
  value?: number;
  currency?: string;
}): void => {
  if (!isMetaPixelEnabled()) {
    return;
  }

  try {
    window.fbq('track', 'Lead', params || {});
  } catch (error) {
    console.warn('[Meta Pixel] Error tracking Lead:', error);
  }
};

/**
 * Track a custom event
 * Use this for custom tracking needs
 */
export const trackCustom = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (!isMetaPixelEnabled()) {
    return;
  }

  try {
    window.fbq('trackCustom', eventName, params || {});
  } catch (error) {
    console.warn(`[Meta Pixel] Error tracking custom event ${eventName}:`, error);
  }
};

