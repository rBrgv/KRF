'use client';

import { useEffect } from 'react';

/**
 * Health Check Tracker Component
 * 
 * Tracks ViewContent event when user views the Health Check page.
 * This component should be placed in the Health Check page to track
 * when users view the assessment.
 */
export function HealthCheckTracker() {
  useEffect(() => {
    // Fire ViewContent on page load (only once per page view)
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: 'Health Check',
        content_category: 'HealthScoreTest',
        page_path: '/health-check',
      });
    }
  }, []); // Empty dependency array ensures it only fires once on mount

  // This component doesn't render anything
  return null;
}

